import { GraduationCap, Wrench } from "lucide-react";
import { useI18n } from "../i18n/context";
import type { Project } from "../lib/types";

/** Status labels of a project (study project, in development); nothing when it has none. */
const ProjectBadges = ({ project, className = "" }: { project: Project; className?: string }) => {
	const t = useI18n();
	if (!project.isStudy && !project.inDevelopment) return null;

	return (
		<ul className={`flex flex-wrap gap-2 ${className}`}>
			{project.isStudy && (
				<li className="proj-badge">
					<GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
					{t.projects.studyProject}
				</li>
			)}
			{project.inDevelopment && (
				<li className="proj-badge">
					<Wrench className="w-3.5 h-3.5" aria-hidden="true" />
					{t.projects.inDevelopment}
				</li>
			)}
		</ul>
	);
};

export default ProjectBadges;
