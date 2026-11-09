import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useI18n } from "../i18n/context";

const TYPING_INTERVAL_MS = 100;

const Hero = () => {
	const t = useI18n();
	const { titlePlain, titleHighlight } = t.hero;
	const textToType = titlePlain + titleHighlight;
	const [typedText, setTypedText] = useState("");
	const [isTypingDone, setIsTypingDone] = useState(false);

	// Typing effect for the title; restarts when the language changes
	useEffect(() => {
		let i = 0;
		setIsTypingDone(false);
		const typingInterval = setInterval(() => {
			if (i < textToType.length) {
				setTypedText(textToType.slice(0, i + 1));
				i++;
			} else {
				clearInterval(typingInterval);
				setIsTypingDone(true);
			}
		}, TYPING_INTERVAL_MS);
		return () => clearInterval(typingInterval);
	}, [textToType]);

	// The highlighted part of the title keeps its gradient while it's being typed
	const renderTypedText = () => {
		const plainPart = typedText.slice(0, titlePlain.length);
		const highlightPart = typedText.slice(titlePlain.length);
		return (
			<>
				<span className="whitespace-pre-wrap">{plainPart}</span>
				{highlightPart && (
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-200 py-1">
						{highlightPart}
					</span>
				)}
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
						<span>{t.hero.subtitle}</span>
						<span className="ml-2 font-['Momo_Signature',cursive] text-accent-secondary">
							{t.hero.subtitleHighlight}
						</span>
					</p>
					<div className="flex flex-wrap gap-4 justify-center font-sans">
						<a
							href="#projects"
							className="btn-primary"
						>
							{t.hero.viewWork}
						</a>
						<a
							href="#contact"
							className="btn-secondary"
						>
							{t.hero.getInTouch}
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
