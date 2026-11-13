import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "../i18n/context";
import { ALWAYS_FADE_ATTRIBUTE } from "../lib/useSectionFades";
import HeroPortrait from "./HeroPortrait";
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
			// Fades on phones too, so where the photo is cut at the chest never shows
			{...{ [ALWAYS_FADE_ATTRIBUTE]: "" }}
			className="relative h-screen supports-[height:100svh]:h-[100svh] min-h-[560px] overflow-hidden text-text-primary flex flex-col md:block"
		>
			{/* Hero Content, on top of the portrait; on phones it is centered in the space above the portrait */}
			<div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 pt-20 pb-4 md:pt-32 md:pb-0 flex flex-col justify-center md:justify-start items-center text-center font-display pointer-events-none">
				<div className="flex flex-col items-center mb-5 md:mb-7">
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
					<p className="select-none text-base md:text-xl text-text-muted leading-relaxed tracking-wide flex items-baseline justify-center">
						<span className="sr-only">{`${t.hero.subtitle} ${t.hero.verbs.join(", ")}`}</span>
						<span aria-hidden="true">{t.hero.subtitle}</span>
						<RotatingWord words={t.hero.verbs} className="ml-2 font-signature text-accent-secondary" />
					</p>
				</div>
				{/* Smaller buttons on phones keep both on one row */}
				<div className="flex flex-wrap gap-3 md:gap-4 justify-center font-sans pointer-events-auto">
					<a
						href="#projects"
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

			{/*
			  Phones: the portrait sits below the text and never overlaps it. It is as wide as the screen (its
			  icons are laid out inside it there, see HeroPortrait); on short screens this box gives up height
			  to the text and the portrait shrinks with it (cqh = % of its height).
			  md+: it spans the whole hero, anchored to the bottom, behind the text.
			*/}
			<div className="relative shrink min-h-0 [--portrait-w:100vw] h-[calc(var(--portrait-w)*0.85)] md:absolute md:inset-0 md:h-auto [container-type:size]">
				<HeroPortrait
					alt={t.hero.photoAlt}
					className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[6%] w-[min(var(--portrait-w),120cqh)] md:w-[min(108vw,64svh)]"
				/>
			</div>

			{/* Down Arrow: sits on the dark shirt, so it stays light in both themes */}
			<div className="absolute z-10 bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white/80 drop-shadow">
				<ArrowDown className="w-6 h-6" />
			</div>
		</section>
	);
};

export default Hero;
