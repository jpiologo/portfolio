import { useEffect, useState } from "react";
import { useMediaQuery } from "../lib/useMediaQuery";

const DURATION_MS = 1600;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** Counts from 0 up to `to` once, on mount. Screen readers get the final value straight away. */
const CountUp = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
	const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
	const [value, setValue] = useState(0);

	useEffect(() => {
		if (reducedMotion) {
			setValue(to);
			return;
		}
		let frame = 0;
		const start = performance.now();
		const step = (now: number) => {
			const progress = Math.min((now - start) / DURATION_MS, 1);
			setValue(Math.round(to * easeOutCubic(progress)));
			if (progress < 1) frame = requestAnimationFrame(step);
		};
		frame = requestAnimationFrame(step);
		return () => cancelAnimationFrame(frame);
	}, [to, reducedMotion]);

	return (
		<>
			<span className="sr-only">{`${to}${suffix}`}</span>
			<span aria-hidden="true" className="tabular-nums">
				{value}
				{suffix}
			</span>
		</>
	);
};

export default CountUp;
