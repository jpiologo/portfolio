import { useState } from "react";
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

interface ProjectCardProps {
	project: {
		title: string;
		subtitle: string;
		description: string;
		image: string;
		tags: string[];
		demoLink?: string;
		githubLink: string;
		details: {
			challenge: string;
			solution: string;
			techStack: string[];
			features: string[];
		};
	};
}

const ProjectCard = ({ project }: ProjectCardProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<>
			{/* Card */}
			<div
				className="proj-card group"
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
						className="proj-card-image"
					/>
					<div className="proj-card-image-overlay">
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
							) : (
								<span className="proj-card-status">
									<Wrench className="w-3.5 h-3.5" />
									In Development
								</span>
							)}
							<a
								target="_blank"
								href={project.githubLink}
								className="proj-card-icon-btn"
								rel="noreferrer"
								onClick={(e) => e.stopPropagation()}
							>
								<Github className="w-4 h-4" />
							</a>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="proj-card-body">
					<span className="proj-card-subtitle">{project.subtitle}</span>
					<h3 className="proj-card-title">{project.title}</h3>
					<p className="proj-card-desc">{project.description}</p>

					<div className="proj-card-tags">
						{project.tags.map((tag) => (
							<span key={tag} className="proj-card-tag">
								{tag}
							</span>
						))}
					</div>

					<div className="proj-card-cta">
						<span>View Case Study</span>
						<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
					</div>
				</div>
			</div>

			{/* Modal */}
			{isExpanded && (
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
								<span className="proj-modal-subtitle">
									{project.subtitle}
								</span>
								<h3 className="proj-modal-title">{project.title}</h3>
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
									<div className="proj-modal-section-icon">
										<Lightbulb className="w-4 h-4 text-blue-500" />
									</div>
									<h4 className="proj-modal-section-title">
										The Challenge
									</h4>
									<p className="proj-modal-section-text">
										{project.details.challenge}
									</p>
								</div>
								<div className="proj-modal-section">
									<div className="proj-modal-section-icon">
										<Rocket className="w-4 h-4 text-blue-500" />
									</div>
									<h4 className="proj-modal-section-title">
										The Solution
									</h4>
									<p className="proj-modal-section-text">
										{project.details.solution}
									</p>
								</div>
							</div>

							{/* Stack + Features side by side */}
							<div className="proj-modal-grid">
								<div className="proj-modal-section">
									<div className="proj-modal-section-icon">
										<Layers className="w-4 h-4 text-blue-500" />
									</div>
									<h4 className="proj-modal-section-title">
										Tech Stack
									</h4>
									<div className="proj-modal-tags">
										{project.details.techStack.map((tech) => (
											<span key={tech} className="proj-modal-tag">
												{tech}
											</span>
										))}
									</div>
								</div>
								<div className="proj-modal-section">
									<div className="proj-modal-section-icon">
										<Code2 className="w-4 h-4 text-blue-500" />
									</div>
									<h4 className="proj-modal-section-title">
										Key Deliverables
									</h4>
									<ul className="proj-modal-features">
										{project.details.features.map((f) => (
											<li key={f}>{f}</li>
										))}
									</ul>
								</div>
							</div>

							{/* Actions */}
							<div className="proj-modal-actions">
								{project.demoLink ? (
									<a
										target="_blank"
										href={project.demoLink}
										className="proj-modal-btn-primary"
										rel="noreferrer"
									>
										<ExternalLink className="w-4 h-4" />
										Live Demo
									</a>
								) : (
									<button
										type="button"
										disabled
										className="proj-modal-btn-disabled"
									>
										<Wrench className="w-4 h-4" />
										In Development
									</button>
								)}
								<a
									target="_blank"
									href={project.githubLink}
									className="proj-modal-btn-secondary"
									rel="noreferrer"
								>
									<Github className="w-4 h-4" />
									View Source
								</a>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ProjectCard;
