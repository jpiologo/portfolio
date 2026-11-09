import type React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Languages, Menu, Moon, Sun, X } from "lucide-react";
import { useI18n, useLanguageControl } from "../i18n/context";
import { useTheme } from "../lib/theme";
import Logo from "./Logo";

const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();
	const t = useI18n();
	const { language, chooseLanguage } = useLanguageControl();
	const otherLanguage = language === "pt" ? "en" : "pt";

	const headerButtonClass = `rounded-full border transition-colors ${
		isScrolled
			? "border-border-subtle text-text-muted hover:text-accent-secondary hover:border-accent-secondary"
			: "border-text-primary/20 text-text-primary hover:text-accent-secondary hover:border-accent-secondary"
	}`;

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Prevent scrolling when mobile menu is open
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isMobileMenuOpen]);

	const toggleMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMenu = () => {
		setIsMobileMenuOpen(false);
	};

	const navLinks = [
		{ href: "/#about", label: t.header.nav.about },
		{ href: "/#blog", label: t.header.nav.blog },
		{ href: "/#projects", label: t.header.nav.projects },
		{ href: "/#testimonials", label: t.header.nav.testimonials },
		{ href: "/#contact", label: t.header.nav.contact },
	];

	return (
		<>
			<header
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					isScrolled ? "bg-background-elevated shadow-md py-4" : "bg-transparent py-4 md:py-6"
				}`}
			>
				<nav className="max-w-7xl mx-auto px-4">
					<div className="flex justify-between items-center">
						{/* Mobile Menu Button  (hidden on md+) */}
						<button
							onClick={toggleMenu}
							className={`md:hidden p-2 rounded-lg transition-colors ${
								isScrolled
									? "text-text-muted hover:bg-background-surface"
									: "text-text-primary hover:bg-text-primary/10"
							}`}
							aria-label={t.header.toggleMenu}
						>
							<Menu size={24} />
						</button>

						<Link
							to="/"
							aria-label={t.common.homeLabel}
							className="text-text-primary hover:opacity-80 transition-opacity"
						>
							<Logo className="w-10 h-10" />
						</Link>

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
								<button
									type="button"
									onClick={() => chooseLanguage(otherLanguage)}
									className={`flex items-center gap-1.5 px-3 py-2 ${headerButtonClass}`}
									aria-label={t.header.switchLanguage}
									title={t.header.switchLanguage}
								>
									<Languages size={16} />
									<span className="text-xs font-semibold leading-none">{t.header.otherLanguageCode}</span>
								</button>
								<button
									type="button"
									onClick={toggleTheme}
									className={`p-2 ${headerButtonClass}`}
									aria-label={theme === "dark" ? t.header.switchToLight : t.header.switchToDark}
									title={theme === "dark" ? t.header.lightMode : t.header.darkMode}
								>
									{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
								</button>
							</div>
						</div>
					</div>
				</nav>
			</header>

			{/* Mobile Navigation Drawer Overlay */}
			{isMobileMenuOpen && (
				<div 
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden transition-opacity"
					onClick={closeMenu}
					aria-hidden="true"
				/>
			)}

			{/* Mobile Navigation Drawer Panel */}
			<div
				className={`fixed top-0 left-0 bottom-0 w-[280px] bg-background-elevated border-r border-border-subtle shadow-2xl z-50 md:hidden flex flex-col transition-transform duration-300 ease-in-out ${
					isMobileMenuOpen ? "translate-x-0 cursor-auto" : "-translate-x-full pointer-events-none"
				}`}
			>
				<div className="p-4 flex justify-between items-center border-b border-border-subtle">
					<span className="text-xl font-bold text-text-primary">{t.header.menu}</span>
					<button
						onClick={closeMenu}
						className="p-2 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-background-surface"
						aria-label={t.header.closeMenu}
					>
						<X size={24} />
					</button>
				</div>
				<div className="flex-1 py-6 px-4 flex flex-col gap-6 overflow-y-auto">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							to={link.href}
							onClick={closeMenu}
							className="text-text-muted hover:text-accent-secondary text-lg font-medium transition-colors"
						>
							{link.label}
						</Link>
					))}
				</div>
			</div>
		</>
	);
};

const NavLink = ({
	href,
	children,
	isScrolled,
}: { href: string; children: React.ReactNode; isScrolled: boolean }) => (
	<Link
		to={href}
		className={`transition-colors duration-300 ${
			isScrolled
				? "text-text-muted hover:text-accent-secondary"
				: "text-text-primary hover:text-accent-secondary"
		}`}
	>
		{children}
	</Link>
);

export default Header;
