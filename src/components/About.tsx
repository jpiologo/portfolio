import React from "react";
import { Code2, Database, Server } from "lucide-react";
import { toWords } from "number-to-words";

const About = () => {

	const startYear = 2021;
	const currentYear = new Date();
	const years = Math.max(0, currentYear.getFullYear() - startYear);
	const yearsLabel = `${years}+`;
	const yearsText = toWords(years);

	return (
		<section id="about" className="py-20 bg-slate-50">
			<div className="max-w-6xl mx-auto px-4">
				<div className="grid md:grid-cols-2 gap-12 items-center">
					<div>
						<h2 className="text-4xl font-bold mb-6">About Me</h2>
						<div className="space-y-4">
							<p className="text-gray-600 leading-relaxed">
								With over {yearsText} years of hands-on experience in full-stack
								development and graduating in Software Engineering, I specialize
								in crafting scalable, high-performance applications using
								cutting-edge technologies.
							</p>
							<p className="text-gray-600 leading-relaxed">
								I thrive on tackling complex challenges and delivering
								innovative solutions that make a tangible impact. Whether it’s
								building responsive, user-focused interfaces or engineering efficient, server-side systems.
							</p>
						</div>

						<div className="mt-8 grid grid-cols-2 gap-4">
							<div className="text-center">
								<div className="text-3xl font-bold text-blue-600">{yearsLabel}</div>
								<div className="text-sm text-gray-600">Years of Experience</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-blue-600">50+</div>
								<div className="text-sm text-gray-600">Projects</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-4">
							<img
								src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&q=80&w=300"
								alt="Workspace"
								className="rounded-lg shadow-lg transform hover:scale-105 transition-transform"
							/>
							<img
								src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=300"
								alt="Coding"
								className="rounded-lg shadow-lg transform hover:scale-105 transition-transform"
							/>
						</div>
						<div className="space-y-4 mt-8">
							<img
								src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=300"
								alt="Setup"
								className="rounded-lg shadow-lg transform hover:scale-105 transition-transform"
							/>
							<img
								src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=300"
								alt="Code"
								className="rounded-lg shadow-lg transform hover:scale-105 transition-transform"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
