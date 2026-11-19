import { useI18n } from "../i18n/context";
import { TECH, type TechId, techLabel } from "../lib/techCatalog";

/** Seconds for one row to scroll past once; longer rows keep the same speed per item. */
const SECONDS_PER_ITEM = 2.5;

const Row = ({ ids, reverse }: { ids: TechId[]; reverse: boolean }) => {
	const t = useI18n();

	const items = (copy: number) => (
		<ul
			// The second copy only exists to close the loop, so screen readers skip it
			aria-hidden={copy === 1 || undefined}
			className="flex shrink-0 gap-3 pr-3"
		>
			{ids.map((id) => {
				const Icon = TECH[id].icon;
				return (
					<li
						key={id}
						className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border-subtle bg-background-elevated px-3 py-2 text-xs font-medium text-text-muted shadow-sm"
					>
						<Icon className="h-4 w-4 text-accent-secondary" aria-hidden="true" />
						{techLabel(id, t.techNames)}
					</li>
				);
			})}
		</ul>
	);

	return (
		<div className="overflow-hidden motion-reduce:overflow-x-auto">
			<div
				style={{ animationDuration: `${ids.length * SECONDS_PER_ITEM}s` }}
				className={`flex w-max ${reverse ? "motion-safe:animate-marquee-reverse" : "motion-safe:animate-marquee"}`}
			>
				{items(0)}
				{items(1)}
			</div>
		</div>
	);
};

/** Technologies scrolling sideways in two rows going opposite ways; the phone version of TechStack. */
const TechMarquee = ({ ids }: { ids: TechId[] }) => {
	const half = Math.ceil(ids.length / 2);

	return (
		<div className="flex w-full flex-col gap-3 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
			<Row ids={ids.slice(0, half)} reverse={false} />
			<Row ids={ids.slice(half)} reverse />
		</div>
	);
};

export default TechMarquee;
