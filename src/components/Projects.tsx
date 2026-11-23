import { useI18n } from "../i18n/context";
import Carousel from "./Carousel";
import ProjectCard from "./ProjectCard";
import { ProjectThumbnail } from "./ProjectCover";
import { getProjects } from "../lib/projects";
import { useIsDesktop } from "../lib/useMediaQuery";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const PER_PAGE_DESKTOP = 2;
const PER_PAGE_MOBILE = 1;

const Projects = () => {
	const t = useI18n();
	const perPage = useIsDesktop() ? PER_PAGE_DESKTOP : PER_PAGE_MOBILE;

	return (
		<section id="projects" className="relative page-section">
			<div className="page-container">
				<SectionHeader
					title={t.projects.heading}
					intro={
						<>
							{t.projects.introBefore}
							<b>{t.projects.introBold}</b>
							{t.projects.introAfter}
						</>
					}
				/>

				<Reveal delay={150}>
					<Carousel
						items={getProjects(t)}
						perPage={perPage}
						label={t.projects.carouselLabel}
						getKey={(project) => project.slug}
						getName={(project) => project.title}
						renderItem={(project) => <ProjectCard project={project} />}
						renderPreview={(project) => <ProjectThumbnail project={project} />}
					/>
				</Reveal>
			</div>

			{/* Easter egg: tucked away in the corner */}
			<figure className="absolute bottom-3 right-4 text-[0.8rem] italic text-text-muted/85 select-none">
				<blockquote className="inline">“{t.projects.quote}”</blockquote>
				<figcaption className="inline not-italic"> — {t.projects.quoteAuthor}</figcaption>
			</figure>
		</section>
	);
};

export default Projects;
