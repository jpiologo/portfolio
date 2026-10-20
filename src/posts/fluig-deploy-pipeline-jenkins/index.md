---
title: "CI/CD for Fluig: deploying datasets with Jenkins and the Fluig REST API"
date: 2026-10-20
description: A short, practical walkthrough of a Jenkins pipeline that detects what changed in Git and deploys Fluig datasets through the platform's standard REST API.
cover: ./cover.svg
---

For a long time, deploying to Fluig meant opening Fluig Studio, right-clicking a file and choosing *Export*. That's fine for one developer and one server. With a team, a staging server and production, manual exports are slow, easy to forget and impossible to audit.

The good news: Fluig exposes **standard REST APIs** for datasets, forms and processes. In this post I'll show the backbone of the Jenkins pipeline I use, focusing on one artifact: **datasets**. It's a short guide, not a complete one. The goal is to give you a working path you can grow from.

## The big picture

```text
git push ──> Jenkins ──> which files changed? ──> sign request (OAuth 1.0) ──> Fluig REST API
                │
                └── branch decides the target: master -> production, anything else -> staging
```

The pipeline does five things:

1. Picks the target server from the branch.
2. Finds which files changed since the last successful build.
3. Loads that environment's API credentials from Jenkins.
4. Sends each changed dataset to the Fluig API.
5. Reports the result (and marks the build as *unstable* on partial failures).

## Prerequisites

- **Your Fluig project in Git.** The standard Fluig Studio layout works as-is. Each process folder has its own `datasets/`, `forms/` and `workflow/` folders.
- **Jenkins** with the *Pipeline* and *Pipeline Utility Steps* plugins (`readJSON`, `writeJSON` and `readProperties` come from the latter).
- **OAuth credentials for each Fluig server.** In Fluig's Control Panel, register an OAuth consumer and an application user. You'll end up with four values: `consumer_key`, `consumer_secret`, `access_token` and `token_secret`. Give that user only the permissions the deploy needs.

> **Tip:** before automating anything, call the API from Postman. It supports *OAuth 1.0* with *HMAC-SHA1* out of the box, so you can confirm your keys and the endpoint work before debugging Groovy.

## Step 1: choose the environment from the branch

```groovy
def ENVIRONMENT = 'hml'
def FLUIG_URL = 'https://fluig-hml.yourcompany.com'

stage('Select environment') {
    steps {
        script {
            def branch = env.GIT_BRANCH?.replaceAll('origin/', '') ?: 'unknown'
            if (branch == 'master') {
                ENVIRONMENT = 'prod'
                FLUIG_URL = 'https://fluig.yourcompany.com'
            }
            echo "Branch: ${branch} | Environment: ${ENVIRONMENT}"
        }
    }
}
```

Merging into `master` deploys to production; everything else goes to staging. Just like in the [environment dataset post](/blog/fluig-dataset-detect-environment), the default is the safe one.

## Step 2: deploy only what changed

Comparing against `HEAD^` only sees the last commit. If a push has three commits, or the previous build failed, changes get lost. Compare against the **last successful build** instead:

```groovy
// Declared at the top of the Jenkinsfile, so later stages can read it:
// def changedDatasets = []

def base = 'HEAD^'
if (env.GIT_PREVIOUS_SUCCESSFUL_COMMIT) {
    def exists = sh(script: "git cat-file -e ${env.GIT_PREVIOUS_SUCCESSFUL_COMMIT} 2>/dev/null && echo ok || true",
                    returnStdout: true).trim()
    if (exists == 'ok') base = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT
}

changedDatasets = sh(script: "git diff --name-only ${base} HEAD", returnStdout: true)
    .trim()
    .split('\n')
    .findAll { it.contains('/datasets/') && it.endsWith('.js') && fileExists(it) }
```

`fileExists` drops files that were deleted in the diff. Deleting datasets on the server is a decision you probably want to keep manual.

## Step 3: load credentials per environment

Store each environment's four OAuth values as a Jenkins **secret file** (a simple `.properties` file), one per server, and load it at runtime:

```groovy
def auth = [:]

withCredentials([file(credentialsId: "fluig-oauth-${ENVIRONMENT}", variable: 'OAUTH_FILE')]) {
    def props = readProperties file: OAUTH_FILE
    auth = [
        consumerKey   : props.consumer_key,
        consumerSecret: props.consumer_secret,
        accessToken   : props.access_token,
        tokenSecret   : props.token_secret
    ]
}
```

Never write tokens, passwords or webhook URLs directly in the `Jenkinsfile`. Anyone with read access to the repository would have them.

## Step 4: sign requests with OAuth 1.0

Fluig's API uses **OAuth 1.0a with HMAC-SHA1**. Every request carries a signature computed from the HTTP method, the URL and **all** query parameters. These two helpers handle it:

```groovy
def percentEncode(String s) {
    java.net.URLEncoder.encode(s, 'UTF-8').replace('+', '%20').replace('*', '%2A').replace('%7E', '~')
}

// Returns baseUrl + query string with the OAuth parameters and signature
def signedUrl(String method, String baseUrl, Map query, Map auth) {
    def params = query + [
        oauth_consumer_key    : auth.consumerKey,
        oauth_token           : auth.accessToken,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp       : (System.currentTimeMillis() / 1000).toLong().toString(),
        oauth_nonce           : UUID.randomUUID().toString(),
        oauth_version         : '1.0'
    ]

    def paramString = new TreeMap(params)
        .collect { k, v -> "${percentEncode(k)}=${percentEncode(v.toString())}" }
        .join('&')
    def baseString = [method.toUpperCase(), percentEncode(baseUrl), percentEncode(paramString)].join('&')
    def signingKey = "${percentEncode(auth.consumerSecret)}&${percentEncode(auth.tokenSecret)}"

    def mac = javax.crypto.Mac.getInstance('HmacSHA1')
    mac.init(new javax.crypto.spec.SecretKeySpec(signingKey.bytes, 'HmacSHA1'))
    def signature = mac.doFinal(baseString.bytes).encodeBase64().toString()

    return "${baseUrl}?${paramString}&oauth_signature=${percentEncode(signature)}"
}
```

Two things that cost me time:

- **Business query parameters are part of the signature.** If the request has `?ignoreConflicts=true`, it must be inside `params` *before* signing. Otherwise Fluig answers `401`.
- **Jenkins script security.** The first run may fail with `RejectedAccessException` for `javax.crypto.Mac`. An admin needs to approve the signature under *Manage Jenkins → In-process Script Approval*.

## Step 5: deploy a dataset

The endpoint is `POST /dataset/api/v2/datasets`. The body is a JSON with a list of datasets, where `impl` is the **full source code** of the `.js` file:

```json
{
  "datasets": [
    {
      "code": "dsEnvironment",
      "description": "dsEnvironment",
      "impl": "function createDataset(fields, constraints, sortFields) { ... }"
    }
  ]
}
```

With `ignoreConflicts=true`, the same call **creates** a new dataset or **updates** an existing one. The pipeline doesn't need to check first.

```groovy
def deployDataset(String file, Map auth, String fluigUrl) {
    def code = file.tokenize('/')[-1].replaceFirst(/\.js$/, '') // datasets/dsEnvironment.js -> dsEnvironment

    // writeJSON escapes the source code (quotes, line breaks) for us
    writeJSON(file: 'dataset_payload.json', json: [
        datasets: [[code: code, description: code, impl: readFile(file)]]
    ])

    def url = signedUrl('POST', "${fluigUrl}/dataset/api/v2/datasets", [ignoreConflicts: 'true'], auth)
    def status = sh(returnStdout: true, script: """
        curl -s -w '%{http_code}' -o dataset_response.json -X POST '${url}' \\
             -H 'Content-Type: application/json' -d @dataset_payload.json
    """).trim()

    if (!(status in ['200', '201', '204'])) {
        error("Dataset ${code} failed (HTTP ${status}): ${readFile('dataset_response.json')}")
    }
    echo "Dataset ${code} deployed (HTTP ${status})"
}
```

And the stage that ties it together:

```groovy
stage('Deploy datasets') {
    when { expression { changedDatasets } }
    steps {
        script {
            def failures = []
            changedDatasets.each { file ->
                try {
                    deployDataset(file, auth, FLUIG_URL)
                } catch (e) {
                    failures << file
                    echo e.message
                }
            }
            if (failures) unstable("Failed datasets: ${failures.join(', ')}")
        }
    }
}
```

One failing dataset doesn't stop the others. The build ends as **unstable**, with the list of what failed.

## Where to go next

Datasets are the easiest artifact to start with. The same pattern (diff → sign → call the API) extends to the rest of the project:

- **Forms:** `POST`/`PUT /ecm-forms/api/v2/cardindex`, sending the zipped form folder as `multipart/form-data`.
- **Process diagrams:** `POST /process-management/api/v2/processes/{processId}/import/xml`, with the `.xml` from `workflow/.resources` as the body.
- **Notifications:** send the final status to Slack, Teams or Google Chat in a `post { always { ... } }` block. Keep the webhook URL in Jenkins credentials too.
- **Automated tests:** TOTVS presented a test stage with Node.js and JUnit at [Universo TOTVS 2026](/blog/universo-totvs-2026-fluig-highlights). It fits naturally before the deploy stages.

## Checklist

- [ ] Fluig project versioned in Git
- [ ] OAuth consumer + application user created on **each** Fluig server
- [ ] Credentials stored as Jenkins secret files, one per environment
- [ ] `master` deploys to production; other branches deploy to staging
- [ ] Diff against the last successful build, not just `HEAD^`
- [ ] Query parameters included in the OAuth signature
- [ ] HTTPS on both servers (OAuth 1.0 signs requests but doesn't encrypt them, and your source code travels in the body)

Once datasets deploy on every push, nobody misses the *Export* menu.
