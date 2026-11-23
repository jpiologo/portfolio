import type React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Languages, Menu, MessageCircle, Moon, Sun, X } from "lucide-react";
import { useI18n } from "../i18n/context";
import { localizePath, rememberLanguage, stripLanguage } from "../i18n/routes";
import { useTheme } from "../lib/theme";
import { useIsDesktop } from "../lib/useMediaQuery";
import LocalLink from "./LocalLink";
import Logo from "./Logo";
import Modal from "./Modal";

const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const isDesktop = useIsDesktop();
	const { theme, toggleTheme } = useTheme();
	const t = useI18n();
	const { pathname, search } = useLocation();
	const otherLanguage = t.language === "pt" ? "en" : "pt";

	const headerButtonClass = `tap-target rounded-control border transition-colors ${
		isScrolled
			? "border-border-subtle text-text-muted hover:text-accent-secondary hover:border-accent-secondary"
			: "border-text-primary/20 text-text-primary hover:text-accent-secondary hover:border-accent-secondary"
	}`;

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Turning a tablet to landscape hides the menu button, so the drawer goes with it
	useEffect(() => {
		if (isDesktop) setIsMobileMenuOpen(false);
	}, [isDesktop]);

	const openMenu = () => {
		setIsMobileMenuOpen(true);
	};

	const closeMenu = () => {
		setIsMobileMenuOpen(false);
	};

	const navLinks = [
		{ href: "/#about", label: t.header.nav.about },
		{ href: "/#what-i-do", label: t.header.nav.whatIDo },
		{ href: "/#projects", label: t.header.nav.projects },
		{ href: "/#testimonials", label: t.header.nav.testimonials },
		{ href: "/#blog", label: t.header.nav.blog },
		{ href: "/#contact", label: t.header.nav.contact },
	];

	const mobileNavLinks = [{ href: "/", label: t.header.nav.home }, ...navLinks];
	const ThemeIcon = theme === "dark" ? Sun : Moon;

	return (
		<>
			<header
				className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,padding] duration-300 ${
					isScrolled ? "bg-background-elevated shadow-md py-4" : "bg-transparent py-4 md:py-6"
				}`}
			>
				<nav className="page-container">
					<div className="flex justify-between items-center">
						<LocalLink
							to="/"
							aria-label={t.common.homeLabel}
							className="text-text-primary hover:opacity-80 transition-opacity"
						>
							<Logo className="w-10 h-10" />
						</LocalLink>

						<div className="flex items-center gap-8">
							{/* Desktop Navigation */}
							<div className="hidden md:flex space-x-8">
								{navLinks.map((link) => (
									<NavLink key={link.href} href={link.href} isScrolled={isScrolled}>
										{link.label}
									</NavLink>
								))}
							</div>

							<div className="flex items-center gap-2">
								<Link
									to={{ pathname: localizePath(stripLanguage(pathname), otherLanguage), search }}
									onClick={() => rememberLanguage(otherLanguage)}
									hrefLang={otherLanguage}
									className={`flex items-center gap-1.5 px-3 py-2 ${headerButtonClass}`}
									aria-label={t.header.switchLanguage}
									title={t.header.switchLanguage}
								>
									<Languages size={16} />
									<span className="text-xs font-semibold leading-none">{t.header.otherLanguageCode}</span>
								</Link>
								<button
									type="button"
									onClick={toggleTheme}
									className={`p-2 ${headerButtonClass}`}
									aria-label={theme === "dark" ? t.header.switchToLight : t.header.switchToDark}
									title={theme === "dark" ? t.header.lightMode : t.header.darkMode}
								>
									<ThemeIcon size={18} />
								</button>

								{/* Mobile Menu Button (hidden on md+) */}
								<button
									type="button"
									onClick={openMenu}
									className={`tap-target md:hidden p-2 rounded-control transition-colors ${
										isScrolled
											? "text-text-muted hover:bg-background-surface"
											: "text-text-primary hover:bg-text-primary/10"
									}`}
									aria-label={t.header.toggleMenu}
									aria-haspopup="dialog"
									aria-expanded={isMobileMenuOpen}
								>
									<Menu size={24} />
								</button>
							</div>
						</div>
					</div>
				</nav>
			</header>

			{/* Mobile Navigation Drawer: slides in from the right, next to the menu button */}
			<Modal isOpen={isMobileMenuOpen} onClose={closeMenu} label={t.header.menu} variant="drawer">
				<div className="w-[300px] max-w-[85vw] bg-background-elevated border-l border-border-subtle shadow-2xl flex flex-col">
					<div className="px-5 py-4 flex justify-between items-center border-b border-border-subtle">
						<LocalLink
							to="/"
							onClick={closeMenu}
							aria-label={t.common.homeLabel}
							className="text-text-primary hover:opacity-80 transition-opacity"
						>
							<Logo className="w-10 h-10" />
						</LocalLink>
						<button
							type="button"
							onClick={closeMenu}
							className="tap-target p-2 text-text-muted hover:text-text-primary transition-colors rounded-control hover:bg-background-surface"
							aria-label={t.header.closeMenu}
						>
							<X size={24} />
						</button>
					</div>

					<nav className="flex-1 px-5 overflow-y-auto">
						<ul className="divide-y divide-border-subtle">
							{mobileNavLinks.map((link) => (
								<li key={link.href}>
									<LocalLink
										to={link.href}
										onClick={closeMenu}
										className="block py-4 text-sm font-medium text-text-primary hover:text-accent-secondary transition-colors"
									>
										{link.label}
									</LocalLink>
								</li>
							))}
						</ul>
					</nav>

					<div className="p-5 flex flex-col gap-3 border-t border-border-subtle">
						<LocalLink to="/#contact" onClick={closeMenu} className="btn-primary w-full">
							<MessageCircle className="w-5 h-5" />
							{t.header.talkToMe}
						</LocalLink>
						<button type="button" onClick={toggleTheme} className="btn-secondary w-full">
							<ThemeIcon className="w-5 h-5" />
							{t.header.changeTheme}
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

const NavLink = ({
	href,
	children,
	isScrolled,
}: { href: string; children: React.ReactNode; isScrolled: boolean }) => (
	<LocalLink
		to={href}
		className={`transition-colors duration-300 ${
			isScrolled
				? "text-text-muted hover:text-accent-secondary"
				: "text-text-primary hover:text-accent-secondary"
		}`}
	>
		{children}
	</LocalLink>
);

export default Header;
