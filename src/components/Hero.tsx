import type React from "react";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "../i18n/context";
import { PROCESSES_IN_PRODUCTION, yearsOfExperience } from "../lib/profile";
import CountUp from "./CountUp";
import HeroVisual from "./HeroVisual";
import RotatingWord from "./RotatingWord";

const TYPING_INTERVAL_MS = 100;
/** Gap between the hero blocks as they fade in on load. */
const ENTER_STAGGER_MS = 120;
/** Vehicle sales went from 10~12h to about 1h (see the salesAutomation project). */
const SALES_SPEEDUP = 10;

const enterDelay = (step: number) => ({ "--enter-delay": `${step * ENTER_STAGGER_MS}ms` }) as React.CSSProperties;

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

	// Insert cursor: solid while typing, blinks like a terminal once done
	const caret = (
		<span
			aria-hidden="true"
			className={`inline-block w-[4px] h-[1.1em] bg-text-primary ml-2 align-middle mb-1 md:mb-2 rounded-full ${
				isTypingDone ? "animate-caret-blink" : ""
			}`}
		></span>
	);

	// The highlighted part of the title keeps its gradient while it's being typed; the caret sticks to its last word
	const renderTitle = (text: string) => {
		const plainPart = text.slice(0, titlePlain.length);
		const highlightPart = text.slice(titlePlain.length);
		return (
			<>
				<span className="whitespace-pre-wrap">{plainPart}</span>
				{highlightPart ? (
					<span className="whitespace-nowrap">
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-200 py-1">
							{highlightPart}
						</span>
						{caret}
					</span>
				) : (
					caret
				)}
			</>
		);
	};

	const stats = [
		{ value: yearsOfExperience(), suffix: "+", label: t.hero.stats.years },
		{ value: PROCESSES_IN_PRODUCTION, suffix: "+", label: t.hero.stats.processes },
		{ value: SALES_SPEEDUP, suffix: "x", label: t.hero.stats.faster },
	];

	return (
		<section className="relative min-h-[100svh] overflow-hidden text-text-primary flex items-center pt-28 pb-24 lg:pt-24">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-48 -right-40 h-[640px] w-[640px] rounded-full bg-accent-secondary/10 blur-[120px]"
			/>

			<div className="relative z-10 w-full max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
				<div className="min-w-0 flex flex-col items-center text-center lg:items-start lg:text-left">
					{/* <span
						style={enterDelay(0)}
						className="hero-enter inline-flex items-center gap-2 rounded-full border border-border-subtle bg-background-elevated/80 px-4 py-1.5 text-xs font-semibold text-text-primary shadow-sm backdrop-blur"
					>
						<span className="relative flex h-2 w-2">
							<span className="absolute inline-flex h-full w-full rounded-full bg-accent-secondary opacity-75 motion-safe:animate-ping" />
							<span className="relative inline-flex h-2 w-2 rounded-full bg-accent-secondary" />
						</span>
						{t.hero.badge}
					</span> */}

					<p style={enterDelay(1)} className="hero-enter mt-6 text-base md:text-lg font-medium text-text-muted">
						{t.hero.greeting}
					</p>

					<h1 className="select-none font-display text-[clamp(2.25rem,11vw,3rem)] md:text-6xl lg:text-[3.5rem] xl:text-6xl font-extrabold mt-2 mb-4 leading-tight md:leading-tight tracking-tight">
						{/* The full title, invisible, holds its final size, so nothing around it moves while it's typed */}
						<span className="inline-grid">
							<span aria-hidden="true" className="invisible col-start-1 row-start-1">
								{renderTitle(textToType)}
							</span>
							<span className="col-start-1 row-start-1 lg:text-left">
								{renderTitle(typedText)}
							</span>
						</span>
					</h1>

					<p
						style={enterDelay(2)}
						className="hero-enter select-none text-lg md:text-xl text-text-muted leading-relaxed tracking-wide flex flex-wrap items-baseline justify-center lg:justify-start gap-x-2"
					>
						<span className="sr-only">{`${t.hero.subtitle} ${t.hero.outcomes.join(", ")}`}</span>
						<span aria-hidden="true">{t.hero.subtitle}</span>
						<RotatingWord words={t.hero.outcomes} className="font-signature text-accent-secondary max-lg:justify-items-center" />
					</p>

					<p style={enterDelay(3)} className="hero-enter mt-5 max-w-xl text-base md:text-lg font-light leading-relaxed text-text-muted">
						{t.hero.pitch}
					</p>

					<div style={enterDelay(4)} className="hero-enter mt-8 flex flex-wrap gap-3 md:gap-4 justify-center lg:justify-start">
						<a href="#projects" className="group btn-primary px-5 py-2.5 text-sm md:px-7 md:py-3 md:text-base">
							{t.hero.viewWork}
							<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
						</a>
						<a href="#contact" className="btn-secondary px-5 py-2.5 text-sm md:px-7 md:py-3 md:text-base">
							{t.hero.getInTouch}
						</a>
					</div>

					<dl
						style={enterDelay(5)}
						className="hero-enter mt-12 grid w-full max-w-lg grid-cols-3 gap-4 border-t border-border-subtle pt-8"
					>
						{stats.map(({ value, suffix, label }) => (
							<div key={label} className="flex flex-col gap-1">
								<dt className="order-2 text-xs md:text-sm text-text-muted leading-snug">{label}</dt>
								<dd className="order-1 flex justify-start font-heading text-3xl md:text-4xl font-bold text-text-primary">
									<CountUp to={value} suffix={suffix} />
								</dd>
							</div>
						))}
					</dl>
				</div>

				<HeroVisual className="hidden lg:block hero-enter [--enter-delay:300ms]" />
			</div>

			{/* Scroll hint: a mouse whose wheel keeps rolling down */}
			{/* <div aria-hidden="true" className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 hidden md:flex h-10 w-6 justify-center rounded-full border-2 border-text-muted/40 pt-2">
				<span className="h-2 w-1 rounded-full bg-text-muted/70 motion-safe:animate-scroll-wheel" />
			</div> */}
		</section>
	);
};

export default Hero;
