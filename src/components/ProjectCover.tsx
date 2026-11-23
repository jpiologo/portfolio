import type { Project } from "../lib/types";
import ProjectArt from "./ProjectArt";

/** Address shown in the fake browser bar: the demo's host, or the repository path. */
const displayUrl = ({ demoLink, githubLink }: Project) => {
	const link = demoLink ?? githubLink;
	if (!link) return "";
	const url = new URL(link);
	return demoLink ? url.hostname : `${url.hostname}${url.pathname}`;
};

/** Screenshot inside a small browser window, so personal projects share one framed look. */
const BrowserFrame = ({ project, src, isPriority }: { project: Project; src: string; isPriority: boolean }) => (
	<div className="flex h-full w-full flex-col bg-background-surface px-4 pt-4">
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-control border border-b-0 border-border-subtle bg-background-elevated shadow-lg">
			<div className="flex items-center gap-1.5 border-b border-border-subtle px-3 py-2">
				<span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
				<span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
				<span className="h-2 w-2 rounded-full bg-[#28C840]" />
				<span className="ml-2 min-w-0 flex-1 truncate rounded-control bg-background-surface px-2 py-0.5 font-mono text-[10px] text-text-muted">
					{displayUrl(project)}
				</span>
			</div>
			<img src={src} alt={project.title} loading={isPriority ? "eager" : "lazy"} className="min-h-0 w-full flex-1 object-cover object-top" />
		</div>
	</div>
);

/** Every thumbnail shares this 16:8 box, so the hover previews line up whatever the project. */
const THUMBNAIL_BOX = "h-12 w-24 shrink-0 overflow-hidden rounded-control border border-border-subtle";

/** Small preview shown when hovering a carousel dot: a mini illustration, or the project's logo. */
export const ProjectThumbnail = ({ project }: { project: Project }) => {
	const { cover } = project;

	if (cover.kind === "art") {
		return (
			<div className={THUMBNAIL_BOX}>
				<ProjectArt id={cover.id} />
			</div>
		);
	}

	// White logos need a dark backdrop in light mode
	return (
		<div
			className={`${THUMBNAIL_BOX} flex items-center justify-center p-1.5 ${
				cover.logoIsWhite ? "bg-black dark:bg-background-surface" : "bg-background-surface"
			}`}
		>
			<img src={cover.logo} alt="" loading="lazy" className="h-full w-full object-contain" />
		</div>
	);
};

/** Cover of a project card or page: its animated illustration, or its framed screenshot. */
const ProjectCover = ({
	project,
	className = "",
	isPriority = false,
}: {
	project: Project;
	className?: string;
	/** Set when it is the main image of the page. */
	isPriority?: boolean;
}) => {
	const { cover } = project;

	return (
		<div className={`h-full w-full ${className}`}>
			{cover.kind === "art" ? <ProjectArt id={cover.id} /> : <BrowserFrame project={project} src={cover.src} isPriority={isPriority} />}
		</div>
	);
};

export default ProjectCover;
