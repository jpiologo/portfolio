import { type RefObject, useEffect } from "react";
import { pageSections, pageTop } from "./pageSections";

/** Share of the viewport height a section can move away from its resting place before it is fully transparent. */
const FADE_END_RATIO = 0.6;

/** Sections marked with this attribute fade on every screen size, not only when `fadeAll` is on. */
export const ALWAYS_FADE_ATTRIBUTE = "data-always-fade";

/** Opacity for a section `distance` px away from its resting place; eased so most of the fade happens early. */
const opacityAt = (distance: number, viewportHeight: number) => {
	const progress = Math.min(distance / (viewportHeight * FADE_END_RATIO), 1);
	return (1 - progress) ** 2;
};

/**
 * Fades each section of the container out as the page scrolls away from it and back in as it returns.
 * The last section doesn't fade on its way out, since only the footer follows it.
 */
export const useSectionFades = (containerRef: RefObject<HTMLElement>, fadeAll: boolean) => {
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const sections = pageSections(container);
		const fading = sections.filter((section) => fadeAll || section.hasAttribute(ALWAYS_FADE_ATTRIBUTE));
		const lastSection = sections[sections.length - 1];

		const update = () => {
			const y = window.scrollY;
			for (const section of fading) {
				const top = pageTop(section);
				const distance = y < top ? top - y : section === lastSection ? 0 : y - top;
				section.style.opacity = String(opacityAt(distance, window.innerHeight));
			}
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
			for (const section of fading) section.style.opacity = "";
		};
	}, [containerRef, fadeAll]);
};
