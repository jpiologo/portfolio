/** The full-screen sections of a page: the container's direct `section` children, top to bottom. */
export const pageSections = (container: HTMLElement) =>
	Array.from(container.querySelectorAll<HTMLElement>(":scope > section"));

/** Distance from the top of the document to the element. */
export const pageTop = (element: HTMLElement) => element.getBoundingClientRect().top + window.scrollY;
