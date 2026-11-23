import type { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionHeaderProps = {
	title: string;
	intro: ReactNode;
	/** Button or link shown beside the text on md+ screens, below it on phones. */
	action?: ReactNode;
};

/** Heading and intro that open a home section. */
const SectionHeader = ({ title, intro, action }: SectionHeaderProps) => (
	<Reveal className="mb-12 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
		<div className="max-w-2xl">
			<h2 className="section-heading mb-4">{title}</h2>
			<p className="section-intro">{intro}</p>
		</div>
		{action}
	</Reveal>
);

export default SectionHeader;
