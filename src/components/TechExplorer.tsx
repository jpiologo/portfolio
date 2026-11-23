import { useState } from "react";
import { useI18n } from "../i18n/context";
import type { Messages } from "../i18n/en";
import type { TechId } from "../lib/techCatalog";
import TechChip from "./TechChip";
import TechMarquee from "./TechMarquee";

type GroupId = keyof Messages["whatIDo"]["stackGroups"];

const GROUPS: { id: GroupId; techs: TechId[] }[] = [
	{ id: "languages", techs: ["typescript", "javascript", "csharp", "java", "html", "css"] },
	{ id: "frontend", techs: ["react", "nextjs", "tailwind", "sass", "bootstrap", "jquery"] },
	{ id: "backend", techs: ["nodejs", "nestjs", "dotnet", "springBoot", "rabbitmq"] },
	{ id: "data", techs: ["postgresql", "mysql", "prisma", "supabase"] },
	{ id: "cloud", techs: ["docker", "gcp", "cloudflare", "jenkins", "grafana", "git"] },
	{ id: "totvs", techs: ["fluig", "protheus"] },
];

const ALL_TECHS = GROUPS.flatMap(({ techs }) => techs);

/** Null shows every group. */
type Filter = GroupId | null;

const FILTERS: Filter[] = [null, ...GROUPS.map(({ id }) => id)];

/** The stack, filtered by area on md+ screens; phones get a marquee instead. */
const TechExplorer = () => {
	const t = useI18n();
	const [filter, setFilter] = useState<Filter>(null);
	const techs = GROUPS.find(({ id }) => id === filter)?.techs ?? ALL_TECHS;

	return (
		<>
			<div className="mb-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
				<h3 className="text-xl font-bold text-text-primary">{t.whatIDo.stackLabel}</h3>
				<div role="group" aria-label={t.whatIDo.stackFilterLabel} className="hidden md:flex flex-wrap gap-2">
					{FILTERS.map((id) => {
						const isActive = id === filter;
						return (
							<button
								key={id ?? "all"}
								type="button"
								aria-pressed={isActive}
								onClick={() => setFilter(id)}
								className={`tap-target rounded-control border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary ${
									isActive
										? "border-accent-primary bg-accent-primary text-on-accent"
										: "border-border-subtle bg-background-elevated text-text-muted hover:border-accent-secondary hover:text-accent-secondary"
								}`}
							>
								{id ? t.whatIDo.stackGroups[id] : t.whatIDo.stackAll}
							</button>
						);
					})}
				</div>
			</div>

			<ul className="hidden md:flex flex-wrap gap-2">
				{techs.map((tech) => (
					<TechChip key={tech} id={tech} />
				))}
			</ul>
			<div className="md:hidden">
				<TechMarquee ids={ALL_TECHS} />
			</div>
		</>
	);
};

export default TechExplorer;
