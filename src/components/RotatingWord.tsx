import { useEffect, useState } from "react";

const ROTATE_INTERVAL_MS = 2200;

type Rotation = { current: number; previous: number | null };

/**
 * Cycles through `words` like the faces of a cube turning upwards. Every word sits in the same grid
 * cell, so the box always fits the longest one and the line around it never jumps.
 * Decorative only: the caller provides the accessible text.
 */
const RotatingWord = ({ words, className = "" }: { words: string[]; className?: string }) => {
	const [rotation, setRotation] = useState<Rotation>({ current: 0, previous: null });

	useEffect(() => {
		setRotation({ current: 0, previous: null });
		const interval = setInterval(
			() => setRotation(({ current }) => ({ current: (current + 1) % words.length, previous: current })),
			ROTATE_INTERVAL_MS,
		);
		return () => clearInterval(interval);
	}, [words]);

	const faceClass = (index: number) => {
		if (index === rotation.current) return rotation.previous === null ? "" : "motion-safe:animate-cube-in";
		if (index === rotation.previous) return "invisible motion-safe:visible motion-safe:animate-cube-out";
		return "invisible";
	};

	return (
		<span aria-hidden="true" className={`inline-grid justify-items-start [perspective:600px] ${className}`}>
			{words.map((word, index) => (
				<span
					key={word}
					className={`col-start-1 row-start-1 [backface-visibility:hidden] [transform-origin:50%_50%_-0.55em] ${faceClass(index)}`}
				>
					{word}
				</span>
			))}
		</span>
	);
};

export default RotatingWord;
