import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

const CODE_STYLES = [
	{ font: "font-mono font-bold", color: "text-green-400" },
	{ font: "font-serif italic", color: "text-amber-300" },
	{ font: "font-sans font-black", color: "text-pink-500" },
	{ font: "font-mono font-medium", color: "text-blue-400" },
];

const Hero = () => {
	const textToType = "Full Stack Developer";
	const [typedText, setTypedText] = useState("");
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
			}
		}, 100);
		return () => clearInterval(typingInterval);
	}, []);

	// Alternating style effect for "code"
	useEffect(() => {
		const styleInterval = setInterval(() => {
			setStyleIndex((prev) => (prev + 1) % CODE_STYLES.length);
		}, 800);
		return () => clearInterval(styleInterval);
	}, []);

	const currentStyle = CODE_STYLES[styleIndex];

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
				<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
					{devPart}
				</span>
			</>
		);
	};

	return (
		<section className="min-h-[110vh] relative bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
			{/* Background Overlays */}
			<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50" />

			{/* Hero Content */}
			<div className="relative max-w-6xl mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center min-h-[110vh] gap-8">
				{/* Text Section */}
				<div className="flex-1 text-center w-full max-w-4xl flex flex-col items-center justify-center">
					<h1 className="text-5xl md:text-7xl font-bold mb-6 min-h-[4rem] md:min-h-[5rem] flex items-center justify-center flex-wrap">
						{renderTypedText()}
						<span className="inline-block w-[4px] h-[3rem] md:h-[4.5rem] bg-white ml-2 animate-pulse mb-1 md:mb-2"></span>
					</h1>
					<p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
						The one you need to transform your ideas into{" "}
						<span className={`inline-block min-w-[3.5rem] ${currentStyle.font} ${currentStyle.color} transition-colors duration-300`}>
							code
						</span>
						.
					</p>
					<div className="flex flex-wrap gap-4 justify-center">
						<a
							href="#projects"
							className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all transform hover:scale-105"
						>
							View My Work
						</a>
						<a
							href="#contact"
							className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 rounded-lg font-semibold transition-all"
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
