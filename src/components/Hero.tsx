import { ArrowDown } from "lucide-react";
import johnyLogo from "../assets/johny-logo.png";

const Hero = () => {
	return (
		<section className="min-h-[110vh] relative bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 text-white">
			{/* Background Overlays */}
			<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50" />

			{/* Hero Content */}
			<div className="relative max-w-6xl mx-auto px-4 pt-32 pb-20 flex flex-col lg:flex-row items-center min-h-[110vh] gap-8">
				{/* Text Section */}
				<div className="flex-1 text-center lg:text-left">
					<h1 className="text-6xl md:text-7xl font-bold mb-6">
						Full Stack
						<span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
							Developer
						</span>
					</h1>
					<p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
						Transforming ideas into elegant solutions with modern technologies.{" "}
						<br />
						<br />
					</p>
					<div className="flex flex-wrap gap-4 justify-center lg:justify-start">
						<a
							href="#projects"
							className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-all transform hover:scale-105"
						>
							View My Work
						</a>
						<a
							href="#contact"
							className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-indigo-900 rounded-lg font-semibold transition-all"
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
