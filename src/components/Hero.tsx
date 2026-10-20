import { ArrowDown } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";

/*
 * Looks the word "code" cycles through. `dark`/`light` are the text colors per theme
 * (light ones are darker shades so they keep contrast on the light hero).
 * Fonts are loaded from Google Fonts in index.html.
 */
const CODE_STYLES: {
	dark: string;
	light: string;
	glow: string;
	style: React.CSSProperties;
}[] = [
	{
		dark: "#60a5fa", light: "#1d4ed8", glow: "rgba(96,165,250,0.5)", // Blue
		style: { fontFamily: "'Fira Code', monospace", fontWeight: 700, letterSpacing: "-0.05em" },
	},
	{
		dark: "#a78bfa", light: "#6d28d9", glow: "rgba(167,139,250,0.5)", // Violet
		style: { fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontStyle: "italic" },
	},
	{
		dark: "#34d399", light: "#047857", glow: "rgba(52,211,153,0.5)", // Emerald
		style: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 },
	},
	{
		dark: "#f472b6", light: "#be185d", glow: "rgba(244,114,182,0.5)", // Pink
		style: { fontFamily: "'Pacifico', cursive", fontSize: "1.05em" },
	},
	{
		dark: "#fbbf24", light: "#b45309", glow: "rgba(251,191,36,0.5)", // Amber
		style: { fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.85em", textTransform: "uppercase", letterSpacing: "0.08em" },
	},
	{
		dark: "#a3e635", light: "#4d7c0f", glow: "rgba(163,230,53,0.5)", // Lime
		style: { fontFamily: "'Press Start 2P', monospace", fontSize: "0.6em" },
	},
	{
		dark: "#fb923c", light: "#c2410c", glow: "rgba(251,146,60,0.5)", // Orange
		style: { fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: "1.35em" },
	},
	{
		dark: "#22d3ee", light: "#0e7490", glow: "rgba(34,211,238,0.5)", // Cyan
		style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25em", textTransform: "uppercase", letterSpacing: "0.06em" },
	},
	{
		dark: "#f87171", light: "#b91c1c", glow: "rgba(248,113,113,0.6)", // Red neon
		style: { fontFamily: "'Monoton', cursive", fontSize: "0.95em" },
	},
];

const Hero = () => {
	const textToType = "Full Stack Developer;";
	const [typedText, setTypedText] = useState("");
	const [isTypingDone, setIsTypingDone] = useState(false);
	const [styleIndex, setStyleIndex] = useState(0);

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

	// Alternating style effect for "code"
	useEffect(() => {
		const styleInterval = setInterval(() => {
			setStyleIndex((prev) => (prev + 1) % CODE_STYLES.length);
		}, 2500);
		return () => clearInterval(styleInterval);
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
		<section className="min-h-[110vh] relative bg-gradient-to-br from-background-base via-[#EAF1FB] to-[#D3E3F8] dark:via-[#0E1A2E] dark:to-accent-primary text-text-primary">
			{/* Background Overlays */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-base" />

			{/* Hero Content */}
			<div className="relative max-w-6xl mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center min-h-[110vh] gap-8">
				{/* Text Section */}
				<div className="flex-1 text-center w-full max-w-4xl flex flex-col items-center justify-center">
					<h1 className="text-5xl md:text-7xl font-extrabold mb-8 min-h-[5rem] md:min-h-[6.5rem] leading-tight md:leading-tight tracking-tight">
						{renderTypedText()}
						{/* Insert cursor: solid while typing, blinks like a terminal once done */}
						<span
							aria-hidden="true"
							className={`inline-block w-[4px] h-[3.5rem] md:h-[5rem] bg-text-primary ml-2 align-middle mb-1 md:mb-2 rounded-full ${
								isTypingDone ? "animate-caret-blink" : ""
							}`}
						></span>
					</h1>
					<p className="text-xl md:text-2xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed font-light tracking-wide flex items-center justify-center flex-wrap">
						<span>Transforming ideas into</span>
						{/* Fixed-size slot so switching fonts never shifts the sentence */}
						<span className="relative inline-flex items-center w-[5rem] md:w-[6rem] h-[2.5rem] md:h-[3rem] ml-3">
							{CODE_STYLES.map((codeStyle, index) => (
								<span
									key={codeStyle.dark}
									aria-hidden={styleIndex !== index}
									className="absolute inset-0 flex items-center whitespace-nowrap pointer-events-none text-[color:var(--code-light)] dark:text-[color:var(--code-dark)] dark:[text-shadow:0_0_25px_var(--code-glow)]"
									style={
										{
											...codeStyle.style,
											"--code-dark": codeStyle.dark,
											"--code-light": codeStyle.light,
											"--code-glow": codeStyle.glow,
											opacity: styleIndex === index ? 1 : 0,
											transition: "opacity 1.2s ease-in-out",
										} as React.CSSProperties
									}
								>
									code
								</span>
							))}
						</span>
					</p>
					<div className="flex flex-wrap gap-4 justify-center">
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
