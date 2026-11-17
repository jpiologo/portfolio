import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "../i18n/context";
import { NO_FADE_ATTRIBUTE } from "../lib/useSectionFades";
import HeroIcons from "./HeroIcons";
import RotatingWord from "./RotatingWord";

const TYPING_INTERVAL_MS = 100;
const HERO_BUTTON_SIZE = "px-4 py-2.5 text-sm md:px-7 md:py-3 md:text-base";

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
	const renderTitle = (text: string) => {
		const plainPart = text.slice(0, titlePlain.length);
		const highlightPart = text.slice(titlePlain.length);
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

	// Insert cursor: solid while typing, blinks like a terminal once done
	const caret = (
		<span
			aria-hidden="true"
			className={`inline-block w-[4px] h-[1.1em] bg-text-primary ml-2 align-middle mb-1 md:mb-2 rounded-full ${
				isTypingDone ? "animate-caret-blink" : ""
			}`}
		></span>
	);

	return (
		<section
			{...{ [NO_FADE_ATTRIBUTE]: "" }}
			className="relative h-screen supports-[height:100svh]:h-[100svh] min-h-[560px] overflow-hidden text-text-primary flex flex-col"
		>
			<div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 pt-20 pb-12 flex flex-col justify-center items-center text-center font-display pointer-events-none">
				{/* The icons float around this box, so they follow the title and subtitle on every screen size */}
				<div className="relative flex flex-col items-center mb-5 md:mb-7">
					<HeroIcons />
					<h1 className="select-none font-display text-[clamp(2.25rem,11.5vw,3rem)] md:text-6xl xl:text-7xl font-extrabold mb-3 md:mb-4 leading-tight md:leading-tight tracking-tight">
						{/* The full title, invisible, holds its final size, so nothing around it moves while it's typed */}
						<span className="inline-grid">
							<span aria-hidden="true" className="invisible col-start-1 row-start-1">
								{renderTitle(textToType)}
								{caret}
							</span>
							<span className="col-start-1 row-start-1 md:text-left">
								{renderTitle(typedText)}
								{caret}
							</span>
						</span>
					</h1>
					{/* Wraps the rotating outcome onto its own line when both don't fit, as on phones, where it is centered */}
					<p className="select-none text-base md:text-xl text-text-muted leading-relaxed tracking-wide flex flex-wrap items-baseline justify-center gap-x-2">
						<span className="sr-only">{`${t.hero.subtitle} ${t.hero.outcomes.join(", ")}`}</span>
						<span aria-hidden="true">{t.hero.subtitle}</span>
						<RotatingWord words={t.hero.outcomes} className="font-signature text-accent-secondary max-md:justify-items-center" />
					</p>
				</div>
				{/* Smaller buttons on phones keep both on one row */}
				<div className="flex flex-wrap gap-3 md:gap-4 justify-center font-sans pointer-events-auto">
					<a
						href="#what-i-do"
						className={`btn-primary ${HERO_BUTTON_SIZE}`}
					>
						{t.hero.viewWork}
					</a>
					<a
						href="#contact"
						className={`btn-secondary ${HERO_BUTTON_SIZE}`}
					>
						{t.hero.getInTouch}
					</a>
				</div>
			</div>

			<div className="absolute z-10 bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-text-muted">
				<ArrowDown className="w-6 h-6" />
			</div>
		</section>
	);
};

export default Hero;
