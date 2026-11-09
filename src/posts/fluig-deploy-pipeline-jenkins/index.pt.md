---
title: "CI/CD para Fluig: deploy de datasets com Jenkins e a API REST do Fluig"
description: Um guia curto e prático de um pipeline Jenkins que detecta o que mudou no Git e faz o deploy de datasets do Fluig pela API REST padrão da plataforma.
---

Por muito tempo, fazer deploy no Fluig significava abrir o Fluig Studio, clicar com o botão direito em um arquivo e escolher *Exportar*. Isso funciona para um desenvolvedor e um servidor. Com um time, um servidor de homologação e produção, exportar na mão é lento, fácil de esquecer e impossível de auditar.

A boa notícia: o Fluig expõe **APIs REST padrão** para datasets, formulários e processos, todas documentadas na [referência oficial da API do Fluig](https://api.fluig.com/latest/index.html). Neste post vou mostrar o formato geral de um pipeline Jenkins construído sobre elas, com foco em um artefato: **datasets**. É um guia curto, não completo. O objetivo é dar um caminho a partir do qual você possa evoluir.

> Os trechos abaixo são ilustrações simplificadas de cada ideia, não código de produção. Adapte nomes, caminhos e tratamento de erros ao seu projeto.

## Visão geral

```text
git push ──> Jenkins ──> which files changed? ──> sign request (OAuth 1.0) ──> Fluig REST API
                │
                └── branch decides the target: main -> production, anything else -> staging
```

O pipeline faz cinco coisas:

1. Escolhe o servidor de destino a partir da branch.
2. Descobre quais arquivos mudaram desde o último build bem-sucedido.
3. Carrega do Jenkins as credenciais da API daquele ambiente.
4. Envia cada dataset alterado para a API do Fluig.
5. Reporta o resultado (e marca o build como *unstable* em caso de falhas parciais).

## Pré-requisitos

- **Seu projeto Fluig no Git.** A estrutura padrão do Fluig Studio funciona como está. Cada pasta de processo tem suas próprias pastas `datasets/`, `forms/` e `workflow/`.
- **Jenkins** com o plugin *Pipeline*. O plugin *Pipeline Utility Steps* ajuda a ler e escrever arquivos JSON e de propriedades.
- **Credenciais OAuth para cada servidor Fluig.** No Painel de Controle do Fluig, cadastre um consumidor OAuth e um usuário aplicativo. Você vai terminar com quatro valores: consumer key, consumer secret, access token e token secret. Dê a esse usuário apenas as permissões que o deploy precisa.

> **Dica:** antes de automatizar qualquer coisa, chame a API pelo Postman. Ele já suporta *OAuth 1.0* com *HMAC-SHA1*, então você confirma que suas chaves e o endpoint funcionam antes de depurar Groovy.

## Passo 1: escolher o ambiente pela branch

Mantenha a regra simples e faça da homologação o padrão. Um pequeno mapa basta:

```groovy
// Illustrative: any branch not listed here goes to staging
def targets = [main: 'production']
def target = targets.get(env.BRANCH_NAME, 'staging')
```

O merge na branch principal faz deploy em produção; todo o resto vai para homologação. Assim como no [post do dataset de ambiente](/blog/fluig-dataset-detect-environment), o padrão é o caminho seguro. Guarde a URL do servidor de cada ambiente junto com as credenciais dele (passo 3), em vez de fixá-la no pipeline.

## Passo 2: fazer deploy só do que mudou

Comparar com `HEAD^` enxerga apenas o último commit. Se um push tem três commits, ou se o build anterior falhou, mudanças se perdem. Compare com o **último build bem-sucedido**. O plugin Git do Jenkins expõe esse commit como `GIT_PREVIOUS_SUCCESSFUL_COMMIT`, e o Git consegue filtrar o resultado por caminho:

```bash
# List datasets changed between the last successful build and now
git diff --name-only <last-successful-commit> HEAD -- '*/datasets/*.js'
```

Dois detalhes para tratar em volta desse comando:

- **O primeiro build não tem commit bem-sucedido anterior**, e esse commit também pode sumir depois de um force-push. Tenha uma alternativa sensata, como o commit anterior ou um deploy completo.
- **Ignore arquivos que não existem mais.** Um dataset excluído continua aparecendo no diff. Excluir datasets no servidor é uma decisão que você provavelmente quer manter manual.

## Passo 3: carregar as credenciais por ambiente

Guarde os valores OAuth de cada ambiente (e a URL do servidor) nas **credenciais do Jenkins**, uma entrada por servidor, e só leia esses valores dentro de um bloco `withCredentials`:

```groovy
// Illustrative: the credential ID and file format are up to you
withCredentials([file(credentialsId: "<credentials-id-for-${target}>", variable: 'CREDS_FILE')]) {
    // read the four OAuth values and the server URL from CREDS_FILE
}
```

Nunca escreva tokens, senhas ou URLs de webhook direto no `Jenkinsfile`. Qualquer pessoa com acesso de leitura ao repositório teria acesso a eles.

## Passo 4: assinar as requisições com OAuth 1.0

A API do Fluig usa **OAuth 1.0a com HMAC-SHA1** ([RFC 5849](https://www.rfc-editor.org/rfc/rfc5849)). Você não envia os segredos em si; cada requisição leva uma assinatura montada assim:

1. Reúna **todos** os parâmetros: os parâmetros de query da requisição mais os do OAuth (`oauth_consumer_key`, `oauth_token`, `oauth_signature_method=HMAC-SHA1`, `oauth_timestamp`, `oauth_nonce`, `oauth_version=1.0`).
2. Aplique percent-encoding em cada nome e valor, ordene pelo nome e junte no formato `nome=valor&nome=valor`.
3. Monte a *signature base string*: `METODO&url-codificada&parametros-codificados`.
4. Assine com HMAC-SHA1, usando `consumer-secret&token-secret` como chave, e codifique o resultado em Base64.
5. Envie os parâmetros junto com `oauth_signature`, na query string ou em um header `Authorization`.

Você pode implementar isso em um pequeno helper em Groovy ou usar uma biblioteca de OAuth. De qualquer forma, duas coisas me custaram tempo:

- **Os parâmetros de query do negócio fazem parte da assinatura.** Se a requisição tem `?ignoreConflicts=true`, ele precisa entrar *antes* de assinar. Caso contrário, o Fluig responde `401`.
- **Script security do Jenkins.** Usar classes Java de criptografia (como `javax.crypto.Mac`) em um pipeline pode falhar da primeira vez com `RejectedAccessException`. Um administrador precisa aprovar a assinatura em *Manage Jenkins → In-process Script Approval*.

## Passo 5: fazer o deploy de um dataset

O endpoint é `POST /dataset/api/v2/datasets`. O corpo é um JSON com uma lista de datasets, em que `impl` é o **código-fonte completo** do arquivo `.js`:

```json
{
  "datasets": [
    {
      "code": "dsExample",
      "description": "dsExample",
      "impl": "function createDataset(fields, constraints, sortFields) { ... }"
    }
  ]
}
```

Com `ignoreConflicts=true`, a mesma chamada **cria** um dataset novo ou **atualiza** um existente, então o pipeline não precisa verificar antes.

A etapa de deploy segue este fluxo:

```text
for each changed dataset file:
    name     = file name without ".js"
    payload  = { datasets: [ { code: name, description: name, impl: <file contents> } ] }
    response = signed POST to <server>/dataset/api/v2/datasets?ignoreConflicts=true
    if the status is not 2xx:
        log the error and add the file to the failures list
        continue with the next file

if there are failures: mark the build as unstable and list them
```

Algumas observações práticas:

- **Deixe uma biblioteca JSON montar o payload.** O código-fonte está cheio de aspas e quebras de linha, e escapar tudo na mão é um jeito garantido de quebrar a requisição.
- **Um dataset com falha não deve parar os outros.** Trate os erros por arquivo, siga em frente e termine o build como **unstable**, com a lista do que falhou.
- **Registre o corpo da resposta em caso de erro.** As mensagens de erro do Fluig costumam dizer exatamente o que está errado (erro de sintaxe no dataset, permissão faltando, assinatura inválida).

## Próximos passos

Datasets são o artefato mais fácil para começar. O mesmo padrão (diff → assinar → chamar a API) se estende ao resto do projeto. A [referência da API do Fluig](https://api.fluig.com/latest/index.html) lista cada endpoint com seus parâmetros e payloads, então consulte-a para os detalhes exatos de cada chamada:

- **Formulários:** `POST`/`PUT /ecm-forms/api/v2/cardindex`, enviando a pasta do formulário compactada como `multipart/form-data`.
- **Diagramas de processo:** `POST /process-management/api/v2/processes/{processId}/import/xml`, com o `.xml` de `workflow/.resources` como corpo.
- **Notificações:** envie o status final para Slack, Teams ou Google Chat em um bloco `post { always { ... } }`. Guarde a URL do webhook também nas credenciais do Jenkins.
- **Testes automatizados:** a TOTVS apresentou uma etapa de testes com Node.js e JUnit no [Universo TOTVS 2026](/blog/universo-totvs-2026-fluig-highlights). Ela se encaixa naturalmente antes das etapas de deploy.

## Checklist

- [ ] Projeto Fluig versionado no Git
- [ ] Consumidor OAuth + usuário aplicativo criados em **cada** servidor Fluig
- [ ] Credenciais guardadas no Jenkins, uma entrada por ambiente
- [ ] Branch principal faz deploy em produção; as outras, em homologação
- [ ] Diff contra o último build bem-sucedido, não só `HEAD^`
- [ ] Parâmetros de query incluídos na assinatura OAuth
- [ ] HTTPS nos dois servidores (o OAuth 1.0 assina as requisições, mas não as criptografa, e o seu código-fonte viaja no corpo)

Depois que os datasets passam a ser publicados a cada push, ninguém sente falta do menu *Exportar*.
