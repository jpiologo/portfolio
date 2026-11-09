import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useI18n } from "../i18n/context";

const SHOW_AFTER_PX = 600;

const BackToTop = () => {
	const t = useI18n();
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setIsVisible(window.scrollY > SHOW_AFTER_PX);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<button
			type="button"
			onClick={() => window.scrollTo({ top: 0 })}
			aria-label={t.common.backToTop}
			title={t.common.backToTop}
			tabIndex={isVisible ? 0 : -1}
			className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 p-3 rounded-full border border-border-subtle bg-background-elevated text-text-muted shadow-lg transition-all duration-300 hover:text-accent-secondary hover:border-accent-secondary hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-secondary/30 ${
				isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
			}`}
		>
			<ArrowUp className="w-5 h-5" />
		</button>
	);
};

export default BackToTop;
