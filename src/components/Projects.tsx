import type { Project } from "../lib/types";
import { useI18n } from "../i18n/context";
import type { ProjectId } from "../i18n/en";
import Carousel from "./Carousel";
import ProjectCard from "./ProjectCard";
import { ProjectThumbnail } from "./ProjectCover";
import { useIsDesktop } from "../lib/useMediaQuery";
import fokusImage from "../assets/Fokus.webp";
import weatherImage from "../assets/weatherApp.webp";
import vocalVaultImage from "../assets/vocalVault.webp";
import caseCobra from "../assets/Home.webp";
import cleanUp from "../assets/CleanUpHome.webp";
import realtimeChatImage from "../assets/Destroyed.webp";
import playoffsSimulatorImage from "../assets/4a0.webp";
import Reveal from "./Reveal";

const PER_PAGE_DESKTOP = 2;
const PER_PAGE_MOBILE = 1;

type ProjectMeta = Omit<Project, "title" | "subtitle" | "description" | "details"> & { id: ProjectId };

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
		cover: { kind: "screenshot", src: cleanUp, logo: "/minis/clean-up-logo.webp" },
		techStack: ["typescript", "nextjs", "nestjs", "postgresql", "prisma", "tailwind", "jwt"],
		githubLink: "https://github.com/jpiologo/CleanUp---Frontend",
		inDevelopment: true,
	},
	{
		id: "caseCobra",
		cover: { kind: "screenshot", src: caseCobra, logo: "/minis/CaseCobra.webp" },
		techStack: ["typescript", "nextjs", "postgresql", "prisma", "stripe", "kinde", "uploadthing", "resend"],
		demoLink: "https://casecobra-taupe.vercel.app/",
		githubLink: "https://github.com/jpiologo/CaseCobra",
	},
	{
		id: "realtimeChat",
		cover: { kind: "screenshot", src: realtimeChatImage, logo: "/minis/terminal.svg" },
		techStack: ["typescript", "nextjs", "elysia", "upstash", "reactQuery", "zod", "tailwind"],
		demoLink: "https://realtime-chat-iota-six.vercel.app/",
		githubLink: "https://github.com/jpiologo/Realtime_Chat",
	},
	{
		id: "taskManager",
		cover: { kind: "screenshot", src: fokusImage, logo: "/minis/fokusLogo.png", logoIsWhite: true },
		techStack: ["javascript", "html", "css", "localStorage"],
		demoLink: "https://fokus-mu-eight.vercel.app/",
		githubLink: "https://github.com/jpiologo/fokusProject",
	},
	{
		id: "weatherApp",
		cover: { kind: "screenshot", src: weatherImage, logo: "/minis/weatherApp.webp" },
		techStack: ["javascript", "openWeatherMap", "restApi", "json"],
		demoLink: "https://weather-app-kappa-black.vercel.app/",
		githubLink: "https://github.com/jpiologo/weatherApp",
	},
	{
		id: "vocalVault",
		cover: { kind: "screenshot", src: vocalVaultImage, logo: "/minis/vault.svg" },
		techStack: ["javascript", "webSpeech", "html", "css"],
		demoLink: "https://vocalvault-c5qkg3u7e-joao-piologos-projects.vercel.app/",
		githubLink: "https://github.com/jpiologo/voiceCommandApp",
	},
];

const Projects = () => {
	const t = useI18n();
	const perPage = useIsDesktop() ? PER_PAGE_DESKTOP : PER_PAGE_MOBILE;
	const projects: Project[] = PROJECTS.map(({ id, ...meta }) => ({ ...meta, ...t.projects.items[id] }));

	return (
		<section id="projects" className="relative py-16">
			<div className="max-w-6xl mx-auto px-4">
				<Reveal className="text-center mb-14">
					<h2 className="section-heading mb-6">
						{t.projects.heading}
					</h2>
					<p className="section-intro max-w-xl mx-auto">
						{t.projects.introBefore}
						<b>{t.projects.introBold}</b>
						{t.projects.introAfter}
					</p>
				</Reveal>

				<Reveal delay={150}>
				<Carousel
					items={projects}
					perPage={perPage}
					label={t.projects.carouselLabel}
					getKey={(project) => project.title}
					getName={(project) => project.title}
					renderItem={(project) => <ProjectCard project={project} />}
					renderPreview={(project) => <ProjectThumbnail project={project} />}
				/>
				</Reveal>
			</div>

			{/* Easter egg: tucked away in the corner */}
			<figure className="absolute bottom-3 right-4 text-[0.8rem] italic font-light text-text-muted/50 select-none">
				<blockquote className="inline">“{t.projects.quote}”</blockquote>
				<figcaption className="inline not-italic"> — {t.projects.quoteAuthor}</figcaption>
			</figure>
		</section>
	);
};

export default Projects;
