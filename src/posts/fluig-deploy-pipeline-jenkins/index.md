---
title: "CI/CD for Fluig: deploying datasets with Jenkins and the Fluig REST API"
date: 2026-10-20
description: A short, practical walkthrough of a Jenkins pipeline that detects what changed in Git and deploys Fluig datasets through the platform's standard REST API.
cover: ./cover.svg
---

For a long time, deploying to Fluig meant opening Fluig Studio, right-clicking a file and choosing *Export*. That's fine for one developer and one server. With a team, a staging server and production, manual exports are slow, easy to forget and impossible to audit.

The good news: Fluig exposes **standard REST APIs** for datasets, forms and processes, all documented in the [official Fluig API reference](https://api.fluig.com/latest/index.html). In this post I'll walk through the general shape of a Jenkins pipeline built on them, focusing on one artifact: **datasets**. It's a short guide, not a complete one. The goal is to give you a path you can grow from.

> The snippets below are simplified illustrations of each idea, not production code. Adapt names, paths and error handling to your own project.

## The big picture

```text
git push ──> Jenkins ──> which files changed? ──> sign request (OAuth 1.0) ──> Fluig REST API
                │
                └── branch decides the target: main -> production, anything else -> staging
```

The pipeline does five things:

1. Picks the target server from the branch.
2. Finds which files changed since the last successful build.
3. Loads that environment's API credentials from Jenkins.
4. Sends each changed dataset to the Fluig API.
5. Reports the result (and marks the build as *unstable* on partial failures).

## Prerequisites

- **Your Fluig project in Git.** The standard Fluig Studio layout works as-is. Each process folder has its own `datasets/`, `forms/` and `workflow/` folders.
- **Jenkins** with the *Pipeline* plugin. The *Pipeline Utility Steps* plugin is handy for reading and writing JSON and properties files.
- **OAuth credentials for each Fluig server.** In Fluig's Control Panel, register an OAuth consumer and an application user. You'll end up with four values: consumer key, consumer secret, access token and token secret. Give that user only the permissions the deploy needs.

> **Tip:** before automating anything, call the API from Postman. It supports *OAuth 1.0* with *HMAC-SHA1* out of the box, so you can confirm your keys and the endpoint work before debugging Groovy.

## Step 1: choose the environment from the branch

Keep the rule simple and make staging the default. A small lookup is enough:

```groovy
// Illustrative: any branch not listed here goes to staging
def targets = [main: 'production']
def target = targets.get(env.BRANCH_NAME, 'staging')
```

Merging into the main branch deploys to production; everything else goes to staging. Just like in the [environment dataset post](/blog/fluig-dataset-detect-environment), the default is the safe one. Keep each environment's server URL next to its credentials (step 3) instead of hard-coding it in the pipeline.

## Step 2: deploy only what changed

Comparing against `HEAD^` only sees the last commit. If a push has three commits, or the previous build failed, changes get lost. Compare against the **last successful build** instead. The Jenkins Git plugin exposes that commit as `GIT_PREVIOUS_SUCCESSFUL_COMMIT`, and Git can filter the result by path:

```bash
# List datasets changed between the last successful build and now
git diff --name-only <last-successful-commit> HEAD -- '*/datasets/*.js'
```

Two details to handle around that command:

- **The first build has no previous successful commit**, and that commit may also disappear after a force-push. Fall back to something sensible, such as the previous commit or a full deploy.
- **Skip files that no longer exist.** A deleted dataset still shows up in the diff. Deleting datasets on the server is a decision you probably want to keep manual.

## Step 3: load credentials per environment

Store each environment's OAuth values (and its server URL) in **Jenkins credentials**, one entry per server, and only read them inside a `withCredentials` block:

```groovy
// Illustrative: the credential ID and file format are up to you
withCredentials([file(credentialsId: "<credentials-id-for-${target}>", variable: 'CREDS_FILE')]) {
    // read the four OAuth values and the server URL from CREDS_FILE
}
```

Never write tokens, passwords or webhook URLs directly in the `Jenkinsfile`. Anyone with read access to the repository would have them.

## Step 4: sign requests with OAuth 1.0

Fluig's API uses **OAuth 1.0a with HMAC-SHA1** ([RFC 5849](https://www.rfc-editor.org/rfc/rfc5849)). You don't send the secrets themselves; every request carries a signature built like this:

1. Collect **all** parameters: the request's query parameters plus the OAuth ones (`oauth_consumer_key`, `oauth_token`, `oauth_signature_method=HMAC-SHA1`, `oauth_timestamp`, `oauth_nonce`, `oauth_version=1.0`).
2. Percent-encode each name and value, sort them by name and join them as `name=value&name=value`.
3. Build the *signature base string*: `METHOD&encoded-url&encoded-parameters`.
4. Sign it with HMAC-SHA1, using `consumer-secret&token-secret` as the key, and Base64-encode the result.
5. Send the parameters along with `oauth_signature`, either in the query string or in an `Authorization` header.

You can implement this in a small Groovy helper or use an OAuth library. Either way, two things cost me time:

- **Business query parameters are part of the signature.** If the request has `?ignoreConflicts=true`, it must be included *before* signing. Otherwise Fluig answers `401`.
- **Jenkins script security.** Using Java crypto classes (like `javax.crypto.Mac`) from a pipeline may fail the first time with `RejectedAccessException`. An admin needs to approve the signature under *Manage Jenkins → In-process Script Approval*.

## Step 5: deploy a dataset

The endpoint is `POST /dataset/api/v2/datasets`. The body is a JSON with a list of datasets, where `impl` is the **full source code** of the `.js` file:

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

With `ignoreConflicts=true`, the same call **creates** a new dataset or **updates** an existing one, so the pipeline doesn't need to check first.

The deploy stage then follows this flow:

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

A few practical notes:

- **Let a JSON library build the payload.** The source code is full of quotes and line breaks, and escaping it by hand is a reliable way to break the request.
- **One failing dataset shouldn't stop the others.** Catch errors per file, keep going, and end the build as **unstable** with the list of what failed.
- **Log the response body on errors.** Fluig's error messages usually say exactly what's wrong (a syntax error in the dataset, a missing permission, a bad signature).

## Where to go next

Datasets are the easiest artifact to start with. The same pattern (diff → sign → call the API) extends to the rest of the project. The [Fluig API reference](https://api.fluig.com/latest/index.html) lists every endpoint with its parameters and payloads, so check it for the exact details of each call:

- **Forms:** `POST`/`PUT /ecm-forms/api/v2/cardindex`, sending the zipped form folder as `multipart/form-data`.
- **Process diagrams:** `POST /process-management/api/v2/processes/{processId}/import/xml`, with the `.xml` from `workflow/.resources` as the body.
- **Notifications:** send the final status to Slack, Teams or Google Chat in a `post { always { ... } }` block. Keep the webhook URL in Jenkins credentials too.
- **Automated tests:** TOTVS presented a test stage with Node.js and JUnit at [Universo TOTVS 2026](/blog/universo-totvs-2026-fluig-highlights). It fits naturally before the deploy stages.

## Checklist

- [ ] Fluig project versioned in Git
- [ ] OAuth consumer + application user created on **each** Fluig server
- [ ] Credentials stored in Jenkins, one entry per environment
- [ ] Main branch deploys to production; other branches deploy to staging
- [ ] Diff against the last successful build, not just `HEAD^`
- [ ] Query parameters included in the OAuth signature
- [ ] HTTPS on both servers (OAuth 1.0 signs requests but doesn't encrypt them, and your source code travels in the body)

Once datasets deploy on every push, nobody misses the *Export* menu.
