import { ArrowDown } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";

/*
 * Fonts the word "code" cycles through. All are serifs, alternating roman/italic
 * and contrast so each swap is noticeable without jumping between unrelated styles.
 * They're independent of the site fonts (fonts.config.ts) and are loaded from
 * Google Fonts in index.html.
 */
const CODE_FONTS: React.CSSProperties[] = [
	{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontStyle: "italic" },
	{ fontFamily: "'DM Serif Display', serif" },
	{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontStyle: "italic", fontSize: "1.15em" },
	{ fontFamily: "'Bodoni Moda', serif", fontWeight: 700 },
	{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontStyle: "italic" },
	{ fontFamily: "'Abril Fatface', serif" },
	{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic", fontSize: "0.9em" },
];

const Hero = () => {
	const textToType = "Full Stack Developer;";
	const [typedText, setTypedText] = useState("");
	const [isTypingDone, setIsTypingDone] = useState(false);
	const [fontIndex, setFontIndex] = useState(0);

	// Typing effect for the title
	useEffect(() => {
		let i = 0;
		const typingInterval = setInterval(() => {
			if (i < textToType.length) {
				setTypedText(textToType.slice(0, i + 1));
				i++;
			} else {
				clearInterval(typingInterval);
				setIsTypingDone(true);
			}
		}, 100);
		return () => clearInterval(typingInterval);
	}, []);

	// Alternating font effect for "code"
	useEffect(() => {
		const fontInterval = setInterval(() => {
			setFontIndex((prev) => (prev + 1) % CODE_FONTS.length);
		}, 2500);
		return () => clearInterval(fontInterval);
	}, []);

	// Helper to retain the gradient on "Developer"
	const renderTypedText = () => {
		if (typedText.length <= 11) {
			return <span className="whitespace-pre-wrap">{typedText}</span>;
		}
		const firstPart = typedText.slice(0, 11);
		const devPart = typedText.slice(11);
		return (
			<>
				<span className="whitespace-pre-wrap">{firstPart}</span>
				<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-200 py-1">
					{devPart}
				</span>
			</>
		);
	};

	return (
		<section className="min-h-[110vh] relative bg-gradient-to-br from-background-base via-[#EEF2FB] to-[#DDE6F7] dark:via-[#0E1A2E] dark:to-accent-primary text-text-primary">
			{/* Lava lamp gradient: colors and motion live in index.css (.hero-lava) */}
			<div aria-hidden="true" className="hero-lava">
				<span />
				<span />
				<span />
				<span />
				<span />
			</div>

			{/* Background Overlays */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-base" />

			{/* Hero Content */}
			<div className="relative max-w-6xl mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center min-h-[110vh] gap-8">
				{/* Text Section */}
				<div className="flex-1 text-center w-full max-w-4xl flex flex-col items-center justify-center font-display">
					<h1 className="font-display text-5xl md:text-7xl font-extrabold mb-8 min-h-[5rem] md:min-h-[6.5rem] leading-tight md:leading-tight tracking-tight">
						{renderTypedText()}
						{/* Insert cursor: solid while typing, blinks like a terminal once done */}
						<span
							aria-hidden="true"
							className={`inline-block w-[4px] h-[3.5rem] md:h-[5rem] bg-text-primary ml-2 align-middle mb-1 md:mb-2 rounded-full ${
								isTypingDone ? "animate-caret-blink" : ""
							}`}
						></span>
					</h1>
					<p className="text-xl md:text-2xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed tracking-wide flex items-center justify-center flex-wrap">
						<span>Transforming ideas into</span>
						{/* Fixed-size slot so switching fonts never shifts the sentence */}
						<span className="relative inline-flex items-center w-[4.5rem] md:w-[5.5rem] h-[2.5rem] md:h-[3rem] ml-2 text-accent-secondary">
							{CODE_FONTS.map((font, index) => (
								<span
									key={String(font.fontFamily)}
									aria-hidden={fontIndex !== index}
									className="absolute inset-0 flex items-center whitespace-nowrap pointer-events-none"
									style={{
										...font,
										opacity: fontIndex === index ? 1 : 0,
										transition: "opacity 1.2s ease-in-out",
									}}
								>
									code
								</span>
							))}
						</span>
					</p>
					<div className="flex flex-wrap gap-4 justify-center font-sans">
						<a
							href="#projects"
							className="btn-primary"
						>
							View My Work
						</a>
						<a
							href="#contact"
							className="btn-secondary"
						>
							Get in Touch
						</a>
					</div>
				</div>
			</div>

			{/* Down Arrow */}
			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
				<ArrowDown className="w-6 h-6" />
			</div>
		</section>
	);
};

export default Hero;
