import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useVisitorRegion } from "../lib/region";
import RegionFlag from "./RegionFlag";

const Hero = () => {
	const textToType = "Full Stack Developer;";
	const [typedText, setTypedText] = useState("");
	const [isTypingDone, setIsTypingDone] = useState(false);
	const region = useVisitorRegion();

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
		<section className="relative text-text-primary">
			{/* Hero Content */}
			<div className="relative w-full max-w-6xl mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center min-h-screen gap-8">
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
						<span className="ml-2 font-['Momo_Signature',cursive] text-accent-secondary">code</span>
						{/* Slot keeps its width while the country lookup runs, so the line never shifts */}
						<span
							className={`ml-3 inline-flex h-[0.85em] min-w-[1.6em] transition-opacity duration-500 ${
								region ? "opacity-100" : "opacity-0"
							}`}
						>
							{region && <RegionFlag region={region} />}
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
