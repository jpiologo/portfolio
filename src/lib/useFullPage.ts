import { type RefObject, useEffect } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { useSectionFades } from "./useSectionFades";
import { useSectionSlides } from "./useSectionSlides";

/** Large screens only: on phones and tablets the page scrolls freely and sections keep their natural height. */
const FULL_PAGE_QUERY = "(min-width: 1024px) and (min-height: 600px)";

/** Set on <html> while full-page mode is on; Tailwind's `full-page:` variant and index.css key off it. */
const FULL_PAGE_ATTRIBUTE = "data-full-page";

/** Turns the container's sections into full-screen slides that fade into each other. */
export const useFullPage = (containerRef: RefObject<HTMLElement>) => {
	const isFullPage = useMediaQuery(FULL_PAGE_QUERY);

	useEffect(() => {
		const root = document.documentElement;
		root.toggleAttribute(FULL_PAGE_ATTRIBUTE, isFullPage);
		return () => root.removeAttribute(FULL_PAGE_ATTRIBUTE);
	}, [isFullPage]);

	useSectionSlides(containerRef, isFullPage);
	useSectionFades(containerRef, isFullPage);
};
