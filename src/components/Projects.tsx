import type { Project } from "../lib/types";
import { useI18n } from "../i18n/context";
import type { ProjectId } from "../i18n/en";
import Carousel from "./Carousel";
import ProjectCard from "./ProjectCard";
import { useIsDesktop } from "../lib/useMediaQuery";
import fokusImage from "../assets/Fokus.png";
import weatherImage from "../assets/weatherApp.png";
import vocalVaultImage from "../assets/vocalVault.png";
import caseCobra from "../assets/Home.png";
import cleanUp from "../assets/CleanUpHome.png";
import realtimeChatImage from "../assets/Destroyed.png";
import playoffsSimulatorImage from "../assets/4a0.png";
import fluigLogo from "../assets/fluig-logo.png";
import jenkinsLogo from "../assets/Jenkins.svg";

const PER_PAGE_DESKTOP = 2;
const PER_PAGE_MOBILE = 1;

type ProjectMeta = Omit<Project, "title" | "subtitle" | "description" | "details"> & { id: ProjectId };

// Language-independent data, in display order; the text of each project lives in src/i18n
const PROJECTS: ProjectMeta[] = [
	// Work projects first, led by the one with the biggest business impact; personal and study projects last
	{
		id: "salesAutomation",
		image: fluigLogo,
		mini: "/minis/salesAutomation.svg",
		techStack: ["dotnet", "rabbitmq", "gcp", "llm", "microservices", "grafana", "restApi"],
	},
	{
		id: "fluigPipeline",
		image: jenkinsLogo,
		mini: "/minis/Jenkins.png",
		techStack: [
			"jenkins",
			"groovy",
			"fluig",
			"cicd",
			"restApi",
			"git",
			"automation",
			"devops",
		],
	},
	{
		id: "inventoryCount",
		image: fluigLogo,
		mini: "/minis/fluig.png",
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
		image: fluigLogo,
		mini: "/minis/fluig.png",
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
		image: fluigLogo,
		mini: "/minis/fluig.png",
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
		image: fluigLogo,
		mini: "/minis/fluig.png",
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
		image: playoffsSimulatorImage,
		mini: "/minis/icon.svg",
		techStack: ["typescript", "nextjs", "zustand", "zod", "motion", "tailwind", "vitest"],
		demoLink: "https://4a0-self.vercel.app/jogo",
		githubLink: "https://github.com/jpiologo/4a0",
	},
	{
		id: "cleanUp",
		image: cleanUp,
		mini: "/minis/clean-up-logo.png",
		techStack: ["typescript", "nextjs", "nestjs", "postgresql", "prisma", "tailwind", "jwt"],
		githubLink: "https://github.com/jpiologo/CleanUp---Frontend",
		inDevelopment: true,
	},
	{
		id: "caseCobra",
		image: caseCobra,
		mini: "/minis/CaseCobra.png",
		techStack: ["typescript", "nextjs", "postgresql", "prisma", "stripe", "kinde", "uploadthing", "resend"],
		demoLink: "https://casecobra-taupe.vercel.app/",
		githubLink: "https://github.com/jpiologo/CaseCobra",
	},
	{
		id: "realtimeChat",
		image: realtimeChatImage,
		mini: "/minis/terminal.svg",
		techStack: ["typescript", "nextjs", "elysia", "upstash", "reactQuery", "zod", "tailwind"],
		demoLink: "https://realtime-chat-iota-six.vercel.app/",
		githubLink: "https://github.com/jpiologo/Realtime_Chat",
	},
	{
		id: "taskManager",
		image: fokusImage,
		mini: "/minis/fokusLogo.png",
		miniIsWhite: true,
		techStack: ["javascript", "html", "css", "localStorage"],
		demoLink: "https://fokus-mu-eight.vercel.app/",
		githubLink: "https://github.com/jpiologo/fokusProject",
	},
	{
		id: "weatherApp",
		image: weatherImage,
		mini: "/minis/weatherApp.png",
		techStack: ["javascript", "openWeatherMap", "restApi", "json"],
		demoLink: "https://weather-app-kappa-black.vercel.app/",
		githubLink: "https://github.com/jpiologo/weatherApp",
	},
	{
		id: "vocalVault",
		image: vocalVaultImage,
		mini: "/minis/vault.svg",
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
		<section id="projects" className="page-section relative py-16">
			<div className="max-w-6xl mx-auto px-4">
				<div className="text-center mb-14 full-page:mb-[5vh]">
					<h2 className="section-heading mb-6 full-page:mb-[2vh]">
						{t.projects.heading}
					</h2>
					<p className="section-intro max-w-xl mx-auto">
						{t.projects.introBefore}
						<b>{t.projects.introBold}</b>
						{t.projects.introAfter}
					</p>
				</div>

				<Carousel
					items={projects}
					perPage={perPage}
					label={t.projects.carouselLabel}
					getKey={(project) => project.title}
					getName={(project) => project.title}
					renderItem={(project) => <ProjectCard project={project} />}
					renderPreview={(project) => (
						<img
							src={project.mini}
							alt=""
							loading="lazy"
							className={`h-12 w-auto max-w-24 object-contain ${
								project.miniIsWhite ? "rounded-md bg-black p-1 dark:bg-transparent dark:p-0" : ""
							}`}
						/>
					)}
				/>
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
