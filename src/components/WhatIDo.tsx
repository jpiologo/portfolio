import type { LucideIcon } from "lucide-react";
import { BrainCircuit, Gauge, Globe, Server, Workflow } from "lucide-react";
import { useI18n } from "../i18n/context";
import type { Messages } from "../i18n/en";
import { parallaxHandlers } from "../lib/parallax";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import TechExplorer from "./TechExplorer";

type AreaId = keyof Messages["whatIDo"]["areas"];

const AREAS: { id: AreaId; icon: LucideIcon }[] = [
	{ id: "engineering", icon: Server },
	{ id: "web", icon: Globe },
	{ id: "automation", icon: Workflow },
	{ id: "devops", icon: Gauge },
	{ id: "ai", icon: BrainCircuit },
];

const WhatIDo = () => {
	const t = useI18n();

	return (
		<section id="what-i-do" className="page-section bg-background-surface/60">
			<div className="page-container">
				<SectionHeader title={t.whatIDo.heading} intro={t.whatIDo.intro} />

				<Reveal delay={150}>
					<ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
						{AREAS.map(({ id, icon: Icon }, index) => (
							<li
								key={id}
								{...parallaxHandlers}
								className="parallax-card group flex flex-col rounded-card border border-border-subtle bg-background-elevated p-5 shadow-sm hover:shadow-xl hover:border-accent-secondary/60 sm:max-lg:last:odd:col-span-2"
							>
								<div className="flex items-start justify-between mb-6">
									<span className="font-label text-xs text-text-muted">{String(index + 1).padStart(2, "0")}.</span>
									<Icon className="parallax-depth [--depth:20px] w-6 h-6 text-accent-secondary" strokeWidth={1.5} />
								</div>
								<h3 className="font-label text-sm font-semibold uppercase tracking-wide text-text-primary mb-2 group-hover:text-accent-secondary transition-colors">
									{t.whatIDo.areas[id].title}
								</h3>
								<p className="text-sm text-text-muted leading-relaxed">{t.whatIDo.areas[id].description}</p>
							</li>
						))}
					</ol>
				</Reveal>

				<Reveal delay={250} className="mt-12">
					<TechExplorer />
				</Reveal>
			</div>
		</section>
	);
};

export default WhatIDo;
