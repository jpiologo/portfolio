import type React from "react";
import type { LucideIcon } from "lucide-react";
import {
	Braces,
	Bug,
	Coffee,
	Cpu,
	Database,
	GitBranch,
	Keyboard,
	Laptop,
	Lightbulb,
	Rocket,
	Star,
	Terminal,
} from "lucide-react";
import portrait from "../assets/joaoPiologo-cutout.webp";
import { useMediaQuery } from "../lib/useMediaQuery";

// Intrinsic size of the cutout, so the browser reserves its space before it loads
const PORTRAIT_WIDTH = 1000;
const PORTRAIT_HEIGHT = 905;

// Icons on each side of the head, listed from the shoulder up
const LEFT_ICONS: LucideIcon[] = [Coffee, Bug, Laptop, Braces, Star, Lightbulb];
const RIGHT_ICONS: LucideIcon[] = [Cpu, Database, GitBranch, Terminal, Rocket, Keyboard];

/*
 * The icons sit on an ellipse drawn around the head and shoulders, leaving the top of the head
 * free because the hero text overlaps it. Values are percentages of the portrait box; angles go
 * counter-clockwise from the right (0°), so 90° is straight above the head.
 * Tweak these to move the icons closer to or farther from the photo.
 */
const ORBIT = {
	centerX: 47,
	centerY: 76,
	radiusX: 56,
	radiusY: 74,
	/** Angle range of each side, from the shoulder up. */
	leftArc: { from: 172, to: 118 },
	rightArc: { from: 8, to: 56 },
};

/** Evenly spaced angles from `from` to `to` (inclusive). */
const spread = (count: number, { from, to }: { from: number; to: number }) =>
	Array.from({ length: count }, (_, i) => from + ((to - from) * i) / Math.max(count - 1, 1));

type Point = { x: number; y: number };

/** Point, in % of the portrait box, on the ellipse. */
const orbitPoint = (angleDeg: number): Point => {
	const angle = (angleDeg * Math.PI) / 180;
	return { x: ORBIT.centerX + ORBIT.radiusX * Math.cos(angle), y: ORBIT.centerY - ORBIT.radiusY * Math.sin(angle) };
};

/*
 * Phones: a neat ellipse looks stiff at that size, so the icons are scattered by hand around the
 * head (which spans roughly x 30–70%) and float. Same order as LEFT_ICONS / RIGHT_ICONS, in % of the
 * portrait box, kept inside it so they stay on screen.
 */
const LEFT_SCATTER: Point[] = [
	{ x: 9, y: 58 },
	{ x: 21, y: 45 },
	{ x: 7, y: 33 },
	{ x: 18, y: 21 },
	{ x: 10, y: 10 },
	{ x: 27, y: 4 },
];
const RIGHT_SCATTER: Point[] = [
	{ x: 91, y: 61 },
	{ x: 80, y: 48 },
	{ x: 93, y: 37 },
	{ x: 84, y: 25 },
	{ x: 91, y: 12 },
	{ x: 72, y: 3 },
];

/** Float loop lengths; each icon gets a different one and starts mid-loop, so they never move in sync. */
const FLOAT_DURATIONS_S = [5.2, 6.4, 4.6, 7, 5.8];
const FLOAT_STAGGER_S = 1.7;

const ICONS = [
	...LEFT_ICONS.map((Icon, i) => ({
		Icon,
		orbit: orbitPoint(spread(LEFT_ICONS.length, ORBIT.leftArc)[i]),
		scatter: LEFT_SCATTER[i],
	})),
	...RIGHT_ICONS.map((Icon, i) => ({
		Icon,
		orbit: orbitPoint(spread(RIGHT_ICONS.length, ORBIT.rightArc)[i]),
		scatter: RIGHT_SCATTER[i],
	})),
].map((icon, i) => ({
	...icon,
	floatDuration: FLOAT_DURATIONS_S[i % FLOAT_DURATIONS_S.length],
	floatDelay: -i * FLOAT_STAGGER_S,
}));

type OrbitIcon = (typeof ICONS)[number];

/** Both layouts go to CSS; the md breakpoint picks one, so nothing re-renders on resize. */
const positionStyle = ({ orbit, scatter }: OrbitIcon) =>
	({
		"--orbit-x": `${orbit.x}%`,
		"--orbit-y": `${orbit.y}%`,
		"--scatter-x": `${scatter.x}%`,
		"--scatter-y": `${scatter.y}%`,
		filter: `url(#${SKETCH_FILTER_ID})`,
	}) as React.CSSProperties;

const floatStyle = ({ floatDuration, floatDelay }: OrbitIcon): React.CSSProperties => ({
	animationDuration: `${floatDuration}s`,
	animationDelay: `${floatDelay}s`,
});

/*
 * Hand-drawn look for the icons: the clean lucide strokes are warped by noise twice, with different
 * seeds, and the two copies are overlaid, like a line traced over a couple of times with a pen.
 * Cycling the seeds makes the lines "boil" the way hand-drawn animation does.
 */
const SKETCH_FILTER_ID = "hero-sketch";
const SKETCH = {
	/** Noise detail: higher = tighter wobble. */
	baseFrequency: 0.07,
	/** How far, in px, each copy of the stroke drifts from the original. */
	mainStrokeWobblePx: 2,
	echoStrokeWobblePx: 3.2,
	/** Opacity of the second, fainter pass. */
	echoStrokeOpacity: 0.6,
	boilDurationMs: 900,
	mainSeeds: [1, 4, 8],
	echoSeeds: [13, 21, 34],
};

const BoilingNoise = ({ seeds, boil, result }: { seeds: number[]; boil: boolean; result: string }) => (
	<feTurbulence type="fractalNoise" baseFrequency={SKETCH.baseFrequency} numOctaves={2} seed={seeds[0]} result={result}>
		{boil && (
			<animate
				attributeName="seed"
				values={seeds.join(";")}
				dur={`${SKETCH.boilDurationMs}ms`}
				calcMode="discrete"
				repeatCount="indefinite"
			/>
		)}
	</feTurbulence>
);

const SketchFilter = ({ boil }: { boil: boolean }) => (
	<svg aria-hidden="true" width="0" height="0" className="absolute">
		<filter id={SKETCH_FILTER_ID} x="-25%" y="-25%" width="150%" height="150%">
			<BoilingNoise seeds={SKETCH.mainSeeds} boil={boil} result="mainNoise" />
			<feDisplacementMap in="SourceGraphic" in2="mainNoise" scale={SKETCH.mainStrokeWobblePx * 2} result="mainStroke" />
			<BoilingNoise seeds={SKETCH.echoSeeds} boil={boil} result="echoNoise" />
			<feDisplacementMap in="SourceGraphic" in2="echoNoise" scale={SKETCH.echoStrokeWobblePx * 2} result="echoWarped" />
			<feComponentTransfer in="echoWarped" result="echoStroke">
				<feFuncA type="linear" slope={SKETCH.echoStrokeOpacity} />
			</feComponentTransfer>
			<feMerge>
				<feMergeNode in="echoStroke" />
				<feMergeNode in="mainStroke" />
			</feMerge>
		</filter>
	</svg>
);

/** `className` sizes and positions the portrait; the arc of icons scales with it. */
const HeroPortrait = ({ alt, className = "" }: { alt: string; className?: string }) => {
	const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

	return (
		<div className={`-rotate-3 ${className}`}>
			<SketchFilter boil={!reducedMotion} />
			{/* The photo is cropped at the sides of the shoulders, so those edges fade out */}
			<img
				src={portrait}
				alt={alt}
				width={PORTRAIT_WIDTH}
				height={PORTRAIT_HEIGHT}
				className="w-full h-auto grayscale select-none pointer-events-none [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]"
			/>
			{/* Decorative icons around the head and shoulders */}
			<div aria-hidden="true">
				{ICONS.map((icon) => (
					<span
						key={`${icon.orbit.x},${icon.orbit.y}`}
						style={positionStyle(icon)}
						className="absolute left-[var(--scatter-x)] top-[var(--scatter-y)] md:left-[var(--orbit-x)] md:top-[var(--orbit-y)] -translate-x-1/2 -translate-y-1/2 p-1.5 cursor-pointer text-text-muted/70 transition duration-300 hover:text-accent-secondary hover:scale-125"
					>
						{/* Its own element, because the float animation would override the centering transform above */}
						<span style={floatStyle(icon)} className="block motion-safe:max-md:animate-float">
							<icon.Icon className="w-5 h-5 md:w-7 md:h-7" strokeWidth={1.5} />
						</span>
					</span>
				))}
			</div>
		</div>
	);
};

export default HeroPortrait;
