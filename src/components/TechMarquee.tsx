import type { TechId } from "../lib/techCatalog";
import TechChip from "./TechChip";

/** Seconds for one row to scroll past once; longer rows keep the same speed per item. */
const SECONDS_PER_ITEM = 2.5;

const Row = ({ ids, reverse }: { ids: TechId[]; reverse: boolean }) => {
	const items = (copy: number) => (
		<ul
			// The second copy only exists to close the loop, so screen readers skip it
			aria-hidden={copy === 1 || undefined}
			className="flex shrink-0 gap-3 pr-3"
		>
			{ids.map((id) => (
				<TechChip key={id} id={id} />
			))}
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

/** Technologies scrolling sideways in two rows going opposite ways; the phone version of the list in TechExplorer. */
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
