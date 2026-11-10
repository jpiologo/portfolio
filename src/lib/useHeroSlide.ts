import { type RefObject, useEffect } from "react";

/*
 * Makes a full-screen section behave like a slide: any scroll that would leave part of it on screen
 * is turned into one animated jump, either to the top of the page or to the start of the next section.
 * Only the section itself is affected; the rest of the page scrolls normally.
 */

const SLIDE_DURATION_MS = 750;
/** Extra time after a slide during which wheel events are swallowed, so trackpad inertia doesn't overshoot. */
const WHEEL_COOLDOWN_MS = 300;
/** Minimum finger travel for a swipe to trigger a slide. */
const SWIPE_THRESHOLD_PX = 30;
const LINE_HEIGHT_PX = 16;
const ARROW_STEP_PX = 40;

type Direction = 1 | -1;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const isTypingTarget = (target: EventTarget | null) =>
	target instanceof HTMLElement &&
	(target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/** Scroll distance a key press would cause, or null for keys that don't scroll vertically. */
const keyScrollDelta = (event: KeyboardEvent): number | null => {
	const page = window.innerHeight * 0.9;
	switch (event.key) {
		case "ArrowDown":
			return ARROW_STEP_PX;
		case "ArrowUp":
			return -ARROW_STEP_PX;
		case "PageDown":
			return page;
		case "PageUp":
			return -page;
		case " ":
			return event.shiftKey ? -page : page;
		default:
			return null;
	}
};

export const useHeroSlide = (sectionRef: RefObject<HTMLElement>) => {
	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;

		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		let animationFrame = 0;
		let busyUntil = 0;
		let touchLastY: number | null = null;
		let touchTravel = 0;
		let touchTarget: number | null = null;

		const sectionEnd = () => section.offsetTop + section.offsetHeight;

		/**
		 * Where to slide for a scroll of `delta` px from the current position, or null when that
		 * scroll doesn't involve the section and should happen natively.
		 */
		const slideTarget = (delta: number): number | null => {
			const y = window.scrollY;
			const end = sectionEnd();
			const direction: Direction = delta > 0 ? 1 : -1;
			if (direction === 1 && y < end - 1) return end;
			if (direction === -1 && y > 0 && y + delta < end) return 0;
			return null;
		};

		const scrollToInstantly = (top: number) => window.scrollTo({ top, behavior: "instant" as ScrollBehavior });

		const slideTo = (top: number) => {
			cancelAnimationFrame(animationFrame);
			const from = window.scrollY;
			if (reducedMotion.matches || from === top) {
				scrollToInstantly(top);
				busyUntil = performance.now() + WHEEL_COOLDOWN_MS;
				return;
			}
			const start = performance.now();
			busyUntil = start + SLIDE_DURATION_MS + WHEEL_COOLDOWN_MS;
			const step = (now: number) => {
				const progress = Math.min((now - start) / SLIDE_DURATION_MS, 1);
				scrollToInstantly(from + (top - from) * easeInOutCubic(progress));
				if (progress < 1) animationFrame = requestAnimationFrame(step);
			};
			animationFrame = requestAnimationFrame(step);
		};

		const isBusy = () => performance.now() < busyUntil;

		const onWheel = (event: WheelEvent) => {
			if (event.ctrlKey) return; // pinch-zoom
			if (isBusy()) {
				event.preventDefault();
				return;
			}
			const delta = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * LINE_HEIGHT_PX : event.deltaY;
			if (delta === 0) return;
			const target = slideTarget(delta);
			if (target === null) return;
			event.preventDefault();
			slideTo(target);
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.altKey || event.ctrlKey || event.metaKey || isTypingTarget(event.target)) return;
			const delta = keyScrollDelta(event);
			if (delta === null) return;
			const target = isBusy() ? null : slideTarget(delta);
			if (target === null && !isBusy()) return;
			event.preventDefault();
			if (target !== null) slideTo(target);
		};

		const onTouchStart = (event: TouchEvent) => {
			touchLastY = event.touches[0].clientY;
			touchTravel = 0;
			touchTarget = null;
		};

		const onTouchMove = (event: TouchEvent) => {
			if (touchLastY === null) return;
			const y = event.touches[0].clientY;
			const delta = touchLastY - y; // finger moving up scrolls down
			touchLastY = y;
			touchTravel += delta;
			if (isBusy()) {
				event.preventDefault();
				return;
			}
			if (touchTarget === null && delta !== 0) touchTarget = slideTarget(delta);
			if (touchTarget !== null) event.preventDefault();
		};

		const onTouchEnd = () => {
			if (touchTarget !== null && Math.abs(touchTravel) >= SWIPE_THRESHOLD_PX) slideTo(touchTarget);
			touchLastY = null;
			touchTarget = null;
		};

		// Fallback for scrolls we can't intercept (scrollbar drag, touch momentum): settle on the nearest edge
		const onScrollEnd = () => {
			if (isBusy()) return;
			const y = window.scrollY;
			const end = sectionEnd();
			if (y > 0 && y < end - 1) slideTo(y < end / 2 ? 0 : end);
		};

		window.addEventListener("wheel", onWheel, { passive: false });
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("touchstart", onTouchStart, { passive: true });
		window.addEventListener("touchmove", onTouchMove, { passive: false });
		window.addEventListener("touchend", onTouchEnd);
		window.addEventListener("scrollend", onScrollEnd);
		return () => {
			cancelAnimationFrame(animationFrame);
			window.removeEventListener("wheel", onWheel);
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("touchstart", onTouchStart);
			window.removeEventListener("touchmove", onTouchMove);
			window.removeEventListener("touchend", onTouchEnd);
			window.removeEventListener("scrollend", onScrollEnd);
		};
	}, [sectionRef]);
};
