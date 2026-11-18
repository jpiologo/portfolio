import type React from "react";
import { type ReactNode, useEffect, useRef, useState } from "react";

const VISIBLE_SHARE = 0.15;
/** Starts the animation a little before the element reaches the bottom edge. */
const ROOT_MARGIN = "0px 0px -40px 0px";

/** Rises and fades its content in the first time it scrolls into view (styles: `.reveal` in index.css). */
const Reveal = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => {
	const ref = useRef<HTMLDivElement>(null);
	const [isRevealed, setIsRevealed] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				setIsRevealed(true);
				observer.disconnect();
			},
			{ threshold: VISIBLE_SHARE, rootMargin: ROOT_MARGIN },
		);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className={`reveal ${isRevealed ? "is-revealed" : ""} ${className}`}
			style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
		>
			{children}
		</div>
	);
};

export default Reveal;
