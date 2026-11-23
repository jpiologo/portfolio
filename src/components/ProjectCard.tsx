import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { useI18n } from "../i18n/context";
import { parallaxHandlers } from "../lib/parallax";
import type { Project } from "../lib/types";
import LocalLink from "./LocalLink";
import ProjectBadges from "./ProjectBadges";
import ProjectCover from "./ProjectCover";

const ProjectCard = ({ project }: { project: Project }) => {
	const t = useI18n();

	return (
		<div className="proj-card parallax-card group" {...parallaxHandlers}>
			{/* Image */}
			<div className="proj-card-image-wrap">
				<ProjectCover project={project} className="parallax-media" />
				<div className="proj-card-image-overlay">
					<div className="proj-card-image-actions">
						{project.demoLink && (
							<a
								target="_blank"
								href={project.demoLink}
								className="proj-card-icon-btn tap-target"
								rel="noreferrer"
								aria-label={`${t.projects.liveDemo}: ${project.title}`}
							>
								<ExternalLink className="w-4 h-4" aria-hidden="true" />
							</a>
						)}
						{project.githubLink && (
							<a
								target="_blank"
								href={project.githubLink}
								className="proj-card-icon-btn tap-target"
								rel="noreferrer"
								aria-label={`${t.projects.viewSource}: ${project.title}`}
							>
								<Github className="w-4 h-4" aria-hidden="true" />
							</a>
						)}
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="proj-card-body">
				<h3 className="proj-card-title">{project.title}</h3>
				<span className="proj-card-subtitle">{project.subtitle}</span>
				<ProjectBadges project={project} className="mb-3" />
				<p className="proj-card-desc">{project.description}</p>

				{/* Its hit area is stretched over the whole card (index.css) */}
				<LocalLink
					to={`/projects/${project.slug}`}
					className="proj-card-cta"
					aria-label={`${t.projects.viewCaseStudy}: ${project.title}`}
				>
					<span>{t.projects.viewCaseStudy}</span>
					<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
				</LocalLink>
			</div>
		</div>
	);
};

export default ProjectCard;
