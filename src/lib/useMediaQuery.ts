import { useCallback, useSyncExternalStore } from "react";

/** Always false on the server, so the first render there is the phone layout with motion on. */
export const useMediaQuery = (query: string) => {
	const subscribe = useCallback(
		(onChange: () => void) => {
			const media = window.matchMedia(query);
			media.addEventListener("change", onChange);
			return () => media.removeEventListener("change", onChange);
		},
		[query],
	);

	return useSyncExternalStore(
		subscribe,
		() => window.matchMedia(query).matches,
		() => false,
	);
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const useReducedMotion = () => useMediaQuery(REDUCED_MOTION_QUERY);

/** One-off read for code outside React's render cycle. */
export const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

/** Tailwind's `md` breakpoint: the layout switches from phone to tablet/desktop here. */
export const DESKTOP_QUERY = "(min-width: 768px)";

export const useIsDesktop = () => useMediaQuery(DESKTOP_QUERY);

/** Tailwind's `lg` breakpoint. */
export const LARGE_QUERY = "(min-width: 1024px)";
