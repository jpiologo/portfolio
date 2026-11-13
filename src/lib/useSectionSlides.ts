import { type RefObject, useEffect } from "react";
import { pageSections, pageTop } from "./pageSections";

/*
 * Makes each section of the container behave like a slide: any scroll is turned into one animated
 * jump to the start of the next or previous section (or to the very bottom of the page, where the
 * footer is).
 */

const SLIDE_DURATION_MS = 750;
/** Extra time after a slide during which wheel events are swallowed, so trackpad inertia doesn't overshoot. */
const WHEEL_COOLDOWN_MS = 300;
/** Minimum finger travel for a swipe to trigger a slide. */
const SWIPE_THRESHOLD_PX = 30;
const LINE_HEIGHT_PX = 16;
const ARROW_STEP_PX = 40;
/** Positions this close to each other count as the same. */
const SNAP_TOLERANCE_PX = 1;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Text fields take every key, buttons take Space. */
const handlesKeyItself = ({ target, key }: KeyboardEvent) => {
	if (!(target instanceof HTMLElement)) return false;
	if (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return true;
	return key === " " && target.closest("button, [role='button']") !== null;
};

/** Dialogs scroll on their own, and the page under them must stay put. */
const isInsideDialog = (target: EventTarget | null) =>
	target instanceof Element && target.closest('[aria-modal="true"]') !== null;

/** True when an element between `target` and the page can still scroll itself in the `delta` direction. */
const scrollsInside = (target: EventTarget | null, delta: number) => {
	for (let el = target instanceof Element ? target : null; el && el !== document.body; el = el.parentElement) {
		const { overflowY } = getComputedStyle(el);
		if (overflowY !== "auto" && overflowY !== "scroll") continue;
		const canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight - SNAP_TOLERANCE_PX;
		const canScrollUp = el.scrollTop > 0;
		if (delta > 0 ? canScrollDown : canScrollUp) return true;
	}
	return false;
};

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

export const useSectionSlides = (containerRef: RefObject<HTMLElement>, enabled: boolean) => {
	useEffect(() => {
		const container = containerRef.current;
		if (!enabled || !container) return;

		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		let animationFrame = 0;
		let busyUntil = 0;
		let touchLastY: number | null = null;
		let touchTravel = 0;
		let touchTarget: number | null = null;

		/** Where a slide can stop: the top of each section, then the bottom of the page. */
		const snapPoints = () => {
			const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
			const sectionTops = pageSections(container).map((section) => Math.min(pageTop(section), maxScroll));
			return [...sectionTops, maxScroll];
		};

		/** Where to slide for a scroll of `delta` px from the current position, or null when there's nowhere to go. */
		const slideTarget = (delta: number): number | null => {
			const y = window.scrollY;
			const points = snapPoints();
			const target =
				delta > 0
					? points.find((point) => point > y + SNAP_TOLERANCE_PX)
					: [...points].reverse().find((point) => point < y - SNAP_TOLERANCE_PX);
			return target ?? null;
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
			const delta = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * LINE_HEIGHT_PX : event.deltaY;
			if (delta === 0 || isInsideDialog(event.target) || scrollsInside(event.target, delta)) return;
			event.preventDefault();
			if (isBusy()) return;
			const target = slideTarget(delta);
			if (target !== null) slideTo(target);
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.altKey || event.ctrlKey || event.metaKey) return;
			if (handlesKeyItself(event) || isInsideDialog(event.target)) return;
			const delta = keyScrollDelta(event);
			if (delta === null) return;
			event.preventDefault();
			if (isBusy()) return;
			const target = slideTarget(delta);
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
			if (delta === 0 || isInsideDialog(event.target) || scrollsInside(event.target, delta)) return;
			event.preventDefault();
			if (!isBusy() && touchTarget === null) touchTarget = slideTarget(delta);
		};

		const onTouchEnd = () => {
			if (touchTarget !== null && Math.abs(touchTravel) >= SWIPE_THRESHOLD_PX) slideTo(touchTarget);
			touchLastY = null;
			touchTarget = null;
		};

		// Fallback for scrolls we can't intercept (scrollbar drag, anchor jumps, resizes): settle on the nearest snap point
		const settle = () => {
			if (isBusy()) return;
			const y = window.scrollY;
			const nearest = snapPoints().reduce((best, point) => (Math.abs(point - y) < Math.abs(best - y) ? point : best));
			if (Math.abs(nearest - y) > SNAP_TOLERANCE_PX) slideTo(nearest);
		};

		window.addEventListener("wheel", onWheel, { passive: false });
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("touchstart", onTouchStart, { passive: true });
		window.addEventListener("touchmove", onTouchMove, { passive: false });
		window.addEventListener("touchend", onTouchEnd);
		window.addEventListener("scrollend", settle);
		window.addEventListener("resize", settle);
		return () => {
			cancelAnimationFrame(animationFrame);
			window.removeEventListener("wheel", onWheel);
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("touchstart", onTouchStart);
			window.removeEventListener("touchmove", onTouchMove);
			window.removeEventListener("touchend", onTouchEnd);
			window.removeEventListener("scrollend", settle);
			window.removeEventListener("resize", settle);
		};
	}, [containerRef, enabled]);
};
