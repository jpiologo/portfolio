import { useI18n } from "../i18n/context";
import { TECH, type TechId, techLabel } from "../lib/techCatalog";

/** Technology icons; the name shows in a tooltip on hover and is read out by screen readers. */
const TechStack = ({ ids, className = "" }: { ids: TechId[]; className?: string }) => {
	const t = useI18n();

	return (
		<ul className={`flex flex-wrap gap-2.5 ${className}`}>
			{ids.map((id) => {
				const Icon = TECH[id].icon;
				const label = techLabel(id, t.techNames);
				return (
					<li key={id} className="group/tech relative">
						<span
							role="img"
							aria-label={label}
							className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-background-elevated text-text-muted transition-colors duration-200 group-hover/tech:border-accent-secondary/60 group-hover/tech:text-accent-secondary"
						>
							<Icon className="h-5 w-5" aria-hidden="true" />
						</span>
						<span
							aria-hidden="true"
							className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-border-subtle bg-background-elevated px-2 py-1 text-xs font-medium text-text-primary opacity-0 shadow-md transition-all duration-150 group-hover/tech:translate-y-0 group-hover/tech:opacity-100"
						>
							{label}
						</span>
					</li>
				);
			})}
		</ul>
	);
};

export default TechStack;
