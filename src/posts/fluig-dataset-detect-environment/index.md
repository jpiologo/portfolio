---
title: "Fluig: a dataset to tell whether you're in production or staging"
date: 2026-10-20
description: How to build a dataset that detects, on the server side, which Fluig environment your code is running in, and why that stops staging from firing production integrations by mistake.
cover: ./cover.svg
---

Anyone maintaining processes on TOTVS Fluig almost always has at least two servers: **production** and **staging** (often called *homologação*, or "hml", in Brazilian projects). The code (datasets, workflow events, forms and widgets) is the same on both, but the behavior shouldn't be. In staging, an integration has to point to the test ERP, an email must not reach a real customer and an order must not land in the real finance team's queue.

In this post I'll walk through the dataset I use to answer a simple question, *"which server am I on?"*, in a way that works **anywhere** in Fluig, including the backend.

## The problem

The most common way to separate environments is to hard-code URLs and flags and remember to change them before exporting to production:

```js
// ⚠️ Before deploying to production, switch to the PROD URL!
var PROTHEUS_URL = "https://protheus-hml.yourcompany.com/rest";
```

That works until the day someone forgets. Both possible mistakes are expensive:

- **Staging code in production:** the real process integrates with the test ERP, and the data is lost.
- **Production code in staging:** a test fires **real** invoices, orders or emails.

Ideally, the code figures out where it's running and picks the right configuration on its own, with no manual changes between environments.

## Why not use `location.host`?

In the browser, the solution looks obvious:

```js
if (window.location.host === "fluig.yourcompany.com") { /* production */ }
```

The problem is that much of Fluig's important logic **doesn't run in the browser**. Datasets, workflow events (`beforeStateEntry`, `servicetask...`) and server-side form events run on **Rhino**, the JavaScript engine that lives inside Fluig's JVM. There is no `window` or `location` there.

We need a source of truth that's available **on the server**.

## The idea: ask Fluig itself

Fluig stores its general parameters in the **`FDN_PARAMGERAL`** database table, including the server's public URL. Each environment has its own database, so the URL stored there always belongs to the current server.

The dataset does four things:

1. Opens a connection to Fluig's database through the application server's **JNDI** datasource.
2. Reads the server URL from `FDN_PARAMGERAL`. It tries the `fluig/server.url` key first and, as a fallback, `totvs/serverIPAddress` and `DOMAIN`.
3. Extracts the host from the URL and compares it with the known production and staging hosts.
4. Returns a short answer: `"prod"` or `"hml"`.

And one golden rule: **when in doubt, it's staging**. If anything fails or the host is unknown, the dataset never answers `"prod"`. It's better for a production integration not to fire and someone to investigate than for a test to trigger something real.

## The complete code

Create a custom dataset named `dsEnvironment` with the code below. The only lines you **must** change are `PROD_HOST` and `HML_HOST`.

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

## How the code works

### Always one row, always the same columns

The dataset returns **exactly one row**, with `ENVIRONMENT`, `URL`, `HOST` and `ERROR`. Callers never have to handle an empty dataset or columns that only sometimes exist; they just read `ENVIRONMENT`. The other columns are there for troubleshooting: if something goes wrong, `ERROR` explains why and `URL`/`HOST` show what was read.

### Database access via JNDI

```js
var ctx = new javax.naming.InitialContext();
ds = ctx.lookup("java:/jdbc/FluigDS");
```

Since Rhino runs inside the JVM, the dataset can use Java classes directly. `InitialContext` looks up, in the application server, the same **datasource** Fluig itself uses to reach its database. That means the dataset needs no username, password or connection string.

The datasource name can vary between versions and installations, so the code tries `java:/jdbc/FluigDS` first and falls back to `java:/jdbc/Fluig`.

### Parameterized query and multiple keys

The query uses `prepareStatement` with `?` instead of string concatenation. It's good practice even when the value doesn't come from user input, and it lets the same `statement` be reused to try each key in turn. The first key with a value wins.

### Always close everything

The `finally` block closes the `ResultSet`, `Statement` and `Connection` in every scenario, with or without errors. The connection comes from a **pool** shared with Fluig itself. If the dataset leaks connections, the pool runs dry and the whole server starts to hang. Each `close()` has its own `try/catch` so that failing to close one resource doesn't prevent the others from being closed.

### Normalizing the host

The value stored in `FDN_PARAMGERAL` can come in different shapes: with or without `https://`, with a port (`:8080`), with a path (`/portal`) or in uppercase. The `extractHost` function strips all of that and keeps only the host, so the comparison is exact:

```text
"https://Fluig.YourCompany.com:443/portal/"  ->  "fluig.yourcompany.com"
```

### Two Rhino gotchas

- **`String(...)` isn't decoration.** `rs.getString()` returns a `java.lang.String`, not a JavaScript string. Without converting it with `String()`, `===` comparisons and some string methods can behave unexpectedly.
- **Trimming with a regex.** Older Rhino versions don't have `String.prototype.trim()`. That's why the code uses `.replace(/^\s+|\s+$/g, "")`, which works on any version.

## How to use it

### On the backend (workflow events and other datasets)

The most common case is choosing an integration's URL. Keep the URLs for each environment in one object and let the dataset decide:

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

The same applies to email recipients, ERP company/branch codes, ECM folders and any other setting that differs between environments.

### On the frontend (forms and widgets)

In the browser, `DatasetFactory` is available too, and it returns an object with a `values` array:

```js
var ds = DatasetFactory.getDataset("dsEnvironment", null, null, null);
var environment = ds.values[0].ENVIRONMENT;

if (environment === "hml") {
    // e.g. show a banner warning that this is a test environment
    $("body").prepend('<div class="alert alert-warning text-center">STAGING ENVIRONMENT</div>');
}
```

Even though you could use `location.host` in the browser, querying the dataset keeps **a single rule** for the whole system: frontend and backend always agree on which environment they're in.

## Implementing it in your environment

1. **Check what's stored in the database.** Run the query below on both the production and staging databases to see which keys exist and what values they hold:

   ```sql
   SELECT DATA_KEY, DATA_VALUE
     FROM FDN_PARAMGERAL
    WHERE DATA_KEY IN ('fluig/server.url', 'totvs/serverIPAddress', 'DOMAIN');
   ```

   If your installation stores the URL under a different key, add it to `PARAMGERAL_KEYS`.

2. **Set your hosts.** Replace `PROD_HOST` and `HML_HOST` with your servers' hosts, without `https://` and without a trailing slash.

3. **Create the dataset in Fluig Studio.** In your project, create a new **Custom Dataset** named `dsEnvironment` and paste the code.

4. **Export it to both servers.** The very same file, with no changes, goes to staging and to production. That's exactly the point.

5. **Test it.** Query the dataset in both environments, from Studio or from Fluig's datasets screen. Check that `ENVIRONMENT` is correct and that `ERROR` is empty. If `ERROR` has a value, the message tells you what failed: key not found, unmapped host or connection error.

6. **Replace the hard-coded values.** Find the URLs and flags in your code that are currently switched by hand, and replace them with `{ prod: ..., hml: ... }` maps that query the dataset.

## Going further

- **More environments:** if you also have development, training or more than one production server, turn the constants into a `host -> environment` map.
- **Configuration in one place:** instead of spreading `{ prod, hml }` maps across the code, create a second dataset (e.g. `dsSettings`) that uses `dsEnvironment` and returns every URL and parameter for the current environment.
- **Clearer logs:** include the environment in your `log.info`/`log.error` messages. When investigating an issue, you'll know right away where each line came from.

## Conclusion

A small dataset removes a whole class of errors: no more switching URLs by hand before a deploy, and no more tests firing real integrations. The same code runs in every environment, and the server it runs on decides how it behaves.

The most important part of the code isn't the database query; it's the rule of **failing safe**: if you're not sure it's production, treat it as staging.
