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

/** Position, in % of the portrait box, of a point on the ellipse. */
const orbitPosition = (angleDeg: number) => {
	const angle = (angleDeg * Math.PI) / 180;
	return {
		left: `${ORBIT.centerX + ORBIT.radiusX * Math.cos(angle)}%`,
		top: `${ORBIT.centerY - ORBIT.radiusY * Math.sin(angle)}%`,
	};
};

const ORBIT_ITEMS = [
	...LEFT_ICONS.map((Icon, i) => ({ Icon, angle: spread(LEFT_ICONS.length, ORBIT.leftArc)[i] })),
	...RIGHT_ICONS.map((Icon, i) => ({ Icon, angle: spread(RIGHT_ICONS.length, ORBIT.rightArc)[i] })),
];

/** `className` sizes and positions the portrait; the arc of icons scales with it. */
const HeroPortrait = ({ alt, className = "" }: { alt: string; className?: string }) => (
	<div className={`-rotate-3 ${className}`}>
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
			{ORBIT_ITEMS.map(({ Icon, angle }) => (
				<span
					key={angle}
					style={orbitPosition(angle)}
					className="absolute -translate-x-1/2 -translate-y-1/2 p-1.5 cursor-pointer text-text-muted/70 transition duration-300 hover:text-accent-secondary hover:scale-125"
				>
					<Icon className="w-5 h-5 md:w-7 md:h-7" strokeWidth={1.5} />
				</span>
			))}
		</div>
	</div>
);

export default HeroPortrait;
