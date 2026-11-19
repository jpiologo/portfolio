import type React from "react";
import { type ComponentType, createContext, type ReactNode, useContext, useEffect, useId, useRef } from "react";
import type { ProjectArtId } from "../lib/types";

/*
 * Animated illustrations used as project covers, one per work project (NDA code has no screenshots).
 * All drawn on a 400×220 canvas; theme colors come from Tailwind fill-/stroke- classes, the accent
 * of each scene is its own hue. Animation classes (.art-*) live in index.css.
 */

const W = 400;
const H = 220;

type Point = [number, number];

/*
 * Liquid ("gooey") blending: shapes inside a <Goo> layer are blurred and their transparency is
 * cut back to a hard edge, so shapes that come close melt into one blob, like drops of water.
 */
const GOO_BLUR = 4;
const GOO_ALPHA_MATRIX = "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10";
/** Big enough to survive the blur; smaller dots would fade away. */
const DROP_RADIUS = 6.5;

/** Id of the scene's goo filter, so layers can reference it without prop drilling. */
const GooFilter = createContext("");

const delay = (seconds: number) => ({ "--delay": `${seconds}s` }) as React.CSSProperties;

/**
 * Pauses the scene while it is off screen (other carousel pages, hidden previews), so only the
 * covers in view spend CPU: CSS animations via `.art-paused`, SMIL travellers via pauseAnimations().
 */
const usePauseWhenHidden = () => {
	const ref = useRef<SVGSVGElement>(null);

	useEffect(() => {
		const svg = ref.current;
		if (!svg) return;
		const observer = new IntersectionObserver(([entry]) => {
			svg.classList.toggle("art-paused", !entry.isIntersecting);
			if (entry.isIntersecting) svg.unpauseAnimations();
			else svg.pauseAnimations();
		});
		observer.observe(svg);
		return () => observer.disconnect();
	}, []);

	return ref;
};

const Scene = ({ accent, children }: { accent: string; children: ReactNode }) => {
	const id = useId().replace(/:/g, "");
	const ref = usePauseWhenHidden();
	const gooId = `goo-${id}`;
	return (
		<GooFilter.Provider value={gooId}>
			<svg ref={ref} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
				<defs>
					<pattern id={`dots-${id}`} width="16" height="16" patternUnits="userSpaceOnUse">
						<circle cx="2" cy="2" r="1.1" className="fill-text-muted/25" />
					</pattern>
					<radialGradient id={`glow-${id}`}>
						<stop offset="0" stopColor={accent} stopOpacity="0.28" />
						<stop offset="1" stopColor={accent} stopOpacity="0" />
					</radialGradient>
					<filter id={gooId} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H} colorInterpolationFilters="sRGB">
						<feGaussianBlur in="SourceGraphic" stdDeviation={GOO_BLUR} />
						<feColorMatrix values={GOO_ALPHA_MATRIX} />
					</filter>
				</defs>
				<rect width={W} height={H} className="fill-background-surface" />
				<rect width={W} height={H} fill={`url(#dots-${id})`} />
				<ellipse cx={W / 2} cy={H / 2} rx={230} ry={150} fill={`url(#glow-${id})`} />
				{children}
			</svg>
		</GooFilter.Provider>
	);
};

/**
 * A drop travelling along `path` that melts into the cards it reaches and pulls free on the other side.
 * `targets` are the card outlines it passes through; they are drawn as solid blobs that the cards,
 * drawn on top afterwards, hide, so only the liquid necks between drop and card show.
 */
const LiquidTraveller = ({
	path,
	accent,
	seconds,
	targets,
}: {
	path: string;
	accent: string;
	seconds: number;
	targets: ReactNode;
}) => {
	const filterId = useContext(GooFilter);
	return (
		<g filter={`url(#${filterId})`} fill={accent}>
			{targets}
			<circle r={DROP_RADIUS} className="art-moving">
				<animateMotion path={path} dur={`${seconds}s`} repeatCount="indefinite" />
			</circle>
		</g>
	);
};

const Card = ({ x, y, w, h, rx = 8 }: { x: number; y: number; w: number; h: number; rx?: number }) => (
	<rect x={x} y={y} width={w} height={h} rx={rx} strokeWidth={1.5} className="fill-background-elevated stroke-border-subtle" />
);

/** Placeholder text lines inside a card. */
const Lines = ({ x, y, widths, gap = 7 }: { x: number; y: number; widths: number[]; gap?: number }) => (
	<>
		{widths.map((w, i) => (
			<rect key={i} x={x} y={y + i * gap} width={w} height={3} rx={1.5} className="fill-text-muted/30" />
		))}
	</>
);

/** Round badge with a check mark that pops in at `at` seconds into the loop. */
const CheckBadge = ({ cx, cy, r = 8, accent, at }: { cx: number; cy: number; r?: number; accent: string; at: number }) => (
	<g className="art-pop" style={delay(at)}>
		<circle cx={cx} cy={cy} r={r} fill={accent} />
		<path
			d={`M${cx - r * 0.45} ${cy} l${r * 0.3} ${r * 0.32} l${r * 0.55} -${r * 0.62}`}
			fill="none"
			stroke="white"
			strokeWidth={r * 0.28}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</g>
);

/** Dashed connector whose dashes flow toward the end of the path. */
const Flow = ({ d, accent }: { d: string; accent: string }) => (
	<path d={d} fill="none" stroke={accent} strokeOpacity={0.55} strokeWidth={2} strokeLinecap="round" className="art-flow" />
);

const Pill = ({ x, y, w, text, accent }: { x: number; y: number; w: number; text: string; accent: string }) => (
	<g>
		<rect x={x} y={y} width={w} height={24} rx={12} fill={accent} fillOpacity={0.14} stroke={accent} strokeOpacity={0.4} />
		<text x={x + w / 2} y={y + 16} textAnchor="middle" fill={accent} className="font-mono text-[11px] font-bold">
			{text}
		</text>
	</g>
);

const Person = ({ cx, cy, highlight }: { cx: number; cy: number; highlight?: string }) => (
	<g>
		<circle
			cx={cx}
			cy={cy}
			r={16}
			strokeWidth={2}
			className="fill-background-elevated stroke-border-subtle"
			style={highlight ? { stroke: highlight } : undefined}
		/>
		<circle cx={cx} cy={cy - 4} r={4.5} className="fill-text-muted" />
		<path
			d={`M${cx - 7} ${cy + 9} Q${cx} ${cy + 1} ${cx + 7} ${cy + 9}`}
			fill="none"
			strokeWidth={2.5}
			strokeLinecap="round"
			className="stroke-text-muted"
		/>
	</g>
);

const SalesArt = () => {
	const accent = "#3B82F6";
	const docs: { y: number; tag: string }[] = [
		{ y: 34, tag: "RG" },
		{ y: 92, tag: "CPF" },
		{ y: 150, tag: "CNH" },
	];
	return (
		<Scene accent={accent}>
			<Flow d="M86 52 C110 52 108 109 130 109" accent={accent} />
			<Flow d="M86 110 L130 110" accent={accent} />
			<Flow d="M86 168 C110 168 108 111 130 111" accent={accent} />
			<Flow d="M212 110 L246 110" accent={accent} />
			<Flow d="M296 110 L330 110" accent={accent} />
			<LiquidTraveller
				path="M55 110 L355 110"
				accent={accent}
				seconds={4}
				targets={
					<>
						<rect x={24} y={92} width={62} height={36} rx={8} />
						<rect x={130} y={92} width={82} height={36} rx={8} />
						<rect x={246} y={85} width={50} height={50} rx={12} />
						<rect x={330} y={70} width={50} height={80} rx={8} />
					</>
				}
			/>

			{docs.map(({ y, tag }, i) => (
				<g key={tag}>
					<Card x={24} y={y} w={62} h={36} />
					<text x={32} y={y + 14} className="fill-text-primary font-mono text-[9px] font-bold">
						{tag}
					</text>
					<Lines x={32} y={y + 20} widths={[42, 30]} />
					<CheckBadge cx={84} cy={y + 2} accent={accent} at={0.4 + i * 0.6} />
				</g>
			))}

			<Card x={130} y={92} w={82} h={36} />
			{[140, 162, 184].map((x, i) => (
				<rect key={x} x={x} y={101} width={16} height={18} rx={3} fill={accent} className="art-pop" style={delay(i * 0.5)} />
			))}
			<text x={171} y={142} textAnchor="middle" className="fill-text-muted font-mono text-[9px]">
				queue
			</text>

			<circle cx={271} cy={110} r={26} fill="none" stroke={accent} strokeWidth={2} className="art-pulse" />
			<rect x={246} y={85} width={50} height={50} rx={12} strokeWidth={2} stroke={accent} className="fill-background-elevated" />
			<path
				d="M271 96 Q273 108 285 110 Q273 112 271 124 Q269 112 257 110 Q269 108 271 96 Z"
				fill={accent}
				className="art-twinkle"
			/>
			<text x={271} y={150} textAnchor="middle" className="fill-text-muted font-mono text-[9px]">
				LLM
			</text>

			<Card x={330} y={70} w={50} h={80} />
			<Lines x={338} y={82} widths={[34, 26, 30]} />
			<CheckBadge cx={355} cy={128} r={11} accent={accent} at={2.4} />

			<Pill x={268} y={18} w={112} text="12h → 1h" accent={accent} />
		</Scene>
	);
};

const FreightArt = () => {
	const accent = "#F59E0B";
	const route = "M56 160 C90 120 110 84 150 80 S220 124 250 134 S322 76 348 62";
	const cities: Point[] = [
		[56, 160],
		[150, 80],
		[250, 134],
		[348, 62],
	];
	return (
		<Scene accent={accent}>
			{[
				"M-10 186 C80 166 120 206 200 176 S330 136 410 156",
				"M60 -10 C80 60 30 130 96 230",
				"M300 -10 C280 70 350 150 300 230",
			].map((d) => (
				<path key={d} d={d} fill="none" strokeWidth={7} strokeLinecap="round" className="stroke-text-muted/15" />
			))}

			<path d={route} fill="none" stroke={accent} strokeOpacity={0.25} strokeWidth={5} strokeLinecap="round" />
			<path d={route} pathLength={1} fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" className="art-draw" />

			{cities.map(([cx, cy], i) => (
				<g key={cx}>
					<circle cx={cx} cy={cy} r={6} fill="none" stroke={accent} strokeWidth={2} className="art-pulse" style={delay(i * 0.6)} />
					<circle cx={cx} cy={cy} r={6} strokeWidth={3} stroke={accent} className="fill-background-elevated" />
				</g>
			))}

			{[
				[112, 104],
				[300, 92],
			].map(([x, y]) => (
				<g key={x}>
					<rect x={x - 8} y={y - 8} width={16} height={16} rx={4} fill={accent} fillOpacity={0.18} />
					<text x={x} y={y + 4} textAnchor="middle" fill={accent} className="font-mono text-[10px] font-bold">
						$
					</text>
				</g>
			))}

			<g className="art-moving">
				<animateMotion path={route} dur="6s" repeatCount="indefinite" rotate="auto" />
				<rect x={-13} y={-7} width={16} height={12} rx={2} fill={accent} />
				<rect x={3} y={-4} width={9} height={9} rx={2} fill={accent} fillOpacity={0.75} />
				<circle cx={-7} cy={6} r={2.6} className="fill-text-primary" />
				<circle cx={7} cy={6} r={2.6} className="fill-text-primary" />
			</g>

			<Card x={16} y={14} w={146} h={42} />
			<text x={28} y={32} className="fill-text-primary font-mono text-[11px] font-bold">
				RT-0418
			</text>
			<text x={28} y={47} className="fill-text-muted font-mono text-[9px]">
				412 km · 3×
			</text>
			<text x={104} y={47} fill={accent} className="font-mono text-[9px] font-bold">
				ANTT ✓
			</text>
		</Scene>
	);
};

const PipelineArt = () => {
	const accent = "#22C55E";
	const stages = ["push", "test", "build", "deploy"];
	const xs = [60, 153, 246, 339];
	const line = `M${xs[0]} 104 L${xs[xs.length - 1]} 104`;
	return (
		<Scene accent={accent}>
			<path d={line} strokeWidth={4} strokeLinecap="round" className="stroke-border-subtle" />
			<path d={line} pathLength={1} stroke={accent} strokeWidth={4} strokeLinecap="round" className="art-draw" />
			<LiquidTraveller
				path={line}
				accent={accent}
				seconds={4.5}
				targets={xs.map((x) => (
					<circle key={x} cx={x} cy={104} r={20} />
				))}
			/>
			{stages.map((stage, i) => (
				<g key={stage}>
					<circle cx={xs[i]} cy={104} r={20} strokeWidth={2} className="fill-background-elevated stroke-border-subtle" />
					<text x={xs[i]} y={108} textAnchor="middle" className="fill-text-muted font-mono text-[11px] font-bold">
						{i + 1}
					</text>
					<CheckBadge cx={xs[i]} cy={104} r={20} accent={accent} at={0.3 + i * 0.9} />
					<text x={xs[i]} y={146} textAnchor="middle" className="fill-text-muted font-mono text-[10px]">
						{stage}
					</text>
				</g>
			))}
			<Pill x={128} y={24} w={144} text="✓ 99 tests · 0.33s" accent={accent} />
			<text x={W / 2} y={190} textAnchor="middle" className="fill-text-muted font-mono text-[10px]">
				main → fluig-prod
			</text>
		</Scene>
	);
};

const BAR_WIDTHS = [3, 1.5, 4, 2, 1.5, 3, 2, 4, 1.5, 2.5, 3, 1.5, 2, 4, 1.5, 3];
const BAR_GAP = 1.6;
/** Barcode bars laid side by side from x = 66. */
const BARCODE = BAR_WIDTHS.map((w, i) => ({
	w,
	x: 66 + BAR_WIDTHS.slice(0, i).reduce((sum, prev) => sum + prev + BAR_GAP, 0),
}));

const InventoryArt = () => {
	const accent = "#8B5CF6";
	const shelves = [74, 124, 174];
	const columns = [212, 250, 288, 326];
	return (
		<Scene accent={accent}>
			{shelves.map((y, row) => (
				<g key={y}>
					<path d={`M200 ${y} H384`} strokeWidth={3} strokeLinecap="round" className="stroke-border-subtle" />
					{columns.map((x, col) => (
						<g key={x}>
							<rect x={x} y={y - 30} width={30} height={28} rx={3} strokeWidth={1.5} className="fill-background-elevated stroke-border-subtle" />
							<path d={`M${x} ${y - 22} H${x + 30}`} strokeWidth={1.5} className="stroke-border-subtle" />
							<CheckBadge cx={x + 28} cy={y - 30} r={6} accent={accent} at={0.3 + (row * columns.length + col) * 0.32} />
						</g>
					))}
				</g>
			))}

			<Flow d="M144 104 C172 104 176 96 200 96" accent={accent} />

			<rect x={50} y={28} width={94} height={164} rx={16} strokeWidth={2} className="fill-background-elevated stroke-text-muted/50" />
			<rect x={58} y={44} width={78} height={132} rx={6} className="fill-background-surface" />
			<rect x={84} y={34} width={26} height={4} rx={2} className="fill-text-muted/40" />
			{BARCODE.map(({ x, w }) => (
				<rect key={x} x={x} y={78} width={w} height={44} className="fill-text-primary/70" />
			))}
			<rect x={60} y={76} width={74} height={2.5} rx={1} fill={accent} className="art-scan" style={{ "--scan": "46px" } as React.CSSProperties} />
			<text x={97} y={154} textAnchor="middle" fill={accent} className="font-mono text-[11px] font-bold">
				128 / 128
			</text>
		</Scene>
	);
};

const PurchasingArt = () => {
	const accent = "#14B8A6";
	const nodes: Point[] = [
		[50, 66],
		[130, 154],
		[210, 66],
		[290, 154],
		[358, 66],
	];
	const path = "M50 66 C90 66 90 154 130 154 S170 66 210 66 S250 154 290 154 S318 66 358 66";
	return (
		<Scene accent={accent}>
			<Flow d={path} accent={accent} />
			<LiquidTraveller
				path={path}
				accent={accent}
				seconds={6}
				targets={nodes.map(([cx, cy]) => (
					<rect key={cx} x={cx - 30} y={cy - 18} width={60} height={36} rx={8} />
				))}
			/>
			{nodes.map(([cx, cy], i) => (
				<g key={cx}>
					<Card x={cx - 30} y={cy - 18} w={60} h={36} />
					<text x={cx - 20} y={cy - 3} className="fill-text-primary font-mono text-[10px] font-bold">
						{String(i + 1).padStart(2, "0")}
					</text>
					<Lines x={cx - 20} y={cy + 4} widths={[38, 26]} />
					<rect
						x={cx - 30}
						y={cy - 18}
						width={60}
						height={36}
						rx={8}
						fill="none"
						stroke={accent}
						strokeWidth={2.5}
						className="art-pop"
						style={delay(i * 1)}
					/>
				</g>
			))}
			<Pill x={150} y={176} w={100} text="SLA ✓ ERP ✓" accent={accent} />
		</Scene>
	);
};

const VehicleSalesArt = () => {
	const accent = "#0EA5E9";
	const docs: Point[] = [
		[48, 30],
		[172, 14],
		[296, 30],
	];
	return (
		<Scene accent={accent}>
			{docs.map(([x, y]) => (
				<Flow key={x} d={`M200 98 L${x + 28} ${y + 42}`} accent={accent} />
			))}
			{docs.map(([x, y], i) => (
				<g key={x}>
					<Card x={x} y={y} w={56} h={42} />
					<Lines x={x + 8} y={y + 10} widths={[36, 28, 32, 20]} />
					<CheckBadge cx={x + 54} cy={y + 2} accent={accent} at={0.6 + i * 0.7} />
				</g>
			))}
			<circle cx={200} cy={98} r={16} fill="none" stroke={accent} strokeWidth={2} className="art-pulse" />
			<path d="M200 84 Q202 96 214 98 Q202 100 200 112 Q198 100 186 98 Q198 96 200 84 Z" fill={accent} className="art-twinkle" />

			<path
				d="M110 186 L110 176 Q110 166 122 164 L142 140 Q148 132 160 132 L238 132 Q250 132 258 140 L282 160 L302 164 Q312 166 312 176 L312 186 Z"
				strokeWidth={2}
				className="fill-background-elevated stroke-text-muted/60"
			/>
			<path d="M150 160 L162 142 L196 142 L196 160 Z" className="fill-background-surface" />
			<path d="M204 160 L204 142 L238 142 L258 160 Z" className="fill-background-surface" />
			{[150, 272].map((cx) => (
				<g key={cx}>
					<circle cx={cx} cy={188} r={14} className="fill-text-primary/80" />
					<circle cx={cx} cy={188} r={5} className="fill-background-surface" />
				</g>
			))}
			<Pill x={300} y={96} w={84} text="NF-e ✓" accent={accent} />
		</Scene>
	);
};

const HrArt = () => {
	const accent = "#F43F5E";
	const leaves: Point[] = [
		[80, 172],
		[160, 172],
		[240, 172],
	];
	const newHire: Point = [320, 172];
	const accessPath = "M200 56 V82 H280 V124 H320 V156";
	return (
		<Scene accent={accent}>
			<path d="M200 56 V82 H120 V89 M200 82 H280 V89" fill="none" strokeWidth={2} className="stroke-border-subtle" />
			<path d="M120 121 V138 H80 V156 M120 138 H160 V156 M280 121 V138 H240 V156" fill="none" strokeWidth={2} className="stroke-border-subtle" />
			<path d="M280 138 H320 V156" pathLength={1} fill="none" stroke={accent} strokeWidth={2.5} className="art-draw" />

			<Person cx={200} cy={40} />
			<Person cx={120} cy={105} />
			<Person cx={280} cy={105} />
			{leaves.map(([cx, cy]) => (
				<Person key={cx} cx={cx} cy={cy} />
			))}
			<g className="art-pop" style={delay(1.6)}>
				<Person cx={newHire[0]} cy={newHire[1]} highlight={accent} />
			</g>

			<g className="art-moving">
				<animateMotion path={accessPath} dur="4s" repeatCount="indefinite" />
				<circle r={8} fill={accent} />
				<circle cx={-2} cy={0} r={2.4} fill="none" stroke="white" strokeWidth={1.4} />
				<path d="M0.5 0 H5 M3.5 0 V2" stroke="white" strokeWidth={1.4} strokeLinecap="round" />
			</g>

			<Pill x={330} y={116} w={60} text="AD ✓" accent={accent} />
		</Scene>
	);
};

const PROJECT_ART: Record<ProjectArtId, ComponentType> = {
	sales: SalesArt,
	freight: FreightArt,
	pipeline: PipelineArt,
	inventory: InventoryArt,
	purchasing: PurchasingArt,
	vehicleSales: VehicleSalesArt,
	hr: HrArt,
};

const ProjectArt = ({ id }: { id: ProjectArtId }) => {
	const Art = PROJECT_ART[id];
	return <Art />;
};

export default ProjectArt;
