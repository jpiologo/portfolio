import ProjectCard from "./ProjectCard";
import fokusImage from "../assets/Fokus.png";
import weatherImage from "../assets/weatherApp.png";
import vocalVaultImage from "../assets/vocalVault.png";
import caseCobra from "../assets/Home.png";
import cleanUp from "../assets/CleanUpHome.png";

const projects = [
	{
		title: "CleanUp",
		subtitle: "Full-Stack Architecture",
		description:
			"End-to-end service marketplace connecting homeowners with cleaning professionals — featuring real-time booking, role-based dashboards, and automated scheduling.",
		image: cleanUp,
		tags: ["Next.js", "Nest.js", "TypeScript", "PostgreSQL", "Prisma"],
		githubLink: "https://github.com/jpiologo/CleanUp---Frontend",
		details: {
			challenge:
				"Design and ship a production-grade service marketplace with separate user and admin workflows, real-time booking slots, and secure authentication — from database schema to deployed frontend.",
			solution:
				"Built a decoupled architecture with Next.js handling SSR and client interactions, and Nest.js providing a modular, decorator-based REST API. Prisma ORM mapped complex booking relationships to PostgreSQL, while JWT guards enforce role-based access across the platform.",
			techStack: [
				"TypeScript",
				"Next.js",
				"Nest.js",
				"PostgreSQL",
				"Prisma ORM",
				"TailwindCSS",
				"JWT Auth",
			],
			features: [
				"Role-based authentication (user / admin)",
				"Booking system with real-time availability",
				"Service management admin panel",
				"Responsive UI with TailwindCSS",
			],
		},
	},
	{
		title: "CaseCobra",
		subtitle: "E-Commerce SaaS",
		description:
			"Custom iPhone case designer with live preview, Stripe checkout, and automated order confirmation — deployed as a fully operational SaaS on Vercel.",
		image: caseCobra,
		tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
		demoLink: "https://casecobra-taupe.vercel.app/",
		githubLink: "https://github.com/jpiologo/CaseCobra",
		details: {
			challenge:
				"Build a consumer-facing SaaS product that lets users upload images, preview custom phone cases in real-time, and complete purchases through a secure payment flow — all within a visually polished experience.",
			solution:
				"Implemented an interactive case configurator with live 3D-style preview using Next.js. Integrated Stripe for PCI-compliant payments, Uploadthing for asset management, Kinde for authentication, and Resend for automated order confirmations. Deployed on Vercel with edge-optimized SSR.",
			techStack: [
				"TypeScript",
				"Next.js",
				"PostgreSQL",
				"Prisma ORM",
				"Stripe",
				"Kinde Auth",
				"Uploadthing",
				"Resend",
			],
			features: [
				"Live case preview with image upload",
				"Stripe payment integration",
				"Automated email confirmations via Resend",
				"Auth-protected checkout flow",
			],
		},
	},
	{
		title: "Task Management System",
		subtitle: "Productivity Tool",
		description:
			"Pomodoro-based task manager with persistent local storage — helping users structure focused work sessions and track progress without account friction.",
		image: fokusImage,
		tags: ["JavaScript", "Local Storage", "CRUD"],
		demoLink: "https://fokus-mu-eight.vercel.app/",
		githubLink: "https://github.com/jpiologo/fokusProject",
		details: {
			challenge:
				"Create a frictionless productivity tool that combines task management with the Pomodoro technique, storing all data client-side without requiring user accounts.",
			solution:
				"Built a lightweight CRUD system using vanilla JavaScript with localStorage persistence. The timer system automatically transitions between focus and break intervals, encouraging structured work sessions. Clean UI ensures zero learning curve.",
			techStack: ["JavaScript", "HTML5", "CSS3", "LocalStorage API"],
			features: [
				"Pomodoro timer with focus / break cycles",
				"CRUD task management with persistence",
				"Zero-dependency architecture",
				"Deployed on Vercel",
			],
		},
	},
	{
		title: "Weather Search App",
		subtitle: "API Integration",
		description:
			"Real-time weather dashboard consuming the OpenWeatherMap API — demonstrating clean API integration patterns and responsive data visualization.",
		image: weatherImage,
		tags: ["JavaScript", "REST API", "UX/UI"],
		demoLink: "https://weather-app-kappa-black.vercel.app/",
		githubLink: "https://github.com/jpiologo/weatherApp",
		details: {
			challenge:
				"Build a clean, responsive weather app that fetches real-time data from an external API and presents complex meteorological information in an intuitive, scannable layout.",
			solution:
				"Implemented async data fetching with proper error handling and loading states. The UI renders temperature, humidity, wind speed, and condition icons in a clear visual hierarchy. Input debouncing and city validation ensure a smooth search experience.",
			techStack: ["JavaScript", "OpenWeatherMap API", "REST", "JSON"],
			features: [
				"Real-time weather data by city",
				"Temperature, humidity, and wind display",
				"Error handling for invalid queries",
				"Responsive mobile-friendly layout",
			],
		},
	},
	{
		title: "Vocal Vault",
		subtitle: "Voice Interface",
		description:
			"Browser-based game controlled entirely by voice — exploring the Web Speech API to create accessible, hands-free user interactions.",
		image: vocalVaultImage,
		tags: ["JavaScript", "Speech API", "Frontend"],
		demoLink:
			"https://vocalvault-c5qkg3u7e-joao-piologos-projects.vercel.app/",
		githubLink: "https://github.com/jpiologo/voiceCommandApp",
		details: {
			challenge:
				"Explore the capabilities of browser-native speech recognition to create a fully voice-controlled interactive experience — pushing beyond traditional click-based interfaces.",
			solution:
				"Leveraged the webkitSpeechRecognition API to capture and parse voice input in real-time. Built a number-guessing game with clear voice feedback loops, demonstrating how speech interfaces can create engaging, accessible experiences without any manual input.",
			techStack: [
				"JavaScript",
				"Web Speech API",
				"HTML5",
				"CSS3",
			],
			features: [
				"Real-time voice command recognition",
				"Interactive number-guessing gameplay",
				"Audio feedback on user input",
				"Zero-dependency browser-native API",
			],
		},
	},
];

const Projects = () => {
	return (
		<>
			<section id="projects" className="py-16 bg-slate-50">
				<div className="max-w-6xl mx-auto px-4">
					<div className="text-center mb-14">
						<h2 className="text-4xl font-bold mb-3 text-slate-900 tracking-tight">
							Featured Projects
						</h2>
						<p className="text-slate-500 max-w-xl mx-auto text-lg">
							Real solutions that I built end-to-end — from architecture
							decisions to deployed products.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						{projects.map((project) => (
							<ProjectCard key={project.title} project={project} />
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default Projects;
