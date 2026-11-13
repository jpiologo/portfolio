import { useState } from "react";
import { createPortal } from "react-dom";
import { parallaxHandlers } from "../lib/parallax";
import {
	ExternalLink,
	Github,
	X,
	ArrowRight,
	Rocket,
	Wrench,
	Code2,
	Lightbulb,
	Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Project } from "../lib/types";
import { useI18n } from "../i18n/context";
import TechStack from "./TechStack";

const SectionHeading = ({ icon: Icon, title }: { icon: LucideIcon; title: string }) => (
	<div className="proj-modal-section-heading">
		<div className="proj-modal-section-icon">
			<Icon className="w-4 h-4 text-accent-secondary" />
		</div>
		<h4 className="proj-modal-section-title">{title}</h4>
	</div>
);

const ProjectCard = ({ project }: { project: Project }) => {
	const t = useI18n();
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<>
			{/* Card */}
			<div
				className="proj-card parallax-card group"
				{...parallaxHandlers}
				onClick={() => setIsExpanded(true)}
				onKeyDown={(e) => e.key === "Enter" && setIsExpanded(true)}
				role="button"
				tabIndex={0}
			>
				{/* Image */}
				<div className="proj-card-image-wrap">
					<img
						src={project.image}
						alt={project.title}
						className="proj-card-image parallax-media"
					/>
					<div className="proj-card-image-overlay">
						{(project.demoLink || project.githubLink || project.inDevelopment) && (
							<div className="proj-card-image-actions">
								{project.demoLink ? (
									<a
										target="_blank"
										href={project.demoLink}
										className="proj-card-icon-btn"
										rel="noreferrer"
										onClick={(e) => e.stopPropagation()}
									>
										<ExternalLink className="w-4 h-4" />
									</a>
								) : project.inDevelopment ? (
									<span className="proj-card-status">
										<Wrench className="w-3.5 h-3.5" />
										{t.projects.inDevelopment}
									</span>
								) : null}
								{project.githubLink && (
									<a
										target="_blank"
										href={project.githubLink}
										className="proj-card-icon-btn"
										rel="noreferrer"
										onClick={(e) => e.stopPropagation()}
									>
										<Github className="w-4 h-4" />
									</a>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Content */}
				<div className="proj-card-body">
					<h3 className="proj-card-title">{project.title}</h3>
					<span className="proj-card-subtitle">{project.subtitle}</span>
					<p className="proj-card-desc">{project.description}</p>

					<div className="proj-card-cta">
						<span>{t.projects.viewCaseStudy}</span>
						<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
					</div>
				</div>
			</div>

			{/* Portaled: a transformed ancestor (the carousel track) would otherwise contain the fixed overlay */}
			{isExpanded && createPortal(
				<div
					className="proj-modal-overlay"
					onClick={() => setIsExpanded(false)}
					onKeyDown={(e) => e.key === "Escape" && setIsExpanded(false)}
					role="dialog"
					aria-modal="true"
				>
					<div
						className="proj-modal"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={() => {}}
						role="document"
					>
						{/* Modal Header */}
						<div className="proj-modal-header">
							<div>
								<h3 className="proj-modal-title">{project.title}</h3>
								<span className="proj-modal-subtitle">
									{project.subtitle}
								</span>
							</div>
							<button
								type="button"
								onClick={() => setIsExpanded(false)}
								className="proj-modal-close"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						{/* Modal Content */}
						<div className="proj-modal-content">
							{/* Hero image */}
							<img
								src={project.image}
								alt={project.title}
								className="proj-modal-image"
							/>

							{/* Two-column: Challenge + Solution */}
							<div className="proj-modal-grid">
								<div className="proj-modal-section">
									<SectionHeading icon={Lightbulb} title={t.projects.challenge} />
									<p className="proj-modal-section-text">
										{project.details.challenge}
									</p>
								</div>
								<div className="proj-modal-section">
									<SectionHeading icon={Rocket} title={t.projects.solution} />
									<p className="proj-modal-section-text">
										{project.details.solution}
									</p>
								</div>
							</div>

							{/* Stack + Features side by side */}
							<div className="proj-modal-grid">
								<div className="proj-modal-section">
									<SectionHeading icon={Layers} title={t.projects.techStack} />
									<TechStack ids={project.techStack} />
								</div>
								<div className="proj-modal-section">
									<SectionHeading icon={Code2} title={t.projects.deliverables} />
									<ul className="proj-modal-deliverables">
										{project.details.features.map((f) => (
											<li key={f}>{f}</li>
										))}
									</ul>
								</div>
							</div>

							{/* Actions */}
							{(project.demoLink || project.githubLink || project.inDevelopment) && (
								<div className="proj-modal-actions">
									{project.demoLink ? (
										<a
											target="_blank"
											href={project.demoLink}
											className="btn-primary"
											rel="noreferrer"
										>
											<ExternalLink className="w-4 h-4" />
											{t.projects.liveDemo}
										</a>
									) : project.inDevelopment ? (
										<button
											type="button"
											disabled
											className="btn-secondary"
										>
											<Wrench className="w-4 h-4" />
											{t.projects.inDevelopment}
										</button>
									) : null}
									{project.githubLink && (
										<a
											target="_blank"
											href={project.githubLink}
											className="btn-secondary"
											rel="noreferrer"
										>
											<Github className="w-4 h-4" />
											{t.projects.viewSource}
										</a>
									)}
								</div>
							)}
						</div>
					</div>
				</div>,
				document.body,
			)}
		</>
	);
};

export default ProjectCard;
