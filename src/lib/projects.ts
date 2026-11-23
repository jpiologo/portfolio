import type { Messages, ProjectId } from "../i18n/en";
import fokusImage from "../assets/Fokus.webp";
import weatherImage from "../assets/weatherApp.webp";
import vocalVaultImage from "../assets/vocalVault.webp";
import caseCobra from "../assets/Home.webp";
import cleanUp from "../assets/CleanUpHome.webp";
import realtimeChatImage from "../assets/Destroyed.webp";
import playoffsSimulatorImage from "../assets/4a0.webp";
import type { Project } from "./types";

type ProjectMeta = Omit<Project, "slug" | "title" | "subtitle" | "description" | "details"> & { id: ProjectId };

// Language-independent data, in display order; the text of each project lives in src/i18n
const PROJECTS: ProjectMeta[] = [
	// Work projects first, led by the one with the biggest business impact; personal and study projects last
	{
		id: "salesAutomation",
		cover: { kind: "art", id: "sales" },
		techStack: ["dotnet", "rabbitmq", "gcp", "llm", "microservices", "grafana", "restApi"],
	},
	{
		id: "freightRouting",
		cover: { kind: "art", id: "freight" },
		techStack: [
			"javascript",
			"fluig",
			"dotnet",
			"mongodb",
			"microservices",
			"restApi",
			"datasets",
			"workflowEngine",
			"nodejs",
		],
	},
	{
		id: "fluigPipeline",
		cover: { kind: "art", id: "pipeline" },
		techStack: [
			"jenkins",
			"groovy",
			"fluig",
			"nodejs",
			"cicd",
			"restApi",
			"git",
			"automation",
			"devops",
		],
	},
	{
		id: "inventoryCount",
		cover: { kind: "art", id: "inventory" },
		techStack: [
			"javascript",
			"html",
			"css",
			"fluig",
			"protheus",
			"restApi",
			"datasets",
			"forms",
			"microservices",
		],
	},
	{
		id: "purchasingFlow",
		cover: { kind: "art", id: "purchasing" },
		techStack: [
			"javascript",
			"html",
			"css",
			"fluig",
			"protheus",
			"restApi",
			"datasets",
			"forms",
			"workflowEngine",
			"emailNotifications",
		],
	},
	{
		id: "vehicleSales",
		cover: { kind: "art", id: "vehicleSales" },
		techStack: [
			"javascript",
			"html",
			"css",
			"fluig",
			"erpIntegration",
			"aiDocumentAnalysis",
			"restApi",
			"datasets",
			"forms",
			"workflowEngine",
		],
	},
	{
		id: "hrWorkflows",
		cover: { kind: "art", id: "hr" },
		techStack: [
			"javascript",
			"html",
			"css",
			"fluig",
			"protheus",
			"activeDirectory",
			"restApi",
			"datasets",
			"forms",
			"workflowEngine",
		],
	},
	{
		id: "playoffsSimulator",
		cover: { kind: "screenshot", src: playoffsSimulatorImage, logo: "/minis/icon.svg" },
		techStack: ["typescript", "nextjs", "zustand", "zod", "motion", "tailwind", "vitest"],
		demoLink: "https://4a0-self.vercel.app/jogo",
		githubLink: "https://github.com/jpiologo/4a0",
	},
	{
		id: "cleanUp",
		isStudy: true,
		cover: { kind: "screenshot", src: cleanUp, logo: "/minis/clean-up-logo.webp" },
		techStack: ["typescript", "nextjs", "nestjs", "postgresql", "prisma", "tailwind", "jwt"],
		githubLink: "https://github.com/jpiologo/CleanUp---Frontend",
		inDevelopment: true,
	},
	{
		id: "caseCobra",
		isStudy: true,
		cover: { kind: "screenshot", src: caseCobra, logo: "/minis/CaseCobra.webp" },
		techStack: ["typescript", "nextjs", "postgresql", "prisma", "stripe", "kinde", "uploadthing", "resend"],
		demoLink: "https://casecobra-taupe.vercel.app/",
		githubLink: "https://github.com/jpiologo/CaseCobra",
	},
	{
		id: "realtimeChat",
		isStudy: true,
		cover: { kind: "screenshot", src: realtimeChatImage, logo: "/minis/terminal.svg" },
		techStack: ["typescript", "nextjs", "elysia", "upstash", "reactQuery", "zod", "tailwind"],
		demoLink: "https://realtime-chat-iota-six.vercel.app/",
		githubLink: "https://github.com/jpiologo/Realtime_Chat",
	},
	{
		id: "taskManager",
		isStudy: true,
		cover: { kind: "screenshot", src: fokusImage, logo: "/minis/fokusLogo.png", logoIsWhite: true },
		techStack: ["javascript", "html", "css", "localStorage"],
		demoLink: "https://fokus-mu-eight.vercel.app/",
		githubLink: "https://github.com/jpiologo/fokusProject",
	},
	{
		id: "weatherApp",
		isStudy: true,
		cover: { kind: "screenshot", src: weatherImage, logo: "/minis/weatherApp.webp" },
		techStack: ["javascript", "openWeatherMap", "restApi", "json"],
		demoLink: "https://weather-app-kappa-black.vercel.app/",
		githubLink: "https://github.com/jpiologo/weatherApp",
	},
	{
		id: "vocalVault",
		isStudy: true,
		cover: { kind: "screenshot", src: vocalVaultImage, logo: "/minis/vault.svg" },
		techStack: ["javascript", "webSpeech", "html", "css"],
		demoLink: "https://vocalvault-c5qkg3u7e-joao-piologos-projects.vercel.app/",
		githubLink: "https://github.com/jpiologo/voiceCommandApp",
	},
];

/** "freightRouting" becomes "freight-routing", so renaming an id changes the project's URL. */
const toSlug = (id: ProjectId) => id.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export const getProjects = (t: Messages): Project[] =>
	PROJECTS.map(({ id, ...meta }) => ({ slug: toSlug(id), ...meta, ...t.projects.items[id] }));
