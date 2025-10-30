import React from "react";
import ProjectCard from "./ProjectCard";
import fokusImage from "../assets/Fokus.png";
import weatherImage from "../assets/weatherApp.png";
import vocalVaultImage from "../assets/vocalVault.png";
import caseCobra from "../assets/Home.png";
import cleanUp from "../assets/CleanUpHome.png";

const projects = [
	{
		title: "CleanUp",
		description: "A fullstack web application for requesting and mange house cleaning services, built with Next.js and TypeScript.",
		image: cleanUp,
		tags: ['Typescript', 'Next.js', 'Nest.js', 'TailwindCSS', 'PostgreSQL', 'Prisma ORM'],
		githubLink: "https://github.com/jpiologo/CleanUp---Frontend",
		details: {
			challenge:
				"Develop a fullstack web application that allows users to request and manage house cleaning services, with a focus on user experience and service management.",
			solution:
				"I created a fullstack web application using Next.js for the frontend and Nest.js for the backend, both with TypeScript. I implemented a user-friendly interface with TailwindCSS, integrated PostgreSQL for data storage, and used Prisma ORM for database interactions. The application allows users to request cleaning services, manage their bookings, and provides an admin panel for service management.",
			techStack: [
				"Typescript",
				"Next.js",
				"Nest.js",
				"PostgreSQL",
				"Prisma ORM",
				"TailwindCSS",
				"JWT Authentication",
				"Decorators",
			],
			features: ["User Authentication", "Service Management", "Booking System"],
		}
	},
	{
		title: "CaseCobra",
		description: "An e-commerce SaaS for custom iPhone cases",
		image: caseCobra,
		tags: ["Typescript", "TailwindCSS", "Next.js", "PostgreSQL", "React.js"],
		demoLink: "https://casecobra-taupe.vercel.app/",
		githubLink: "https://github.com/jpiologo/CaseCobra",
		details: {
			challenge:
				"Code and deploy a fullstack SaaS platform enabling users to design personalized iPhone cases with a seamless, visually stunning UX/UI, and integrate secure, user-friendly payment gateways for a complete end-to-end experience.",
			solution:
				"I built a robust web application using Next.js with TypeScript, crafting an intuitive UI and establishing seamless service integrations. I implemented Stripe for secure payments, Neon for the database, Uploadthing for efficient storage, and Prisma as the ORM, among other tools. Subsequently, I connected all services and business logic, deployed the app on Vercel, and delivered a fully operational, visually appealing SaaS platform.",
			techStack: [
				"Typescript",
				"Prisma ORM",
				"Next.js",
				"PostgreSQL",
				"Kinde Auth",
				"Lucide Icons",
				"SSR",
				"TailwindCSS",
				"Resend Automatic E-mails",
			],
			features: ["Stripe Payments", "Uploadthing storage", "Kinde Auth"],
		},
	},
	{
		title: "Task Management System",
		description: "Personal task management applying the Pomodoro Technique",
		image: fokusImage,
		tags: ["JavaScript", "Local Storage", "CRUD"],
		demoLink: "https://fokus-mu-eight.vercel.app/",
		githubLink: "https://github.com/jpiologo/fokusProject",
		details: {
			challenge:
				"Create a task management system that stores information locally, based on the Pomodoro Technique.",
			solution:
				"Built a scalable Javascript system based on CRUD, allowing the user to organize tasks, focus and rest when the clock says to (Pomodoro).",
			techStack: ["JavaScript", "HTML5", "CSS3", "Git"],
			features: ["CRUD", "Web Development", "Javascript"],
		},
	},
	{
		title: "Weather Search App",
		description: "A simple weather search app using the OpenWeatherMap API.",
		image: weatherImage,
		tags: ["Javascript", "RESTful API", "UX/UI"],
		demoLink: "https://weather-app-kappa-black.vercel.app/",
		githubLink: "https://github.com/jpiologo/weatherApp",
		details: {
			challenge:
				"Create a user-friendly weather search app that fetches data from an API.",
			solution:
				"This project is a simple weather search app that fetches data from the OpenWeatherMap API and displays it in a user-friendly way. It allows the user to search for a city and view the current weather conditions, temperature, humidity, and wind speed.",
			techStack: ["Javascript", "UX/UI", "API Rest", "JSON"],
			features: [
				"User-friendly interface",
				"Weather search by city",
				"Current weather conditions",
				"Temperature, humidity, and wind speed",
			],
		},
	},
	{
		title: "Vocal Vault - Voice Command App",
		description:
			"A Guess The number game using voice commands with webkitSpeechRecognition.",
		image: vocalVaultImage,
		tags: ["Javascript", "Voice Recognition", "Frontend"],
		demoLink: "https://vocalvault-c5qkg3u7e-joao-piologos-projects.vercel.app/",
		githubLink: "https://github.com/jpiologo/voiceCommandApp",
		details: {
			challenge:
				"Create a voice command app that allows the user to play a game using voice commands.",
			solution:
				"This project is a simple voice command app that uses the webkitSpeechRecognition API to allow the user to play a Guess The Number game using voice commands. The user can say a number between 1 and 100, and the app will tell them if the number is too high, too low, or correct.",
			techStack: ["Javascript", "Libs"],
			features: [
				"Voice command recognition",
				"Guess The Number game",
				"User-friendly interface",
				"Feedback on the user's input",
			],
		},
	},
];

const Projects = () => {
	return (
		<section id="projects" className="py-20 bg-gray-50">
			<div className="max-w-6xl mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold mb-4 text-black-900">
						Featured Projects
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Here are some of my recent projects that showcase my technical
						skills and problem-solving abilities.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{projects.map((project, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<ProjectCard key={index} project={project} />
					))}
				</div>
			</div>
		</section>
	);
};

export default Projects;
