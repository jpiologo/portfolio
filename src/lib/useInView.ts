import { type RefObject, useEffect, useState } from "react";

export const useInView = (ref: RefObject<Element>, threshold: number) => {
	const [isInView, setIsInView] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold });
		observer.observe(element);
		return () => observer.disconnect();
	}, [ref, threshold]);

	return isInView;
};
