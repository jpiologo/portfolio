import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False on the server and while hydrating its HTML, true from then on. */
export const useIsHydrated = () =>
	useSyncExternalStore(
		subscribe,
		() => true,
		() => false,
	);
