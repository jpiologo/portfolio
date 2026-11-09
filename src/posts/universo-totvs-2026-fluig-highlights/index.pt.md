---
title: "Universo TOTVS 2026: o que me chamou a atenção sobre o Fluig"
description: Minhas impressões do Universo TOTVS 2026 sobre o Fluig, de atualizar ou não para a 2.0 agora até o desenho de processos por usuários, assinatura digital, o novo assistente de IA e ferramentas melhores para desenvolvedores.
---

Passei dois dias no **Universo TOTVS 2026** focado nas palestras sobre o Fluig, conversando com tech leads e desenvolvedores de outras empresas. Estes são os pontos que me chamaram a atenção, escritos para times que rodam o Fluig em produção e precisam decidir os próximos passos.

Parte disso vem de material oficial da TOTVS, e parte de conversas no evento. Vou deixar claro o que é o quê.

## Resumo

- **Não tenha pressa para ir à 2.0.** Se você está na 1.8, considere esperar a 3.0 e avaliar uma atualização direta.
- **Maior impacto no negócio:** usuários comuns desenhando processos, assinatura digital no ECM e um novo assistente de IA.
- **Para desenvolvedores:** suporte oficial a Angular em formulários e widgets na 3.0, ES6+ nos scripts do servidor, uma extensão para VS Code + CLI a caminho e testes automatizados no pipeline.

## 1. Atualização: esperar a 3.0?

### O que eu ouvi

Conversei com três times que já rodam o **Fluig 2.0 (Voyager)**. Os três relataram instabilidade e pequenos bugs, com uma insatisfação geral, e os três querem migrar para a 3.0 o quanto antes.

Três conversas não são estatística, mas é um sinal consistente. Antes de agendar uma atualização para a 2.0, vale perguntar na comunidade também.

### O que eu faria

- **Testar a 3.0 em um ambiente de desenvolvimento** assim que possível. A TOTVS tem um formulário de inscrição para empresas que querem acesso antecipado.
- **Perguntar diretamente à TOTVS se a atualização 1.8 → 3.0 é suportada.** Pular uma versão principal pode economizar um ciclo inteiro de migração, mas só se o caminho for oficialmente suportado.
- **Não contar com uma data ainda.** Não há data de lançamento para a 3.0.

### Requisitos de infraestrutura da 2.0

Seja qual for a próxima versão escolhida, verifique a infraestrutura cedo. Atualizações de banco de dados e de sistema operacional costumam demorar mais do que a atualização do próprio Fluig. O banco homologado, os sistemas operacionais e os passos de atualização estão na documentação oficial da TOTVS:

- [O que há de novo no TOTVS Fluig Voyager 2.0](https://produtos.totvs.com/totvs-fluig/totvs-fluig-plataforma/o-que-ha-de-novo-no-totvs-fluig-voyager-2-0-em-setembro-de-2025/)
- [Atualização Voyager (2.0) – TDN](https://tdn.totvs.com/pages/releaseview.action?pageId=878935272)
- [Fluig Plataforma – INS – Como atualizar o ambiente](https://centraldeatendimento.totvs.com/hc/pt-br/articles/27663284858519-Fluig-Plataforma-INS-Como-atualizar-o-ambiente)

## 2. Novidades com impacto direto no negócio

### Usuários comuns podem desenhar processos

Qualquer usuário agora pode desenhar um processo e enviá-lo para um administrador aprovar antes da publicação. Isso diminui a dependência do time de desenvolvimento para workflows simples.

O ponto de atenção é a governança. Antes de habilitar, defina **quem aprova** e **com quais critérios**: convenções de nomes, quem é o dono do processo depois que ele entra no ar e quando um fluxo "simples" na verdade precisa de um desenvolvedor (integrações, regras complexas, dados sensíveis).

### Assinatura digital no ECM

Documentos no ECM (o gerenciador de documentos do Fluig) agora podem ser **assinados digitalmente dentro da plataforma**, sem ferramenta externa. Para fluxos de contratos e aprovações, isso significa menos integrações e menos lugares onde um documento pode se perder.

### Um novo assistente de IA

O novo assistente é um modelo **não generativo**. Ele executa comandos simples **respeitando as permissões do usuário** e responde perguntas a partir de uma **base de conhecimento configurada no Fluig**.

Se a sua empresa já construiu um assistente interno, compare os dois antes de escolher: o que cada um consegue fazer, como cada um é mantido e quanto custa.

## 3. Para desenvolvedores

### Angular em formulários e widgets (3.0)

A partir da **3.0**, o Fluig vai **suportar oficialmente formulários e widgets desenvolvidos com Angular**.

Hoje, um formulário do Fluig costuma ser uma página HTML com JavaScript puro (muitas vezes jQuery), e um widget combina um template com JavaScript. Isso funciona para telas simples. Nas complexas, com tabelas dinâmicas, seções condicionais e muitas validações, o código vira rapidamente um arquivo enorme de manipulação de DOM, difícil de manter e quase impossível de testar. Alguns times já empacotam Angular em formulários e widgets por conta própria, mas sem suporte oficial cada atualização é um risco.

O que o suporte oficial deve trazer:

- **Componentes em vez de scripts espalhados.** Cada parte da tela ganha o próprio template, lógica e estilos, e pode ser reaproveitada entre formulários.
- **TypeScript.** A tipagem pega erros na hora do build, antes de chegarem a um usuário em produção.
- **Código de front-end testável.** As ferramentas de teste do Angular se encaixam no mesmo pipeline de testes automatizados citado abaixo.
- **Uma linguagem visual em comum com a TOTVS.** O design system da própria TOTVS, o [PO UI](https://po-ui.io/), é feito em Angular, então formulários e widgets podem ter a aparência e o comportamento do resto do ecossistema TOTVS.

Como eu me prepararia:

- **Não reescreva o que funciona.** Mantenha os formulários existentes como estão e use Angular primeiro nas telas novas e complexas.
- **Mantenha as regras de negócio no servidor.** Validações e integrações que vivem em datasets e eventos de workflow não dependem do framework de front-end, então trocá-lo depois custa muito menos.
- **Comece a capacitar o time** no básico de TypeScript e Angular, se for novidade para ele.
- **Espere o guia oficial** antes de definir uma estrutura de build e deploy. A forma como os projetos Angular serão empacotados e publicados no Fluig é o que vai moldar o seu CI/CD.

### ES6+ nos scripts do servidor

Os scripts do lado do servidor vão suportar **ES6+**: `let`/`const`, arrow functions, template literals e o resto do JavaScript moderno. Isso significa código menos verboso e melhor suporte no VS Code. A TOTVS disse que exemplos de uso serão publicados em **git.fluig.com**.

Até lá, as regras antigas do Rhino continuam valendo: sem `trim()` nas versões mais antigas, cuidado nas conversões entre strings Java e JavaScript, e assim por diante. Falei de algumas delas no [post do dataset de ambiente](/blog/fluig-dataset-detect-environment).

### Extensão para VS Code + CLI

Estão chegando novas ferramentas para desenvolvimento no Fluig e **deploy de projetos** a partir do VS Code e do terminal. Ainda não há data de lançamento. Até lá, um pipeline de CI/CD chamando as APIs REST funciona bem; veja [o meu post sobre o pipeline no Jenkins](/blog/fluig-deploy-pipeline-jenkins).

### Skills do Fluig para assistentes de código com IA

A TOTVS publicou **skills para desenvolvimento no Fluig** em **skills.totvs.io**: conhecimento sobre a plataforma empacotado para assistentes de código com IA.

### Testes automatizados no pipeline

Um workshop mostrou como adicionar uma **etapa de testes automatizados (Node.js + JUnit)** a um pipeline do Fluig. Já adicionei uma ao nosso. O principal requisito é ter Node 20+ no agente de build.

## 4. Outros pontos

- **Hub colaborativo da TOTVS:** muitas funcionalidades da 3.0 vieram de ideias que usuários cadastraram lá. Se falta algo no seu dia a dia com o Fluig, registre. As ideias são lidas, sim.
- **Onboarding:** a partir da 2.0, os usuários ganham um onboarding guiado dentro da plataforma e podem personalizar o próprio layout.

## Próximos passos

Se você roda o Fluig em produção, aqui vai um checklist curto com base em tudo isso:

- [ ] Inscrever-se para testar a 3.0 em um ambiente de desenvolvimento
- [ ] Verificar se o banco de dados e o sistema operacional atuais atendem aos requisitos
- [ ] Confirmar com a TOTVS se 1.8 → 3.0 é um caminho de atualização suportado
- [ ] Definir as regras de aprovação antes de liberar o desenho de processos para usuários comuns
- [ ] Se você tem um assistente de IA interno, compará-lo com o novo
- [ ] Planejar os novos formulários e widgets complexos pensando em Angular na 3.0
- [ ] Acompanhar o git.fluig.com para ver os exemplos de ES6+
- [ ] Garantir Node 20+ no agente de build se for adicionar testes automatizados

Se você esteve no evento e viu algo diferente, principalmente sobre a estabilidade da 2.0, quero saber.
