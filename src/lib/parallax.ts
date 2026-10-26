import type React from "react";

/*
 * Pointer handlers for `.parallax-card` (styles in index.css). They only write the
 * cursor position as CSS variables (--px / --py, from -0.5 to 0.5), so the tilt,
 * depth layers and glare are all done in CSS without re-rendering the card.
 * Touch and pen input are ignored: the effect is only meant for mouse hover.
 */
const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
	if (e.pointerType !== "mouse") return;
	const el = e.currentTarget;
	const rect = el.getBoundingClientRect();
	el.style.setProperty("--px", ((e.clientX - rect.left) / rect.width - 0.5).toFixed(3));
	el.style.setProperty("--py", ((e.clientY - rect.top) / rect.height - 0.5).toFixed(3));
};

const onPointerLeave = (e: React.PointerEvent<HTMLElement>) => {
	e.currentTarget.style.setProperty("--px", "0");
	e.currentTarget.style.setProperty("--py", "0");
};

export const parallaxHandlers = { onPointerMove, onPointerLeave };
