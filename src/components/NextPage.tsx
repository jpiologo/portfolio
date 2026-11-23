import { ArrowRight } from "lucide-react";
import LocalLink from "./LocalLink";

/** Ends a post or a project: the title of the next one and a button that opens it. */
const NextPage = ({ to, title, label }: { to: string; title: string; label: string }) => (
	<nav
		aria-label={label}
		className="mt-16 flex flex-col items-start gap-5 border-t border-border-subtle pt-8 sm:flex-row sm:items-center sm:justify-between"
	>
		<p className="min-w-0 font-title text-xl font-bold text-text-primary">{title}</p>
		<LocalLink to={to} className="group btn-primary shrink-0" aria-label={`${label}: ${title}`}>
			{label}
			<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
		</LocalLink>
	</nav>
);

export default NextPage;
