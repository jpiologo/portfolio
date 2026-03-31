import type React from "react";
import { useState, useEffect } from "react";

const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled ? "bg-white shadow-md py-4" : "bg-transparent py-6"
			}`}
		>
			<nav className="max-w-7xl mx-auto px-4">
				<div className="flex justify-between items-center">
					{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
					<a
						// biome-ignore lint/a11y/useValidAnchor: <explanation>
						href="#"
						className={`text-xl font-bold ${
							isScrolled ? "text-blue-600" : "text-white"
						}`}
					>
						João Piologo
					</a>
					<div className="hidden md:flex space-x-8">
						<NavLink href="#about" isScrolled={isScrolled}>
							About
						</NavLink>
						<NavLink href="#skills" isScrolled={isScrolled}>
							Skills
						</NavLink>
						<NavLink href="#projects" isScrolled={isScrolled}>
							Projects
						</NavLink>
						<NavLink href="#testimonials" isScrolled={isScrolled}>
							Testimonials
						</NavLink>
						<NavLink href="#contact" isScrolled={isScrolled}>
							Contact
						</NavLink>
					</div>
				</div>
			</nav>
		</header>
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
				? "text-slate-600 hover:text-blue-600"
				: "text-white hover:text-blue-200"
		}`}
	>
		{children}
	</a>
);

export default Header;
