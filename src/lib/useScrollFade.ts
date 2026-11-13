import { type RefObject, useEffect } from "react";

/** Share of the element's height scrolled past at which it becomes fully transparent. */
const FADE_END_RATIO = 0.6;

/** Opacity for an element scrolled `scrolled` px past its top; eased so most of the fade happens early. */
const opacityAt = (scrolled: number, height: number) => {
	const progress = Math.min(Math.max(scrolled / (height * FADE_END_RATIO), 0), 1);
	return (1 - progress) ** 2;
};

/** Fades the element out while the page scrolls past it, and back in when scrolling up to it. */
export const useScrollFade = (ref: RefObject<HTMLElement>) => {
	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		let lastOpacity: number | null = null;
		const update = () => {
			const opacity = opacityAt(window.scrollY - element.offsetTop, element.offsetHeight);
			if (opacity === lastOpacity) return;
			lastOpacity = opacity;
			element.style.opacity = String(opacity);
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, [ref]);
};
