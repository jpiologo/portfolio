---
title: "Fluig: um dataset para saber se você está em produção ou homologação"
description: Como criar um dataset que detecta, no servidor, em qual ambiente do Fluig o código está rodando, e por que isso evita que a homologação dispare integrações de produção por engano.
---

Quem mantém processos no TOTVS Fluig quase sempre tem pelo menos dois servidores: **produção** e **homologação** (o famoso "hml"). O código (datasets, eventos de workflow, formulários e widgets) é o mesmo nos dois, mas o comportamento não deveria ser. Em homologação, uma integração precisa apontar para o ERP de testes, um e-mail não pode chegar a um cliente real e um pedido não pode cair na fila do financeiro de verdade.

Neste post vou mostrar o dataset que uso para responder a uma pergunta simples, *"em qual servidor eu estou?"*, de um jeito que funciona **em qualquer lugar** do Fluig, inclusive no backend.

## O problema

A forma mais comum de separar ambientes é fixar URLs e flags no código e lembrar de trocá-las antes de exportar para produção:

```js
// ⚠️ Before deploying to production, switch to the PROD URL!
var PROTHEUS_URL = "https://protheus-hml.yourcompany.com/rest";
```

Isso funciona até o dia em que alguém esquece. Os dois erros possíveis custam caro:

- **Código de homologação em produção:** o processo real se integra com o ERP de testes, e os dados se perdem.
- **Código de produção em homologação:** um teste dispara notas, pedidos ou e-mails **reais**.

O ideal é o código descobrir onde está rodando e escolher a configuração certa sozinho, sem nenhuma alteração manual entre ambientes.

## Por que não usar `location.host`?

No navegador, a solução parece óbvia:

```js
if (window.location.host === "fluig.yourcompany.com") { /* production */ }
```

O problema é que boa parte da lógica importante do Fluig **não roda no navegador**. Datasets, eventos de workflow (`beforeStateEntry`, `servicetask...`) e eventos de formulário do lado do servidor rodam no **Rhino**, o motor JavaScript que vive dentro da JVM do Fluig. Lá não existe `window` nem `location`.

Precisamos de uma fonte da verdade disponível **no servidor**.

## A ideia: perguntar ao próprio Fluig

O Fluig guarda seus parâmetros gerais na tabela **`FDN_PARAMGERAL`** do banco de dados, incluindo a URL pública do servidor. Cada ambiente tem o próprio banco, então a URL gravada ali sempre pertence ao servidor atual.

O dataset faz quatro coisas:

1. Abre uma conexão com o banco do Fluig pelo datasource **JNDI** do servidor de aplicação.
2. Lê a URL do servidor na `FDN_PARAMGERAL`. Tenta primeiro a chave `fluig/server.url` e, como alternativa, `totvs/serverIPAddress` e `DOMAIN`.
3. Extrai o host da URL e compara com os hosts conhecidos de produção e homologação.
4. Retorna uma resposta curta: `"prod"` ou `"hml"`.

E uma regra de ouro: **na dúvida, é homologação**. Se algo falhar ou o host for desconhecido, o dataset nunca responde `"prod"`. É melhor uma integração de produção não disparar e alguém investigar do que um teste acionar algo real.

## O código completo

Crie um dataset customizado chamado `dsEnvironment` com o código abaixo. As únicas linhas que você **precisa** alterar são `PROD_HOST` e `HML_HOST`.

```js
/**
 * dsEnvironment
 *
 * Detects which Fluig server the code is running on:
 *
 *   https://fluig.yourcompany.com      -> "prod"
 *   https://fluig-hml.yourcompany.com  -> "hml"
 *
 * Returned columns (always a single row):
 *   ENVIRONMENT -> "prod" | "hml"
 *   URL         -> full url of the current Fluig server (when detected)
 *   HOST        -> host of the current Fluig server (when detected)
 *   ERROR       -> error/warning message, or "" when detection succeeded
 */

var PROD_HOST = "fluig.yourcompany.com";
var HML_HOST  = "fluig-hml.yourcompany.com";

var PROD_ENVIRONMENT = "prod";
var HML_ENVIRONMENT  = "hml";

/** FDN_PARAMGERAL keys to look up, in order of preference. */
var PARAMGERAL_KEYS = ["fluig/server.url", "totvs/serverIPAddress", "DOMAIN"];

function createDataset(fields, constraints, sortFields) {

    var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("ENVIRONMENT");
    dataset.addColumn("URL");
    dataset.addColumn("HOST");
    dataset.addColumn("ERROR");

    try {

        var url = getFluigServerUrl();

        if (!url) {
            dataset.addRow([HML_ENVIRONMENT, "", "",
                "Fluig server parameter not found in FDN_PARAMGERAL. Assuming '" + HML_ENVIRONMENT + "'."]);
            return dataset;
        }

        var host = extractHost(url);

        if (host === PROD_HOST) {
            dataset.addRow([PROD_ENVIRONMENT, url, host, ""]);
            return dataset;
        }

        if (host === HML_HOST) {
            dataset.addRow([HML_ENVIRONMENT, url, host, ""]);
            return dataset;
        }

        // Unknown host (e.g. a local environment or a new server):
        // never treat it as production without certainty.
        dataset.addRow([HML_ENVIRONMENT, url, host,
            "Host '" + host + "' is not mapped as production or staging. Assuming '" + HML_ENVIRONMENT + "'."]);

        return dataset;

    } catch (e) {
        log.error("dsEnvironment - failed to detect the environment: " + e);
        dataset.addRow([HML_ENVIRONMENT, "", "",
            "Failed to detect the environment: " + e + ". Assuming '" + HML_ENVIRONMENT + "'."]);
        return dataset;
    }
}

/**
 * Reads the current Fluig server url from FDN_PARAMGERAL, trying the keys
 * in PARAMGERAL_KEYS in the defined order.
 * @returns {string} url (or host) of the current server, "" if no key exists
 */
function getFluigServerUrl() {

    var ctx = new javax.naming.InitialContext();

    var ds;
    try {
        ds = ctx.lookup("java:/jdbc/FluigDS");
    } catch (e1) {
        ds = ctx.lookup("java:/jdbc/Fluig");
    }

    var conn = null, stmt = null, rs = null;

    try {
        conn = ds.getConnection();
        stmt = conn.prepareStatement("SELECT DATA_VALUE FROM FDN_PARAMGERAL WHERE DATA_KEY = ?");

        for (var i = 0; i < PARAMGERAL_KEYS.length; i++) {

            stmt.setString(1, PARAMGERAL_KEYS[i]);
            rs = stmt.executeQuery();

            var value = "";
            if (rs.next() && rs.getString("DATA_VALUE") != null) {
                value = String(rs.getString("DATA_VALUE")).replace(/^\s+|\s+$/g, "");
            }

            rs.close();
            rs = null;

            if (value) {
                return value;
            }
        }

        return "";

    } finally {
        if (rs   != null) { try { rs.close();   } catch (e) {} }
        if (stmt != null) { try { stmt.close(); } catch (e) {} }
        if (conn != null) { try { conn.close(); } catch (e) {} }
    }
}

/**
 * Normalizes a url/host: strips protocol, port and path, and
 * converts it to lowercase.
 * @param {string} url e.g. "https://fluig.yourcompany.com/portal/"
 * @returns {string} e.g. "fluig.yourcompany.com"
 */
function extractHost(url) {

    var host = String(url).replace(/^\s+|\s+$/g, "").toLowerCase();

    host = host.replace(/^[a-z]+:\/\//, ""); // protocol
    host = host.replace(/\/.*$/, "");        // path
    host = host.replace(/:\d+$/, "");        // port

    return host;
}
```

## Como o código funciona

### Sempre uma linha, sempre as mesmas colunas

O dataset retorna **exatamente uma linha**, com `ENVIRONMENT`, `URL`, `HOST` e `ERROR`. Quem consome nunca precisa tratar um dataset vazio ou colunas que só existem às vezes; basta ler `ENVIRONMENT`. As outras colunas servem para diagnóstico: se algo der errado, `ERROR` explica o motivo e `URL`/`HOST` mostram o que foi lido.

### Acesso ao banco via JNDI

```js
var ctx = new javax.naming.InitialContext();
ds = ctx.lookup("java:/jdbc/FluigDS");
```

Como o Rhino roda dentro da JVM, o dataset pode usar classes Java diretamente. O `InitialContext` busca, no servidor de aplicação, o mesmo **datasource** que o próprio Fluig usa para acessar seu banco. Ou seja, o dataset não precisa de usuário, senha nem string de conexão.

O nome do datasource pode variar entre versões e instalações, então o código tenta primeiro `java:/jdbc/FluigDS` e, se não encontrar, usa `java:/jdbc/Fluig`.

### Consulta parametrizada e várias chaves

A consulta usa `prepareStatement` com `?` em vez de concatenar strings. É uma boa prática mesmo quando o valor não vem do usuário, e permite reaproveitar o mesmo `statement` para testar cada chave. A primeira chave com valor vence.

### Sempre feche tudo

O bloco `finally` fecha o `ResultSet`, o `Statement` e a `Connection` em qualquer cenário, com ou sem erro. A conexão vem de um **pool** compartilhado com o próprio Fluig. Se o dataset vazar conexões, o pool se esgota e o servidor inteiro começa a travar. Cada `close()` tem seu próprio `try/catch` para que a falha ao fechar um recurso não impeça os outros de serem fechados.

### Normalizando o host

O valor gravado na `FDN_PARAMGERAL` pode vir em formatos diferentes: com ou sem `https://`, com porta (`:8080`), com caminho (`/portal`) ou em maiúsculas. A função `extractHost` remove tudo isso e mantém só o host, para que a comparação seja exata:

```text
"https://Fluig.YourCompany.com:443/portal/"  ->  "fluig.yourcompany.com"
```

### Duas pegadinhas do Rhino

- **`String(...)` não é enfeite.** `rs.getString()` retorna uma `java.lang.String`, não uma string JavaScript. Sem a conversão com `String()`, comparações com `===` e alguns métodos de string podem se comportar de forma inesperada.
- **Trim com regex.** Versões mais antigas do Rhino não têm `String.prototype.trim()`. Por isso o código usa `.replace(/^\s+|\s+$/g, "")`, que funciona em qualquer versão.

## Como usar

### No backend (eventos de workflow e outros datasets)

O caso mais comum é escolher a URL de uma integração. Mantenha as URLs de cada ambiente em um único objeto e deixe o dataset decidir:

```js
var PROTHEUS_URLS = {
    prod: "https://protheus.yourcompany.com/rest",
    hml:  "https://protheus-hml.yourcompany.com/rest"
};

function servicetask12(attempt, message) {
    var ds = DatasetFactory.getDataset("dsEnvironment", null, null, null);
    var environment = ds.getValue(0, "ENVIRONMENT"); // "prod" or "hml"

    var protheusUrl = PROTHEUS_URLS[environment];
    // ... REST call using protheusUrl
}
```

O mesmo vale para destinatários de e-mail, códigos de empresa/filial do ERP, pastas do ECM e qualquer outra configuração que mude entre ambientes.

### No frontend (formulários e widgets)

No navegador, o `DatasetFactory` também está disponível e retorna um objeto com um array `values`:

```js
var ds = DatasetFactory.getDataset("dsEnvironment", null, null, null);
var environment = ds.values[0].ENVIRONMENT;

if (environment === "hml") {
    // e.g. show a banner warning that this is a test environment
    $("body").prepend('<div class="alert alert-warning text-center">STAGING ENVIRONMENT</div>');
}
```

Mesmo podendo usar `location.host` no navegador, consultar o dataset mantém **uma única regra** para o sistema inteiro: frontend e backend sempre concordam sobre em qual ambiente estão.

## Implementando no seu ambiente

1. **Confira o que está gravado no banco.** Rode a consulta abaixo nos bancos de produção e de homologação para ver quais chaves existem e quais valores elas têm:

   ```sql
   SELECT DATA_KEY, DATA_VALUE
     FROM FDN_PARAMGERAL
    WHERE DATA_KEY IN ('fluig/server.url', 'totvs/serverIPAddress', 'DOMAIN');
   ```

   Se a sua instalação guarda a URL em outra chave, adicione-a em `PARAMGERAL_KEYS`.

2. **Defina os seus hosts.** Substitua `PROD_HOST` e `HML_HOST` pelos hosts dos seus servidores, sem `https://` e sem barra no final.

3. **Crie o dataset no Fluig Studio.** No seu projeto, crie um novo **Dataset Customizado** chamado `dsEnvironment` e cole o código.

4. **Exporte para os dois servidores.** O mesmo arquivo, sem nenhuma alteração, vai para homologação e para produção. Esse é justamente o objetivo.

5. **Teste.** Consulte o dataset nos dois ambientes, pelo Studio ou pela tela de datasets do Fluig. Verifique se `ENVIRONMENT` está correto e se `ERROR` está vazio. Se `ERROR` tiver valor, a mensagem diz o que falhou: chave não encontrada, host não mapeado ou erro de conexão.

6. **Substitua os valores fixos.** Encontre no seu código as URLs e flags que hoje são trocadas manualmente e substitua por mapas `{ prod: ..., hml: ... }` que consultam o dataset.

## Indo além

- **Mais ambientes:** se você também tem desenvolvimento, treinamento ou mais de um servidor de produção, transforme as constantes em um mapa `host -> ambiente`.
- **Configuração em um só lugar:** em vez de espalhar mapas `{ prod, hml }` pelo código, crie um segundo dataset (por exemplo, `dsSettings`) que usa o `dsEnvironment` e retorna todas as URLs e parâmetros do ambiente atual.
- **Logs mais claros:** inclua o ambiente nas mensagens de `log.info`/`log.error`. Ao investigar um problema, você sabe na hora de onde veio cada linha.

## Conclusão

Um dataset pequeno elimina toda uma classe de erros: nada de trocar URLs na mão antes de um deploy, e nada de testes disparando integrações reais. O mesmo código roda em todos os ambientes, e o servidor onde ele está decide como ele se comporta.

A parte mais importante do código não é a consulta ao banco; é a regra de **falhar com segurança**: se você não tem certeza de que é produção, trate como homologação.
