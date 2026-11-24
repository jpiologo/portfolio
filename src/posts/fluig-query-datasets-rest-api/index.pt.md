---
title: "Fluig: como consultar datasets de fora pela API REST"
description: Como ler qualquer dataset do TOTVS Fluig a partir de um sistema externo, com a API REST pública e OAuth 1.0a, das credenciais a um exemplo em Node.js.
---

Há pouco tempo precisei ler um dataset customizado do Fluig a partir de uma API que roda **fora** da plataforma. Dentro do Fluig, isso é uma linha de código. Fora, não é óbvio por onde começar.

A resposta curta: o Fluig expõe os datasets na **API REST pública**, e isso vale para datasets internos, de formulário e customizados. A única barreira de verdade é a autenticação, que usa **OAuth 1.0a**.

Neste post vou das credenciais até uma requisição funcionando, para quem precisa dos dados do Fluig em um microsserviço, uma ferramenta de BI, um app ou um ERP.

## O problema

Dataset é a forma padrão do Fluig de expor dados tabulares. Ele pode ser **interno** (usuários, grupos, processos), gerado a partir de um **formulário** ou **customizado**, quando você escreve uma função `createDataset` que busca os dados de qualquer lugar.

Dentro da plataforma, ler um dataset é trivial:

```js
var ds = DatasetFactory.getDataset("dsRentalRequests", null, null, null);
```

Mas o `DatasetFactory` é um objeto fornecido pelo Fluig, tanto no servidor quanto nas páginas servidas por ele. Um serviço em Node.js ou uma aplicação Java não tem essa factory. Eles precisam fazer uma requisição HTTP e provar quem são.

## Passo 1: criar as credenciais OAuth

A API pública do Fluig [suporta OAuth 1.0 e 1.0a, e não é compatível com OAuth 2.0](https://tdn.totvs.com/display/public/fluig/Fluig+API). Ou seja, não há `client_credentials` nem Bearer token para buscar. Em vez disso, cada requisição é assinada com quatro valores:

| Valor           | O que identifica |
| --------------- | ---------------- |
| Consumer key    | A aplicação externa |
| Consumer secret | O segredo da aplicação, nunca enviado nas requisições à API |
| Token           | O usuário do Fluig em nome de quem a aplicação age |
| Token secret    | O segredo do token, nunca enviado nas requisições à API |

Um administrador cria esses valores no Painel de Controle do Fluig:

1. **WCM → OAuth Provider:** crie um provider ([referência no TDN](https://tdn.totvs.com/pages/viewpage.action?pageId=234455787)).
2. **WCM → OAuth APP:** crie um app informando consumer key, descrição, o provider do passo anterior e o consumer secret.
3. **Token de acesso:** na tela do app, gere o token para um **usuário aplicativo**. Isso entrega o token e o token secret.

O passo 3 é o que mantém tudo simples. O fluxo completo do OAuth (`request_token`, `authorize`, `access_token`) existe para que uma pessoa autorize um app a agir em seu nome. Em uma integração **servidor a servidor** não há ninguém para clicar em nada, então um token fixo vinculado a um usuário aplicativo é a opção mais simples.

> O dataset roda com as permissões desse usuário. Dê a ele apenas o acesso de que a integração precisa e, se o dataset tiver restrição de segurança, lembre-se de liberar o acesso para ele.

## Passo 2: escolher o endpoint

Todos os caminhos abaixo são relativos a `https://<seu-fluig>/api/public`:

| Endpoint | Quando usar |
| -------- | ----------- |
| `POST /ecm/dataset/datasets` | Consulta completa, com campos, constraints e ordenação. É o equivalente direto do `DatasetFactory.getDataset()` |
| `GET /ecm/dataset/search` | Filtro simples passado na query string. `limit` é obrigatório |
| `POST /ecm/dataset/search` | Mesma ideia do `GET`, com um body JSON |
| `GET /ecm/dataset/datasetStructure/{datasetId}` | Descobrir as colunas do dataset antes de montar a consulta |

Todos estão na [referência do DatasetServiceRest](https://api.fluig.com/old/resource_DatasetServiceRest.html). Ela aparece como documentação antiga, mas é a que descreve esses endpoints campo a campo.

Minha escolha padrão é o `POST /ecm/dataset/datasets`: ele corresponde um para um ao que você já conhece do `DatasetFactory`. Eu usaria o `GET /ecm/dataset/search` para algo como um campo de autocomplete, em que um único filtro e um limite bastam:

```text
GET /ecm/dataset/search?datasetId=dsRentalRequests&searchField=status&searchValue=OPEN&limit=50
```

Ele também aceita `filterFields`, `likeField`, `likeValue`, `resultFields` e `orderBy`.

## Passo 3: montar a consulta

O body do `POST /ecm/dataset/datasets` tem quatro campos, os mesmos quatro argumentos do `getDataset()`:

```json
{
  "name": "dsRentalRequests",
  "fields": ["requestId", "status", "customer"],
  "constraints": [
    {
      "_field": "status",
      "_initialValue": "OPEN",
      "_finalValue": "OPEN",
      "_type": 1,
      "_likeSearch": false
    }
  ],
  "order": ["requestId"]
}
```

- **`name`:** o código do dataset.
- **`fields`:** as colunas a retornar. Um array vazio (`[]`) retorna todas.
- **`constraints`:** os filtros. Um array vazio significa sem filtro.
- **`order`:** as colunas usadas na ordenação.

Cada constraint é o que o `DatasetFactory.createConstraint()` monta para você dentro do Fluig, só que escrita à mão:

| Argumento | Campo no JSON | Observações |
| --------- | ------------- | ----------- |
| campo | `_field` | Nome da coluna |
| valor inicial | `_initialValue` | Início do intervalo |
| valor final | `_finalValue` | Fim do intervalo (repita o inicial para buscar um só valor) |
| `ConstraintType` | `_type` | `1` = `MUST`, `2` = `SHOULD`, `3` = `MUST_NOT` |
| `likeSearch` | `_likeSearch` | `true` para uma busca com LIKE |

Atenção ao `_type`: o body de exemplo da documentação envia `0`, que não é um dos valores documentados. Use `1`, `2` ou `3`.

As linhas voltam em `content.values`, um objeto por linha:

```json
{
  "content": {
    "columns": ["requestId", "status", "customer"],
    "values": [
      { "requestId": "1024", "status": "OPEN", "customer": "ACME" }
    ]
  },
  "message": null
}
```

## Passo 4: testar no Postman

Antes de escrever qualquer código, confirme que as credenciais e o endpoint funcionam:

1. Crie uma requisição `POST` para `https://<seu-fluig>/api/public/ecm/dataset/datasets`.
2. Em **Authorization**, escolha **OAuth 1.0** e preencha os quatro valores.
3. Defina o signature method como **HMAC-SHA1** e envie os dados de autorização nos **headers da requisição**.
4. Em **Body**, escolha **raw / JSON** e cole a consulta do passo 3.

Se isso retornar linhas, o que falhar daqui para frente provavelmente está no seu código, não na configuração do Fluig.

## Passo 5: o código

O exemplo usa Node.js (20.6 ou mais novo) e a biblioteca [`oauth-1.0a`](https://www.npmjs.com/package/oauth-1.0a), que cuida da assinatura:

```bash
npm install oauth-1.0a
```

As credenciais ficam fora do código, em um arquivo `.env` que **não vai para o Git**:

```bash
FLUIG_URL=https://fluig.yourcompany.com
FLUIG_CONSUMER_KEY=your-consumer-key
FLUIG_CONSUMER_SECRET=your-consumer-secret
FLUIG_TOKEN=your-token
FLUIG_TOKEN_SECRET=your-token-secret
```

E este é o exemplo completo, em um arquivo chamado `fluig.mjs`:

```js
import crypto from "node:crypto";
import OAuth from "oauth-1.0a";

const {
  FLUIG_URL,
  FLUIG_CONSUMER_KEY,
  FLUIG_CONSUMER_SECRET,
  FLUIG_TOKEN,
  FLUIG_TOKEN_SECRET,
} = process.env;

// Same values as ConstraintType inside Fluig
const ConstraintType = { MUST: 1, SHOULD: 2, MUST_NOT: 3 };

const oauth = new OAuth({
  consumer: { key: FLUIG_CONSUMER_KEY, secret: FLUIG_CONSUMER_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function: (baseString, key) =>
    crypto.createHmac("sha1", key).update(baseString).digest("base64"),
});

const token = { key: FLUIG_TOKEN, secret: FLUIG_TOKEN_SECRET };

/** Sends a signed request to the Fluig public API and returns its `content`. */
async function callFluig(method, path, body) {
  const url = `${FLUIG_URL}/api/public${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      ...oauth.toHeader(oauth.authorize({ url, method }, token)),
      "Content-Type": "application/json",
    },
    body: body && JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Fluig answered ${response.status}: ${await response.text()}`);
  }

  return (await response.json()).content;
}

function equalTo(field, value) {
  return {
    _field: field,
    _initialValue: value,
    _finalValue: value,
    _type: ConstraintType.MUST,
    _likeSearch: false,
  };
}

/** Equivalent of DatasetFactory.getDataset(), returning an array of rows. */
async function getDataset(name, { fields = [], constraints = [], order = [] } = {}) {
  const content = await callFluig("POST", "/ecm/dataset/datasets", {
    name,
    fields,
    constraints,
    order,
  });
  return content.values;
}

const requests = await getDataset("dsRentalRequests", {
  fields: ["requestId", "status", "customer"],
  constraints: [equalTo("status", "OPEN")],
  order: ["requestId"],
});

console.log(requests);
```

Execute com:

```bash
node --env-file=.env fluig.mjs
```

Três detalhes que vale notar:

- **O body JSON não é assinado.** O OAuth 1.0a só assina os parâmetros do OAuth, a query string e bodies form-urlencoded. Por isso o `authorize()` recebe apenas a URL e o método.
- **A query string é assinada.** Se você chamar o `GET /ecm/dataset/search`, passe ao `authorize()` a URL completa, com os parâmetros. O `callFluig` já faz isso, porque o `path` inclui a query string.
- **Autenticação e consulta são separadas.** O `callFluig` só sabe assinar e enviar, então serve também para os outros endpoints, e o `getDataset` só conhece o formato de uma consulta de dataset.

Se quiser ver como a assinatura é montada por baixo dos panos, descrevi o passo a passo no [post sobre deploy de datasets com Jenkins](/blog/fluig-deploy-pipeline-jenkins). Em Java ou Spring, a biblioteca [ScribeJava](https://github.com/scribejava/scribejava) faz o mesmo trabalho.

## Armadilhas

### Dataset vazio pode ser problema de permissão

O resultado depende do usuário vinculado ao token. Se a requisição retornar `200` sem nenhuma linha, não conclua que não há dados. Rode a mesma consulta dentro do Fluig, logado com um usuário que tenha as mesmas permissões, e compare.

### Datasets customizados não filtram sozinhos

O [guia de customização de datasets](https://tdn.totvs.com/pages/viewpage.action?pageId=268583266) da TOTVS diz que constraints valem para datasets internos. Em um dataset customizado, o filtro precisa ser **implementado no seu próprio código**. Se o `createDataset` ignorar as `constraints`, espere receber todas as linhas, não importa o que envie no body.

Um pequeno helper do lado do dataset resolve:

```js
function createDataset(fields, constraints, sortFields) {
    var status = getConstraintValue(constraints, "status");
    // ... use `status` as a parameter of your query
}

/** Value received for a field, or null when the caller didn't filter by it. */
function getConstraintValue(constraints, field) {
    if (constraints == null) {
        return null;
    }
    for (var i = 0; i < constraints.length; i++) {
        if (String(constraints[i].fieldName) === field) {
            return String(constraints[i].initialValue);
        }
    }
    return null;
}
```

Se o valor for parar em uma consulta SQL, passe-o como parâmetro de um `prepareStatement`, e nunca concatenando strings: agora ele vem de fora da plataforma.

### Segredo é segredo

Com esses quatro valores, qualquer pessoa consegue chamar a API como o seu usuário aplicativo. Guarde-os em variáveis de ambiente ou em um secret manager, use um conjunto diferente para cada ambiente e sempre use **HTTPS**: o OAuth 1.0a assina a requisição, mas não a criptografa.

### Volume

Um dataset grande sem filtro pode ser lento para quem chama e pesado para o servidor do Fluig. Filtre na origem, peça em `fields` só as colunas necessárias e, se os dados não mudam a cada minuto, faça cache do seu lado.

## Checklist

- [ ] Provider e app OAuth criados em **cada** ambiente do Fluig
- [ ] Token gerado para um usuário aplicativo com o mínimo de permissões
- [ ] Requisição funcionando no Postman antes de escrever código
- [ ] Dataset customizado tratando as `constraints` que recebe
- [ ] Só as colunas necessárias em `fields`
- [ ] Credenciais em variáveis de ambiente ou em um secret manager
- [ ] HTTPS em tudo

## Conclusão

Ler um dataset do Fluig de fora se resume a um `POST` assinado. Depois que as credenciais existem, o body é o `getDataset()` que você já conhece, escrito em JSON.

Isso abre caminho para alimentar um painel de BI, deixar um microsserviço consultar dados de um formulário ou sincronizar informações com outro sistema, sem acesso direto ao banco do Fluig. O dataset vira o contrato: o que está por trás dele pode mudar sem quebrar quem o consome.
