import { useEffect, useRef } from "react";
import { FileDown } from "lucide-react";
import { Link } from "react-router-dom";
import { RESUMES } from "../lib/profile";
import { isExternalLink, SOCIAL_LINKS } from "../lib/socialLinks";
import { useInView } from "../lib/useInView";
import { useI18n } from "../i18n/context";
import Logo from "./Logo";

const IN_VIEW_THRESHOLD = 0.3;

const columnTitleClass = "text-sm font-semibold uppercase tracking-wider text-text-primary mb-3";
const columnLinkClass = "inline-flex items-center gap-2 text-sm hover:text-accent-secondary transition-colors";

/** Reports when it scrolls into view so the fixed social sidebar can hand its links over to the Social column. */
const Footer = ({ onInViewChange }: { onInViewChange: (isInView: boolean) => void }) => {
	const t = useI18n();
	const footerRef = useRef<HTMLElement>(null);
	const isInView = useInView(footerRef, IN_VIEW_THRESHOLD);

	useEffect(() => {
		onInViewChange(isInView);
	}, [isInView, onInViewChange]);

	return (
		<footer
			ref={footerRef}
			className="bg-background-surface/80 backdrop-blur-sm text-text-muted border-t border-border-subtle"
		>
			<div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex flex-col gap-3">
					<Link
						to="/"
						aria-label={t.common.homeLabel}
						className="w-fit text-text-primary hover:opacity-80 transition-opacity"
					>
						<Logo className="w-12 h-12" />
					</Link>
					<p className="text-sm">
						© {new Date().getFullYear()} João Piologo. {t.footer.rights}
					</p>
				</div>

				<div className="flex gap-16">
					<div
						className={`transition-all duration-500 delay-150 ease-out motion-reduce:transition-none ${
							isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
						}`}
					>
						<h3 className={columnTitleClass}>{t.footer.social}</h3>
						<ul className="flex flex-col gap-2">
							{SOCIAL_LINKS.map(({ id, label, href, icon: Icon }) => (
								<li key={id}>
									<a
										href={href}
										target={isExternalLink(href) ? "_blank" : undefined}
										rel="noopener noreferrer"
										className={columnLinkClass}
									>
										<Icon className="w-4 h-4" strokeWidth={1.75} />
										{label}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className={columnTitleClass}>{t.footer.downloads}</h3>
						<ul className="flex flex-col gap-2">
							{RESUMES.map(({ id, href }) => (
								<li key={id}>
									<a href={href} download className={columnLinkClass}>
										<FileDown className="w-4 h-4" />
										{t.footer.resumes[id]}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
