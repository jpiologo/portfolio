import type { LucideIcon } from "lucide-react";
import { BrainCircuit, Gauge, Globe, Server, Workflow } from "lucide-react";
import { useI18n } from "../i18n/context";
import type { Messages } from "../i18n/en";
import { parallaxHandlers } from "../lib/parallax";
import type { TechId } from "../lib/techCatalog";
import TechStack from "./TechStack";

type AreaId = keyof Messages["whatIDo"]["areas"];

const AREAS: { id: AreaId; icon: LucideIcon }[] = [
	{ id: "engineering", icon: Server },
	{ id: "web", icon: Globe },
	{ id: "automation", icon: Workflow },
	{ id: "devops", icon: Gauge },
	{ id: "ai", icon: BrainCircuit },
];

// Languages, frameworks, data, cloud and tooling, then the TOTVS platforms
const STACK: TechId[] = [
	"typescript",
	"javascript",
	"csharp",
	"java",
	"c",
	"cpp",
	"html",
	"css",
	"react",
	"nextjs",
	"nodejs",
	"nestjs",
	"dotnet",
	"springBoot",
	"tailwind",
	"sass",
	"bootstrap",
	"jquery",
	"postgresql",
	"mysql",
	"prisma",
	"supabase",
	"rabbitmq",
	"docker",
	"gcp",
	"cloudflare",
	"jenkins",
	"grafana",
	"git",
	"maven",
	"postman",
	"notion",
	"fluig",
	"protheus",
];

const WhatIDo = () => {
	const t = useI18n();

	return (
		<section id="what-i-do" className="page-section py-24 bg-background-surface/60">
			<div className="max-w-6xl mx-auto px-4">
				<div className="grid md:grid-cols-2 gap-6 md:items-end mb-12 full-page:mb-[5vh]">
					<h2 className="section-heading">{t.whatIDo.heading}</h2>
					<p className="section-intro md:max-w-md md:justify-self-end">{t.whatIDo.intro}</p>
				</div>

				<ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
					{AREAS.map(({ id, icon: Icon }, index) => (
						<li
							key={id}
							{...parallaxHandlers}
							className="parallax-card group flex flex-col rounded-2xl border border-border-subtle bg-background-elevated p-5 full-page:p-[2.5vh] shadow-sm hover:shadow-xl hover:border-accent-secondary/60"
						>
							<div className="flex items-start justify-between mb-6 full-page:mb-[3vh]">
								<span className="font-label text-xs text-text-muted">{String(index + 1).padStart(2, "0")}.</span>
								<Icon className="parallax-depth [--depth:20px] w-6 h-6 text-accent-secondary" strokeWidth={1.5} />
							</div>
							<h3 className="font-label text-sm font-semibold uppercase tracking-wide text-text-primary mb-2 group-hover:text-accent-secondary transition-colors">
								{t.whatIDo.areas[id].title}
							</h3>
							<p className="text-sm text-text-muted font-light leading-relaxed">{t.whatIDo.areas[id].description}</p>
						</li>
					))}
				</ol>

				<div className="mt-12 full-page:mt-[5vh] flex flex-col items-center gap-4">
					<p className="font-label text-xs uppercase tracking-widest text-text-muted">{t.whatIDo.stackLabel}</p>
					<TechStack ids={STACK} className="justify-center" />
				</div>
			</div>
		</section>
	);
};

export default WhatIDo;
