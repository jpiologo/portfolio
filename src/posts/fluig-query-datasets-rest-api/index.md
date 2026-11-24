---
title: "Fluig: how to query datasets from outside via REST API"
date: 2026-11-24
description: How to read any TOTVS Fluig dataset from an external system with the public REST API and OAuth 1.0a, from the credentials to a working Node.js example.
cover: ./cover.svg
---

I recently had to read a custom Fluig dataset from an API that runs **outside** the platform. Inside Fluig that's one line of code. Outside, it isn't obvious where to start.

The short answer: Fluig exposes its datasets in the **public REST API**, and that covers internal, form and custom datasets. The only real barrier is authentication, which uses **OAuth 1.0a**.

In this post I'll go from the credentials to a working request, for anyone who needs Fluig data in a microservice, a BI tool, an app or an ERP.

## The problem

A dataset is Fluig's standard way to expose tabular data. It can be **internal** (users, groups, processes), generated from a **form**, or **custom**, when you write a `createDataset` function that fetches data from anywhere.

Inside the platform, reading one is trivial:

```js
var ds = DatasetFactory.getDataset("dsRentalRequests", null, null, null);
```

But `DatasetFactory` is an object provided by Fluig, both on the server and in pages served by it. A Node.js service or a Java application has no such factory. It has to make an HTTP request and prove who it is.

## Step 1: create the OAuth credentials

Fluig's public API [supports OAuth 1.0 and 1.0a, and is not compatible with OAuth 2.0](https://tdn.totvs.com/display/public/fluig/Fluig+API). So there's no `client_credentials` and no Bearer token to fetch. Instead, each request is signed with four values:

| Value           | What it identifies |
| --------------- | ------------------ |
| Consumer key    | The external application |
| Consumer secret | The application's secret, never sent in API requests |
| Token           | The Fluig user the application acts as |
| Token secret    | The token's secret, never sent in API requests |

An administrator creates them in Fluig's Control Panel:

1. **WCM → OAuth Provider:** create a provider ([TDN reference](https://tdn.totvs.com/pages/viewpage.action?pageId=234455787)).
2. **WCM → OAuth APP:** create an app with a consumer key, a description, the provider from the previous step and a consumer secret.
3. **Access token:** on the app's screen, generate the token for an **application user**. This gives you the token and token secret.

Step 3 is what keeps things simple. The full OAuth flow (`request_token`, `authorize`, `access_token`) exists so that a human can authorize an app to act on their behalf. In a **server-to-server** integration there's no human to click anything, so a fixed token tied to an application user is the simplest option.

> The dataset runs with the permissions of that user. Give it only the access the integration needs, and if the dataset has security restrictions, remember to grant this user access to it.

## Step 2: choose the endpoint

Every path below is relative to `https://<your-fluig>/api/public`:

| Endpoint | When to use it |
| -------- | -------------- |
| `POST /ecm/dataset/datasets` | Full query with fields, constraints and ordering. The direct equivalent of `DatasetFactory.getDataset()` |
| `GET /ecm/dataset/search` | Simple filter passed in the query string. `limit` is required |
| `POST /ecm/dataset/search` | Same idea as the `GET`, with a JSON body |
| `GET /ecm/dataset/datasetStructure/{datasetId}` | Discover the dataset's columns before building a query |

They're all in the [DatasetServiceRest reference](https://api.fluig.com/old/resource_DatasetServiceRest.html). It's labeled as the old documentation, but it's the one that describes these endpoints field by field.

My default is `POST /ecm/dataset/datasets`: it maps one-to-one to what you already know from `DatasetFactory`. I'd use `GET /ecm/dataset/search` for something like an autocomplete field, where a single filter and a limit are enough:

```text
GET /ecm/dataset/search?datasetId=dsRentalRequests&searchField=status&searchValue=OPEN&limit=50
```

It also accepts `filterFields`, `likeField`, `likeValue`, `resultFields` and `orderBy`.

## Step 3: build the query

The body of `POST /ecm/dataset/datasets` has four fields, the same four arguments of `getDataset()`:

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

- **`name`:** the dataset's code.
- **`fields`:** the columns to return. An empty array (`[]`) returns all of them.
- **`constraints`:** the filters. An empty array means no filter.
- **`order`:** the columns used for sorting.

Each constraint is what `DatasetFactory.createConstraint()` builds for you inside Fluig, written by hand:

| Argument | JSON field | Notes |
| -------- | ---------- | ----- |
| field | `_field` | Column name |
| initial value | `_initialValue` | Start of the range |
| final value | `_finalValue` | End of the range (repeat the initial value to match just one) |
| `ConstraintType` | `_type` | `1` = `MUST`, `2` = `SHOULD`, `3` = `MUST_NOT` |
| `likeSearch` | `_likeSearch` | `true` for a LIKE search |

Watch out for `_type`: the sample body in the documentation sends `0`, which isn't one of the documented values. Use `1`, `2` or `3`.

The rows come back in `content.values`, one object per row:

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

## Step 4: test it in Postman

Before writing any code, confirm that the credentials and the endpoint work:

1. Create a `POST` request to `https://<your-fluig>/api/public/ecm/dataset/datasets`.
2. In **Authorization**, choose **OAuth 1.0** and fill in the four values.
3. Set the signature method to **HMAC-SHA1** and send the authorization data in the **request headers**.
4. In **Body**, choose **raw / JSON** and paste the query from step 3.

If this returns rows, anything that fails from here on is most likely in your code, not in the Fluig setup.

## Step 5: the code

The example uses Node.js (20.6 or newer) and the [`oauth-1.0a`](https://www.npmjs.com/package/oauth-1.0a) library, which takes care of the signature:

```bash
npm install oauth-1.0a
```

The credentials stay out of the code, in a `.env` file that **doesn't go to Git**:

```bash
FLUIG_URL=https://fluig.yourcompany.com
FLUIG_CONSUMER_KEY=your-consumer-key
FLUIG_CONSUMER_SECRET=your-consumer-secret
FLUIG_TOKEN=your-token
FLUIG_TOKEN_SECRET=your-token-secret
```

And this is the whole thing, in a file named `fluig.mjs`:

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

Run it with:

```bash
node --env-file=.env fluig.mjs
```

Three details worth noting:

- **The JSON body isn't signed.** OAuth 1.0a only signs the OAuth parameters, the query string and form-urlencoded bodies. That's why `authorize()` receives just the URL and the method.
- **The query string is signed.** If you call `GET /ecm/dataset/search`, pass `authorize()` the full URL, with the parameters. `callFluig` already does that, because `path` includes the query string.
- **Authentication and query are separate.** `callFluig` only knows how to sign and send, so it works for the other endpoints too, and `getDataset` only knows the format of a dataset query.

If you want to see how the signature is built under the hood, I described it step by step in the [post about deploying datasets with Jenkins](/blog/fluig-deploy-pipeline-jenkins). In Java or Spring, the [ScribeJava](https://github.com/scribejava/scribejava) library does the same job.

## Pitfalls

### An empty dataset may be a permission problem

The result depends on the user tied to the token. If the request returns `200` with no rows, don't assume there's no data. Run the same query inside Fluig, logged in with a user that has the same permissions, and compare.

### Custom datasets don't filter by themselves

TOTVS's [dataset customization guide](https://tdn.totvs.com/pages/viewpage.action?pageId=268583266) says constraints apply to internal datasets. In a custom dataset, the filter has to be **implemented in your own code**. If `createDataset` ignores `constraints`, expect to get every row back, no matter what you send in the body.

A small helper on the dataset side solves it:

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

If the value ends up in a SQL query, pass it through a `prepareStatement` parameter and never by concatenating strings: it now comes from outside the platform.

### Secrets are secrets

With these four values, anyone can call the API as your application user. Keep them in environment variables or a secret manager, use a different set for each environment, and always use **HTTPS**: OAuth 1.0a signs the request, but it doesn't encrypt it.

### Volume

A large dataset with no filter can be slow for the caller and heavy for the Fluig server. Filter at the source, ask only for the columns you need in `fields` and, if the data doesn't change every minute, cache it on your side.

## Checklist

- [ ] OAuth provider and app created in **each** Fluig environment
- [ ] Token generated for an application user with the minimum permissions
- [ ] Request working in Postman before writing code
- [ ] Custom dataset handling the `constraints` it receives
- [ ] Only the necessary columns in `fields`
- [ ] Credentials in environment variables or a secret manager
- [ ] HTTPS everywhere

## Conclusion

Reading a Fluig dataset from outside comes down to one signed `POST`. Once the credentials exist, the body is the `getDataset()` you already know, written as JSON.

That opens the door to feeding a BI dashboard, letting a microservice check data from a form or syncing information with another system, with no direct access to Fluig's database. The dataset becomes the contract: what's behind it can change without breaking whoever consumes it.
