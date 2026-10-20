---
title: "TOTVS Universe 2026: what caught my attention about Fluig"
date: 2026-10-20
description: My takeaways from Universo TOTVS 2026 on Fluig, from whether to upgrade to 2.0 now to citizen process design, digital signatures, the new AI assistant and better tooling for developers.
cover: ./cover.svg
---

I spent two days at **TOTVS Universe 2026** focused on the Fluig sessions, talking with tech leads and developers from other companies. These are the points that caught my attention, written for teams that run Fluig in production and have to decide what to do next.

Some of this comes from official TOTVS material, and some from conversations at the event. I'll make clear which is which.

## TL;DR

- **Don't rush to 2.0.** If you're on 1.8, consider waiting for 3.0 and evaluating a direct upgrade.
- **Biggest business impact:** regular users designing processes, digital signatures in the ECM, and a new AI assistant.
- **For developers:** official Angular support for forms and widgets in 3.0, ES6+ in server-side scripts, a VS Code extension + CLI on the way, and automated tests in the pipeline.

## 1. Upgrading: wait for 3.0?

### What I heard

I talked with three teams already running **Fluig 2.0 (Voyager)**. All three reported instability and small bugs, with general dissatisfaction, and all three want to move to 3.0 as soon as possible.

Three conversations aren't a statistic, but it's a consistent signal. Before scheduling a 2.0 upgrade, it's worth asking around in the community too.

### What I'd do

- **Test 3.0 in a development environment** as soon as you can. TOTVS has a sign-up form for companies that want early access.
- **Ask TOTVS directly whether a 1.8 → 3.0 upgrade is supported.** Skipping a major version can save a whole migration cycle, but only if the path is officially supported.
- **Don't count on a date yet.** There's no release date for 3.0.

### Infrastructure requirements for 2.0

Whatever version you choose next, check your infrastructure early. Database and OS upgrades usually take longer than the Fluig upgrade itself. The homologated database, operating systems and upgrade steps are in TOTVS' official documentation:

- [O que há de novo no TOTVS Fluig Voyager 2.0](https://produtos.totvs.com/totvs-fluig/totvs-fluig-plataforma/o-que-ha-de-novo-no-totvs-fluig-voyager-2-0-em-setembro-de-2025/)
- [Atualização Voyager (2.0) – TDN](https://tdn.totvs.com/pages/releaseview.action?pageId=878935272)
- [Fluig Plataforma – INS – Como atualizar o ambiente](https://centraldeatendimento.totvs.com/hc/pt-br/articles/27663284858519-Fluig-Plataforma-INS-Como-atualizar-o-ambiente)

## 2. New features with direct business impact

### Regular users can design processes

Any user can now design a process and submit it for an administrator to approve before it's published. This reduces how much simple workflows depend on the development team.

The catch is governance. Before turning this on, define **who approves** and **with which criteria**: naming conventions, who owns the process after it goes live, and when a "simple" flow actually needs a developer (integrations, complex rules, sensitive data).

### Digital signatures in the ECM

Documents in the ECM (Fluig's document manager) can now be **signed digitally inside the platform**, without an external tool. For contract and approval flows, that means fewer integrations and fewer places where a document can get lost.

### A new AI assistant

The new assistant is a **non-generative** model. It runs simple commands **respecting the user's permissions** and answers questions from a **knowledge base configured in Fluig**.

If your company has already built an internal assistant, compare the two before choosing: what each one can do, how each one is maintained, and what it costs.

## 3. For developers

### Angular for forms and widgets (3.0)

Starting with **3.0**, Fluig will **officially support forms and widgets developed with Angular**.

Today, a Fluig form is usually an HTML page with plain JavaScript (often jQuery), and a widget combines a template with JavaScript. That works for simple screens. In complex ones, with dynamic tables, conditional sections and many validations, the code quickly turns into a large file of DOM manipulation that's hard to maintain and almost impossible to test. Some teams already bundle Angular into forms and widgets on their own, but without official support every upgrade is a risk.

What official support should bring:

- **Components instead of scattered scripts.** Each part of the screen gets its own template, logic and styles, and can be reused across forms.
- **TypeScript.** Typing catches errors at build time, before they reach a user in production.
- **Testable front-end code.** Angular's testing tools fit the same automated test pipeline mentioned below.
- **A shared UI language with TOTVS.** TOTVS' own design system, [PO UI](https://po-ui.io/), is built with Angular, so forms and widgets can look and behave like the rest of the TOTVS ecosystem.

How I'd prepare:

- **Don't rewrite what works.** Keep existing forms as they are and use Angular for new, complex screens first.
- **Keep business rules on the server.** Validations and integrations that live in datasets and workflow events don't depend on the front-end framework, so changing it later costs much less.
- **Start training the team** on TypeScript and Angular basics if they're new to them.
- **Wait for the official guide** before committing to a build and deploy structure. How Angular projects will be packaged and published to Fluig is what will shape your CI/CD.

### ES6+ in server-side scripts

Server-side scripts will support **ES6+**: `let`/`const`, arrow functions, template literals and the rest of modern JavaScript. That means less verbose code and better support in VS Code. TOTVS said usage examples will be published at **git.fluig.com**.

Until then, the old Rhino rules still apply: no `trim()` in older versions, careful conversions between Java and JavaScript strings, and so on. I covered some of these in the [environment dataset post](/blog/fluig-dataset-detect-environment).

### VS Code extension + CLI

New tools for Fluig development and **project deployment** from VS Code and the terminal are coming. There's no release date yet. Until then, a CI/CD pipeline calling the REST APIs works well; see [my Jenkins pipeline post](/blog/fluig-deploy-pipeline-jenkins).

### Fluig skills for AI coding assistants

TOTVS published **skills for Fluig development** at **skills.totvs.io**: platform knowledge packaged for AI coding assistants.

### Automated tests in the pipeline

A workshop showed how to add an **automated test stage (Node.js + JUnit)** to a Fluig pipeline. I've already added one to ours. The main requirement is Node 20+ on the build agent.

## 4. Other points

- **TOTVS collaborative hub:** many of the 3.0 features came from ideas users registered there. If something is missing in your day-to-day use of Fluig, register it. It does get read.
- **Onboarding:** starting with 2.0, users get a guided onboarding inside the platform and can customize their own layout.

## Next steps

If you run Fluig in production, here's a short checklist based on everything above:

- [ ] Sign up to test 3.0 in a development environment
- [ ] Check whether your current database and OS meet the requirements
- [ ] Confirm with TOTVS whether 1.8 → 3.0 is a supported upgrade path
- [ ] Define the approval rules before enabling process design for regular users
- [ ] If you have an internal AI assistant, compare it with the new one
- [ ] Plan new complex forms and widgets with Angular in mind for 3.0
- [ ] Watch git.fluig.com for the ES6+ examples
- [ ] Make sure your build agent has Node 20+ if you plan to add automated tests

If you were at the event and saw something different, especially about 2.0 stability, I'd like to hear about it.
