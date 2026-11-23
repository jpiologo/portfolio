import { type Language, MESSAGES } from "../i18n/context";
import { localizePath } from "../i18n/routes";
import { getPosts } from "./posts";
import { FULL_NAME, JOB_TITLE, pageTitle } from "./profile";
import { getProjects } from "./projects";
import type { PrerenderPage } from "./seoTypes";
import { isExternalLink, SOCIAL_LINKS } from "./socialLinks";

const LANGUAGES = Object.keys(MESSAGES) as Language[];
const DESCRIPTION_MAX_LENGTH = 160;
const POST_MODULE = "src/pages/BlogPost.tsx";
const BLOG_MODULE = "src/pages/BlogIndex.tsx";
/** Social links that identify a person, as opposed to contact channels. */
const PROFILE_LINK_IDS = ["github", "linkedin"];

/** Search results show about 160 characters, so longer texts are cut at a word. */
const summarize = (text: string) => {
	if (text.length <= DESCRIPTION_MAX_LENGTH) return text;
	const cut = text.slice(0, DESCRIPTION_MAX_LENGTH - 1);
	return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
};

type PageContent = Omit<PrerenderPage, "path" | "canonicalPath" | "htmlLang" | "alternates"> & {
	/** Path of the page in English. */
	basePath: string;
	/** Set when this language only falls back to the English text. */
	isUntranslated?: boolean;
};

const author = (absoluteUrl: (path: string) => string) => ({
	"@type": "Person",
	name: FULL_NAME,
	url: absoluteUrl("/"),
});

const contentFor = (language: Language): PageContent[] => {
	const t = MESSAGES[language];
	const localUrl = (absoluteUrl: (path: string) => string, path: string) => absoluteUrl(localizePath(path, language));

	return [
		{
			basePath: "/",
			title: t.common.siteTitle,
			description: t.seo.homeDescription,
			type: "website",
			image: "home",
			jsonLd: (absoluteUrl, image) => ({
				"@type": "Person",
				name: FULL_NAME,
				jobTitle: JOB_TITLE,
				url: absoluteUrl("/"),
				image,
				sameAs: SOCIAL_LINKS.filter(({ id, href }) => PROFILE_LINK_IDS.includes(id) && isExternalLink(href)).map(
					({ href }) => href,
				),
			}),
		},
		{
			basePath: "/blog",
			title: t.blogIndex.documentTitle,
			description: t.blogIndex.intro,
			type: "website",
			image: "home",
			lazyModule: BLOG_MODULE,
			jsonLd: (absoluteUrl) => ({
				"@type": "Blog",
				name: t.blogIndex.documentTitle,
				description: t.blogIndex.intro,
				url: localUrl(absoluteUrl, "/blog"),
				author: author(absoluteUrl),
			}),
		},
		...getPosts(language).map((post): PageContent => {
			const basePath = `/blog/${post.slug}`;
			return {
				basePath,
				isUntranslated: !post.isTranslated,
				title: pageTitle(post.title),
				description: post.description,
				type: "article",
				image: `blog/${post.slug}`,
				publishedTime: post.date,
				lazyModule: POST_MODULE,
				jsonLd: (absoluteUrl, image) => ({
					"@type": "BlogPosting",
					headline: post.title,
					description: post.description,
					datePublished: post.date,
					dateModified: post.date,
					url: localUrl(absoluteUrl, basePath),
					mainEntityOfPage: localUrl(absoluteUrl, basePath),
					image,
					author: author(absoluteUrl),
				}),
			};
		}),
		...getProjects(t).map((project): PageContent => {
			const basePath = `/projects/${project.slug}`;
			return {
				basePath,
				title: pageTitle(project.title),
				description: summarize(project.description),
				type: "article",
				image: `projects/${project.slug}`,
				jsonLd: (absoluteUrl, image) => ({
					"@type": "CreativeWork",
					name: project.title,
					headline: project.subtitle,
					description: project.description,
					url: localUrl(absoluteUrl, basePath),
					image,
					creator: author(absoluteUrl),
				}),
			};
		}),
	];
};

/** Every page of the site, in every language. */
export const getPages = (): PrerenderPage[] => {
	const contents = LANGUAGES.map((language) => ({ language, pages: contentFor(language) }));

	const alternatesOf = (basePath: string) =>
		contents
			.filter(({ pages }) => pages.some((page) => page.basePath === basePath && !page.isUntranslated))
			.map(({ language }) => ({ hrefLang: MESSAGES[language].htmlLang, path: localizePath(basePath, language) }));

	return contents.flatMap(({ language, pages }) =>
		pages.map(({ basePath, isUntranslated, ...page }) => {
			const path = localizePath(basePath, language);
			return {
				...page,
				path,
				canonicalPath: isUntranslated ? basePath : path,
				htmlLang: MESSAGES[language].htmlLang,
				alternates: alternatesOf(basePath),
			};
		}),
	);
};

export const NOT_FOUND_PAGE: PrerenderPage = {
	path: "/404",
	canonicalPath: "/404",
	htmlLang: MESSAGES.en.htmlLang,
	title: MESSAGES.en.notFound.documentTitle,
	description: MESSAGES.en.notFound.text,
	type: "website",
	alternates: [],
	image: "home",
	jsonLd: () => ({ "@type": "WebPage", name: MESSAGES.en.notFound.title }),
};
