import type { Project } from "../lib/types";
import { useI18n } from "../i18n/context";
import type { ProjectId } from "../i18n/en";
import ProjectCarousel from "./ProjectCarousel";
import fokusImage from "../assets/Fokus.png";
import weatherImage from "../assets/weatherApp.png";
import vocalVaultImage from "../assets/vocalVault.png";
import caseCobra from "../assets/Home.png";
import cleanUp from "../assets/CleanUpHome.png";
import fluigLogo from "../assets/fluig-logo.png";
import jenkinsLogo from "../assets/Jenkins.svg";

type ProjectMeta = Omit<Project, "title" | "subtitle" | "description" | "details"> & { id: ProjectId };

// Language-independent data, in display order; the text of each project lives in src/i18n
const PROJECTS: ProjectMeta[] = [
	{
		id: "cleanUp",
		image: cleanUp,
		githubLink: "https://github.com/jpiologo/CleanUp---Frontend",
		inDevelopment: true,
	},
	{
		id: "caseCobra",
		image: caseCobra,
		demoLink: "https://casecobra-taupe.vercel.app/",
		githubLink: "https://github.com/jpiologo/CaseCobra",
	},
	{ id: "inventoryCount", image: fluigLogo },
	{ id: "purchasingFlow", image: fluigLogo },
	{ id: "vehicleSales", image: fluigLogo },
	{ id: "hrWorkflows", image: fluigLogo },
	{ id: "fluigPipeline", image: jenkinsLogo },
	{
		id: "taskManager",
		image: fokusImage,
		demoLink: "https://fokus-mu-eight.vercel.app/",
		githubLink: "https://github.com/jpiologo/fokusProject",
	},
	{
		id: "weatherApp",
		image: weatherImage,
		demoLink: "https://weather-app-kappa-black.vercel.app/",
		githubLink: "https://github.com/jpiologo/weatherApp",
	},
	{
		id: "vocalVault",
		image: vocalVaultImage,
		demoLink: "https://vocalvault-c5qkg3u7e-joao-piologos-projects.vercel.app/",
		githubLink: "https://github.com/jpiologo/voiceCommandApp",
	},
];

const Projects = () => {
	const t = useI18n();
	const projects: Project[] = PROJECTS.map(({ id, ...meta }) => ({ ...meta, ...t.projects.items[id] }));

	return (
		<section id="projects" className="py-16">
			<div className="max-w-6xl mx-auto px-4">
				<div className="text-center mb-14">
					<h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary tracking-tight">
						{t.projects.heading}
					</h2>
					<p className="text-xl text-text-muted leading-relaxed font-light max-w-xl mx-auto">
						{t.projects.introBefore}
						<b>{t.projects.introBold}</b>
						{t.projects.introAfter}
					</p>
					<figure className="mt-6 text-text-muted">
						<blockquote className="text-base md:text-lg italic font-light">“{t.projects.quote}”</blockquote>
						<figcaption className="mt-1 text-sm opacity-70">— {t.projects.quoteAuthor}</figcaption>
					</figure>
				</div>

				<ProjectCarousel projects={projects} />
			</div>
		</section>
	);
};

export default Projects;
