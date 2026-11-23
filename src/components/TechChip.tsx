import { useI18n } from "../i18n/context";
import { TECH, type TechId, techLabel } from "../lib/techCatalog";

/** A technology as a list item, with its icon and name. */
const TechChip = ({ id }: { id: TechId }) => {
	const t = useI18n();
	const Icon = TECH[id].icon;

	return (
		<li className="flex items-center gap-2 whitespace-nowrap rounded-control border border-border-subtle bg-background-elevated px-3 py-2 text-xs font-medium text-text-muted shadow-sm">
			<Icon className="h-4 w-4 text-accent-secondary" aria-hidden="true" />
			{techLabel(id, t.techNames)}
		</li>
	);
};

export default TechChip;
