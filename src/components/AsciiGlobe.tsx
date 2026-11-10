import { useEffect, useRef } from "react";
import { renderGlobeFrame, type GlobeSize } from "../lib/asciiGlobe";
import { buildLandMask, type LandMask } from "../lib/worldLand";
import { useInView } from "../lib/useInView";

const GLOBE_SIZE: GlobeSize = { cols: 64, rows: 37 };
/** Seconds for one full turn. */
const ROTATION_PERIOD_S = 24;
/** The text only changes visibly a dozen times a second, so there's no point redrawing more often. */
const FRAME_INTERVAL_MS = 80;
/** Longitude facing the viewer on the first frame: mid-Atlantic, with the Americas and Europe on either side. */
const START_LONGITUDE = -40;

// Built lazily on first use and shared between instances
let landMask: LandMask | null = null;
const getLandMask = () => (landMask ??= buildLandMask());

/** Decorative spinning Earth in ASCII. Pauses off-screen and stays still for reduced-motion users. */
const AsciiGlobe = ({ className = "" }: { className?: string }) => {
	const preRef = useRef<HTMLPreElement>(null);
	// Kept across pauses so the globe resumes where it stopped instead of jumping back
	const rotationRef = useRef(START_LONGITUDE);
	const isInView = useInView(preRef, 0);

	useEffect(() => {
		const pre = preRef.current;
		if (!pre) return;
		const mask = getLandMask();
		const draw = () => {
			pre.textContent = renderGlobeFrame(mask, rotationRef.current, GLOBE_SIZE);
		};

		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reducedMotion || !isInView) {
			if (!pre.textContent) draw();
			return;
		}

		let frame = 0;
		let lastDraw = performance.now();
		const tick = (now: number) => {
			const elapsedMs = now - lastDraw;
			if (elapsedMs >= FRAME_INTERVAL_MS) {
				lastDraw = now;
				// Earth turns west to east, so the longitude facing us decreases over time
				rotationRef.current -= (elapsedMs / 1000 / ROTATION_PERIOD_S) * 360;
				draw();
			}
			frame = requestAnimationFrame(tick);
		};
		draw();
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [isInView]);

	return (
		<pre
			ref={preRef}
			aria-hidden="true"
			className={`font-mono leading-none select-none text-text-primary ${className}`}
		/>
	);
};

export default AsciiGlobe;
