import type { IconType } from "react-icons";
import {
	SiApachegroovy,
	SiCss3,
	SiGit,
	SiHtml5,
	SiJavascript,
	SiJenkins,
	SiJson,
	SiJsonwebtokens,
	SiNestjs,
	SiNextdotjs,
	SiPostgresql,
	SiPrisma,
	SiResend,
	SiStripe,
	SiTailwindcss,
	SiTotvs,
	SiTypescript,
} from "react-icons/si";
import {
	TbApi,
	TbBrandWindows,
	TbCloudRain,
	TbCloudUpload,
	TbDatabase,
	TbDeviceFloppy,
	TbFileSearch,
	TbForms,
	TbGitMerge,
	TbHierarchy2,
	TbInfinity,
	TbMailBolt,
	TbMicrophone,
	TbPlugConnected,
	TbRobot,
	TbShieldLock,
	TbTopologyStar3,
} from "react-icons/tb";

type TechEntry = { icon: IconType; name?: string };

/*
 * Every technology a project can list. Brand names are the same in every language and live here;
 * entries without a `name` are generic terms translated in src/i18n (techNames).
 */
export const TECH = {
	typescript: { icon: SiTypescript, name: "TypeScript" },
	javascript: { icon: SiJavascript, name: "JavaScript" },
	html: { icon: SiHtml5, name: "HTML5" },
	css: { icon: SiCss3, name: "CSS3" },
	nextjs: { icon: SiNextdotjs, name: "Next.js" },
	nestjs: { icon: SiNestjs, name: "Nest.js" },
	tailwind: { icon: SiTailwindcss, name: "TailwindCSS" },
	postgresql: { icon: SiPostgresql, name: "PostgreSQL" },
	prisma: { icon: SiPrisma, name: "Prisma ORM" },
	jwt: { icon: SiJsonwebtokens, name: "JWT Auth" },
	stripe: { icon: SiStripe, name: "Stripe" },
	kinde: { icon: TbShieldLock, name: "Kinde Auth" },
	uploadthing: { icon: TbCloudUpload, name: "Uploadthing" },
	resend: { icon: SiResend, name: "Resend" },
	fluig: { icon: SiTotvs, name: "TOTVS Fluig" },
	protheus: { icon: SiTotvs, name: "TOTVS Protheus" },
	activeDirectory: { icon: TbBrandWindows, name: "Active Directory" },
	jenkins: { icon: SiJenkins, name: "Jenkins" },
	groovy: { icon: SiApachegroovy, name: "Groovy" },
	git: { icon: SiGit, name: "Git" },
	cicd: { icon: TbGitMerge, name: "CI/CD" },
	devops: { icon: TbInfinity, name: "DevOps" },
	json: { icon: SiJson, name: "JSON" },
	localStorage: { icon: TbDeviceFloppy, name: "LocalStorage API" },
	openWeatherMap: { icon: TbCloudRain, name: "OpenWeatherMap API" },
	webSpeech: { icon: TbMicrophone, name: "Web Speech API" },
	restApi: { icon: TbApi },
	datasets: { icon: TbDatabase },
	forms: { icon: TbForms },
	microservices: { icon: TbTopologyStar3 },
	workflowEngine: { icon: TbHierarchy2 },
	emailNotifications: { icon: TbMailBolt },
	erpIntegration: { icon: TbPlugConnected },
	aiDocumentAnalysis: { icon: TbFileSearch },
	automation: { icon: TbRobot },
} as const satisfies Record<string, TechEntry>;

export type TechId = keyof typeof TECH;

/** Technologies without a brand name, whose label comes from the i18n dictionaries. */
export type GenericTechId = {
	[K in TechId]: (typeof TECH)[K] extends { name: string } ? never : K;
}[TechId];

export const techLabel = (id: TechId, translatedNames: Record<GenericTechId, string>) => {
	const entry: TechEntry = TECH[id];
	return entry.name ?? translatedNames[id as GenericTechId];
};
