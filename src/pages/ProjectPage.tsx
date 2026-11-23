import { type ReactNode, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Check, ExternalLink, Github } from "lucide-react";
import LocalLink from "../components/LocalLink";
import NextPage from "../components/NextPage";
import ProjectBadges from "../components/ProjectBadges";
import ProjectCover from "../components/ProjectCover";
import TechChip from "../components/TechChip";
import { useI18n } from "../i18n/context";
import { pageTitle } from "../lib/profile";
import { getProjects } from "../lib/projects";
import NotFound from "./NotFound";

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
	<section>
		<h2 className="text-2xl font-bold text-text-primary tracking-tight mb-4">{title}</h2>
		{children}
	</section>
);

const ProjectPage = () => {
	const { slug } = useParams();
	const t = useI18n();
	const projects = getProjects(t);
	const index = projects.findIndex((project) => project.slug === slug);
	const project = projects[index];
	const next = projects[(index + 1) % projects.length];

	useEffect(() => {
		if (project) document.title = pageTitle(project.title);
	}, [project]);

	if (!project) return <NotFound />;

	return (
		<article className="pt-32 pb-24 bg-background-base min-h-screen">
			<div className="page-container">
				<LocalLink
					to="/#projects"
					className="tap-target inline-flex items-center gap-2 text-text-muted hover:text-accent-secondary transition-colors mb-10"
				>
					<ArrowLeft className="w-4 h-4" aria-hidden="true" />
					{t.projects.allProjects}
				</LocalLink>

				<header className="max-w-3xl mb-10">
					<ProjectBadges project={project} className="mb-4" />
					<h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-4">
						{project.title}
					</h1>
					<p className="text-xl text-accent-secondary font-medium mb-6">{project.subtitle}</p>
					<p className="text-lg text-text-muted leading-relaxed">{project.description}</p>
				</header>

				<div data-og-image className="aspect-[40/22] overflow-hidden rounded-card border border-border-subtle mb-12">
					<ProjectCover project={project} isPriority />
				</div>

				<div className="grid lg:grid-cols-[minmax(0,1fr)_20rem] gap-12">
					<div className="space-y-12">
						<Section title={t.projects.challenge}>
							<p className="text-lg text-text-muted leading-relaxed">{project.details.challenge}</p>
						</Section>
						<Section title={t.projects.solution}>
							<p className="text-lg text-text-muted leading-relaxed">{project.details.solution}</p>
						</Section>
					</div>

					<aside className="space-y-8">
						<Section title={t.projects.techStack}>
							<ul className="flex flex-wrap gap-2">
								{project.techStack.map((id) => (
									<TechChip key={id} id={id} />
								))}
							</ul>
						</Section>
						{(project.demoLink || project.githubLink) && (
							<div className="flex flex-col gap-3">
								{project.demoLink && (
									<a target="_blank" href={project.demoLink} className="btn-primary" rel="noreferrer">
										<ExternalLink className="w-4 h-4" aria-hidden="true" />
										{t.projects.liveDemo}
									</a>
								)}
								{project.githubLink && (
									<a target="_blank" href={project.githubLink} className="btn-secondary" rel="noreferrer">
										<Github className="w-4 h-4" aria-hidden="true" />
										{t.projects.viewSource}
									</a>
								)}
							</div>
						)}
					</aside>
				</div>

				<div className="mt-12">
					<Section title={t.projects.deliverables}>
						{/* Each cell overlaps its neighbours' borders by 1px, so the grid keeps single hairlines */}
						<ul className="grid sm:grid-cols-2 lg:grid-cols-3 pl-px pt-px">
							{project.details.features.map((feature) => (
								<li
									key={feature}
									className="-ml-px -mt-px flex items-start gap-3 border border-border-subtle bg-background-elevated p-5 text-text-primary leading-snug"
								>
									<span className="flex h-6 w-6 shrink-0 items-center justify-center bg-accent-secondary/10 text-accent-secondary">
										<Check className="h-4 w-4" aria-hidden="true" />
									</span>
									{feature}
								</li>
							))}
						</ul>
					</Section>
				</div>

				<NextPage to={`/projects/${next.slug}`} title={next.title} label={t.projects.nextProject} />
			</div>
		</article>
	);
};

export default ProjectPage;
