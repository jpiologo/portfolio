import type React from "react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
		{ href: "#about", label: "About" },
		{ href: "#skills", label: "Skills" },
		{ href: "#projects", label: "Projects" },
		{ href: "#testimonials", label: "Testimonials" },
		{ href: "#contact", label: "Contact" },
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
									: "text-white hover:bg-white/10"
							}`}
							aria-label="Toggle menu"
						>
							<Menu size={24} />
						</button>

						{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
						<a
							// biome-ignore lint/a11y/useValidAnchor: <explanation>
							href="#"
							className={`text-xl font-bold ${
								isScrolled ? "text-accent-secondary" : "text-white"
							}`}
						>
							João Piologo
						</a>

						{/* Desktop Navigation */}
						<div className="hidden md:flex space-x-8">
							{navLinks.map((link) => (
								<NavLink key={link.href} href={link.href} isScrolled={isScrolled}>
									{link.label}
								</NavLink>
							))}
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
					<span className="text-xl font-bold text-text-primary">Menu</span>
					<button
						onClick={closeMenu}
						className="p-2 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-background-surface"
						aria-label="Close menu"
					>
						<X size={24} />
					</button>
				</div>
				<div className="flex-1 py-6 px-4 flex flex-col gap-6 overflow-y-auto">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							onClick={closeMenu}
							className="text-text-muted hover:text-accent-secondary text-lg font-medium transition-colors"
						>
							{link.label}
						</a>
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
	<a
		href={href}
		className={`transition-colors duration-300 ${
			isScrolled
				? "text-text-muted hover:text-accent-secondary"
				: "text-white hover:text-accent-secondary"
		}`}
	>
		{children}
	</a>
);

export default Header;
