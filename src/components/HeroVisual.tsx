import type React from "react";
import type { LucideIcon } from "lucide-react";
import { Activity, PlugZap, ShieldCheck } from "lucide-react";
import { useI18n } from "../i18n/context";
import type { Messages } from "../i18n/en";
import { AUTOMATED_TESTS, REQUESTS_IN_PRODUCTION_THOUSANDS } from "../lib/profile";
import { TECH, type TechId } from "../lib/techCatalog";

type ChipId = keyof Messages["hero"]["chips"];

const OUTER_ORBIT: TechId[] = ["dotnet", "fluig", "react", "rabbitmq", "gcp"];
const INNER_ORBIT: TechId[] = ["jenkins", "typescript", "mongodb"];

/** A deploy log typed line by line, on a loop; the delay of each line comes from its index (index.css). */
const LOG_LINES: { text: string; tone: "muted" | "success" | "accent" }[] = [
	{ text: "$ git push origin main", tone: "muted" },
	{ text: "› jenkins  pipeline #418", tone: "muted" },
	{ text: `✓ tests    ${AUTOMATED_TESTS} passed · 0.33s`, tone: "success" },
	{ text: "✓ build    forms · datasets · widgets", tone: "success" },
	{ text: "✓ deploy   fluig-prod", tone: "success" },
	{ text: "● live in production", tone: "accent" },
];

const TONE_CLASS = {
	muted: "text-text-muted",
	success: "text-feedback-success",
	accent: "text-accent-secondary",
};

const CHIPS: { id: ChipId; icon: LucideIcon; position: string; floatDelay: string }[] = [
	{ id: "requests", icon: Activity, position: "top-[4%] -left-[6%]", floatDelay: "0s" },
	{ id: "tests", icon: ShieldCheck, position: "top-[18%] -right-[8%]", floatDelay: "-2s" },
	{ id: "integrations", icon: PlugZap, position: "bottom-[6%] left-[2%]", floatDelay: "-4s" },
];

/** Spreads `count` items evenly around a circle, as % positions inside its box. */
const orbitPosition = (index: number, count: number): React.CSSProperties => {
	const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
	return { left: `${50 + 50 * Math.cos(angle)}%`, top: `${50 + 50 * Math.sin(angle)}%` };
};

const Orbit = ({ ids, className, reverse = false }: { ids: TechId[]; className: string; reverse?: boolean }) => (
	<div
		className={`absolute rounded-full border border-dashed border-text-muted/25 ${
			reverse ? "motion-safe:animate-orbit-reverse" : "motion-safe:animate-orbit"
		} ${className}`}
	>
		{ids.map((id, index) => {
			const Icon = TECH[id].icon;
			return (
				<span key={id} style={orbitPosition(index, ids.length)} className="absolute -translate-x-1/2 -translate-y-1/2">
					{/* Spins the other way, so the icon stays upright while the ring turns */}
					<span
						className={`flex h-11 w-11 items-center justify-center rounded-control border border-border-subtle bg-background-elevated text-text-muted shadow-md ${
							reverse ? "motion-safe:animate-orbit" : "motion-safe:animate-orbit-reverse"
						}`}
					>
						<Icon className="h-5 w-5" />
					</span>
				</span>
			);
		})}
	</div>
);

/** Decorative hero illustration: a deploy terminal with the stack orbiting around it and a few real results. */
const HeroVisual = ({ className = "" }: { className?: string }) => {
	const t = useI18n();
	const chipValues: Record<ChipId, string> = {
		requests: t.hero.chips.requests.value(REQUESTS_IN_PRODUCTION_THOUSANDS),
		tests: `${AUTOMATED_TESTS} ✓`,
		integrations: "ERP + APIs",
	};

	return (
		<div aria-hidden="true" className={`relative mx-auto aspect-square w-full max-w-[500px] ${className}`}>
			<div className="absolute inset-[24%] rounded-full bg-accent-secondary/25 blur-3xl" />
			<Orbit ids={OUTER_ORBIT} className="inset-0" />
			<Orbit ids={INNER_ORBIT} className="inset-[17%]" reverse />

			<div className="absolute left-1/2 top-1/2 z-10 w-[84%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-card border border-border-subtle bg-background-elevated/95 shadow-2xl backdrop-blur">
				<div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
					<span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
					<span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
					<span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
					<span className="ml-3 font-mono text-[11px] text-text-muted">jenkins — fluig-pipeline</span>
				</div>
				<div className="space-y-1.5 px-4 py-4 font-mono text-[12px] leading-relaxed">
					{LOG_LINES.map(({ text, tone }, index) => (
						<p
							key={text}
							style={{ "--i": index } as React.CSSProperties}
							className={`hero-log-line whitespace-pre ${TONE_CLASS[tone]}`}
						>
							{text}
						</p>
					))}
				</div>
				<div className="h-1 bg-background-surface">
					<div className="hero-log-progress h-full bg-gradient-to-r from-accent-primary to-accent-secondary" />
				</div>
			</div>

			{CHIPS.map(({ id, icon: Icon, position, floatDelay }) => (
				<div key={id} className={`absolute z-20 ${position}`}>
					<div
						style={{ animationDelay: floatDelay }}
						className="flex items-center gap-3 rounded-card border border-border-subtle bg-background-elevated/95 px-3.5 py-2.5 shadow-xl backdrop-blur motion-safe:animate-bob"
					>
						<span className="flex h-9 w-9 items-center justify-center rounded-control bg-accent-secondary/10 text-accent-secondary">
							<Icon className="h-[18px] w-[18px]" />
						</span>
						<span className="flex flex-col">
							<span className="text-sm font-bold leading-tight text-text-primary">{chipValues[id]}</span>
							<span className="text-[11px] leading-tight text-text-muted">{t.hero.chips[id].label}</span>
						</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default HeroVisual;
