# Como adicionar um novo post no blog

Cada post é um arquivo Markdown dentro desta pasta (`src/posts`). Não existe banco de dados nem painel: criar um post é criar uma pasta, escrever o texto e publicar o site.

> **Idioma:** todos os posts são escritos em **inglês**: título, descrição, texto, comentários e nomes no código, e o texto da capa. Quem preferir outro idioma usa o tradutor do navegador (Google Tradutor). O slug (nome da pasta) também fica em inglês.

## 1. Crie a pasta do post

Crie uma pasta nova em `src/posts/` com o **slug** do post. O nome da pasta vira a URL do post:

```
src/posts/meu-primeiro-tutorial/   →   https://seu-site.com/blog/meu-primeiro-tutorial
```

Regras para o nome da pasta:

- letras minúsculas, números e hífens (`-`);
- sem espaços, acentos ou caracteres especiais;
- não pode repetir o nome de outro post.

## 2. Crie o arquivo `index.md`

Dentro da pasta, crie um arquivo chamado exatamente `index.md`. Arquivos com outro nome são ignorados.

Comece o arquivo com o **frontmatter**, um bloco entre `---` com as informações do post, e escreva o conteúdo logo abaixo:

```md
---
title: Como configurar um pipeline de CI/CD com Jenkins
date: 2026-11-05
description: Um guia prático, do Jenkinsfile ao deploy automático.
cover: ./cover.png
---

Aqui começa o texto do post...
```

| Campo         | Obrigatório | O que faz |
| ------------- | ----------- | --------- |
| `title`       | Sim         | Título exibido no card e na página do post. Sem título, aparece o nome da pasta. |
| `date`        | Sim         | Data de publicação no formato `AAAA-MM-DD`. Os posts são ordenados por ela, do mais recente para o mais antigo. |
| `description` | Recomendado | Resumo curto. Aparece no card, abaixo do título na página do post, e entra na busca. |
| `cover`       | Não         | Imagem de capa (veja o passo 3). Sem capa, o card mostra um ícone no lugar. |
| `draft`       | Não         | Use `draft: true` para um rascunho (veja o passo 5). |

Cuidados com o frontmatter:

- o arquivo precisa começar com `---` na **primeira linha**;
- cada campo ocupa **uma única linha** (`campo: valor`);
- aspas são opcionais: `title: "Meu post"` e `title: Meu post` funcionam igual;
- salve o arquivo em UTF-8 **sem BOM** (o padrão do VS Code). Com BOM, o frontmatter não é reconhecido.

## 3. Adicione imagens

Coloque as imagens **dentro da pasta do post**, ao lado do `index.md`. Subpastas também funcionam:

```
src/posts/meu-primeiro-tutorial/
├── index.md
├── cover.png
└── images/
    └── pipeline.png
```

Use sempre caminhos relativos começando com `./`:

```md
cover: ./cover.png
```

```md
![Diagrama do pipeline](./images/pipeline.png)
```

- Formatos aceitos: `png`, `jpg`, `jpeg`, `gif`, `webp`, `avif` e `svg`.
- **Capa:** use proporção **16:9** (ex.: 1600×900 px), porque os cards cortam a imagem nesse formato.
- **Peso:** prefira `webp` e arquivos com menos de ~500 KB para a página carregar rápido.
- Sempre escreva um texto alternativo entre os colchetes (`![descrição](...)`). Ele ajuda leitores de tela e aparece se a imagem não carregar.
- Imagens externas também funcionam com a URL completa: `![Logo](https://exemplo.com/logo.png)`.

## 4. Escreva o conteúdo

O texto usa Markdown com as extensões do GitHub (GFM):

````md
## Subtítulo

Texto com **negrito**, *itálico*, ~~riscado~~ e `código inline`.

- Lista
- de itens

1. Lista
2. numerada

- [x] Checklist feito
- [ ] Checklist pendente

> Citação ou observação importante.

| Coluna A | Coluna B |
| -------- | -------- |
| valor    | valor    |

[Link interno](/blog/outro-post) e [link externo](https://react.dev).

```ts
// Informe a linguagem depois das três crases para ter syntax highlight
const soma = (a: number, b: number) => a + b;
```
````

Dicas:

- Comece as seções com `##`. O título do post (`title`) já é o `#` principal da página.
- Links externos (`https://...`) abrem automaticamente em uma nova aba.
- Para destacar a sintaxe de um bloco de código, informe a linguagem depois das três crases: `ts`, `tsx`, `js`, `bash`, `json`, `sql`, `java`, `python`, `yaml` etc.
- O tempo de leitura ("X min read") é calculado sozinho, a partir do número de palavras.

## 5. Veja o post localmente

Rode o projeto:

```bash
npm run dev
```

Depois abra:

- `http://localhost:5173/blog/<nome-da-pasta>`: a página do post;
- `http://localhost:5173/blog`: a lista com todos os posts e a busca;
- `http://localhost:5173/#blog`: a seção da home, que mostra os **3 posts mais recentes**.

**Rascunhos:** com `draft: true` no frontmatter, o post aparece normalmente no `npm run dev`, mas **não entra** no site publicado. Para publicar, remova a linha ou troque para `draft: false`.

Se o post novo não aparecer, reinicie o `npm run dev`.

## 6. Publique

Faça o commit e envie para o GitHub:

```bash
git add src/posts/meu-primeiro-tutorial
git commit -m "feat(blog): add post about Jenkins CI/CD"
git push
```

O deploy (Vercel/Netlify) gera o site com o post novo. Se o deploy publica só a branch `main`, abra um PR e faça o merge.

## 7. SEO (Google e redes sociais)

O build (`vite-plugin-seo.ts`) gera sozinho, para cada post, uma página HTML com o texto já renderizado, `<title>`, `meta description`, URL canônica, Open Graph e dados estruturados (`BlogPosting`), além de `sitemap.xml` e `robots.txt`. Não há nada para configurar por post, mas o conteúdo faz diferença:

- **`title`:** até ~60 caracteres, com o termo que alguém digitaria no Google (ex.: "Fluig", "Jenkins").
- **`description`:** entre ~120 e 160 caracteres. É o texto que o Google costuma mostrar abaixo do título.
- **`cover`:** use `png`, `jpg` ou `webp` para a capa aparecer na prévia do link no LinkedIn/WhatsApp. Capas `svg` funcionam no site, mas não viram prévia.
- **Links internos:** cite posts anteriores com `[texto](/blog/outro-post)`. Isso ajuda o Google a descobrir e relacionar as páginas.
- **Slug:** depois de publicado, não renomeie a pasta. A URL muda e o Google perde a página indexada.

## Checklist rápido

- [ ] Pasta `src/posts/<slug>/` criada (minúsculas e hífens)
- [ ] Arquivo `index.md` com `title`, `date` (`AAAA-MM-DD`) e `description`
- [ ] Imagens dentro da pasta do post, referenciadas com `./`
- [ ] Capa em 16:9 (`png`/`jpg`/`webp` para ter prévia nas redes) e imagens leves
- [ ] `description` com ~120 a 160 caracteres
- [ ] Post conferido no `npm run dev`
- [ ] `draft: true` removido antes de publicar
- [ ] Commit, push e deploy

## Modelo para copiar

```md
---
title: Título do post
date: AAAA-MM-DD
description: Uma ou duas frases resumindo o post.
cover: ./cover.png
---

Introdução: qual problema este post resolve e para quem ele é.

## Contexto

## Passo a passo

## Conclusão
```
