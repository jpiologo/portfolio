import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import fokusImage from "../assets/Fokus.png";
import weatherImage from "../assets/weatherApp.png";
import vocalVaultImage from "../assets/vocalVault.png";
import caseCobra from "../assets/Home.png";
import cleanUp from "../assets/CleanUpHome.png";
import fluigLogo from "../assets/fluig-logo.png";
import jenkinsLogo from "../assets/Jenkins.svg";

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
		title: "Inventory Count",
		subtitle: "Digitizing Inventory Operations with Fluig and Protheus",
		description:
			"The client faced low confidence in the accuracy of their inventory data, which represented millions of reais in stock value. The inventory process was entirely manual, carried out using pen and paper. After the supply department completed the count, hundreds of handwritten pages were sent to accounting, where the data was manually entered into the ERP system.",
		image: fluigLogo,
		tags: ["Fluig", "Workflow", "Inventory", "REST APIs", "Datasets", "Forms", "Microservices"],
		details: {
			challenge:
				"The main challenge was replacing a highly manual, paper-based inventory process with a digital workflow that employees could easily adopt, while ensuring seamless and reliable integration with the company’s TOTVS Protheus ERP. The solution also had to reduce errors, improve trust in inventory data, and eliminate the operational bottlenecks caused by manual handoffs between departments.",
			solution:
				"I developed a mobile process within the TOTVS Fluig platform, fully integrated with the company’s TOTVS Protheus ERP, allowing the supply department to perform inventory counts in a more reliable and fully integrated way. This eliminated the manual work previously required across departments.",
			techStack: [
				"JavaScript",
				"HTML5",
				"CSS3",
				"TOTVS Fluig",
				"TOTVS Protheus",
				"REST APIs",
				"Datasets",
				"Forms",
				"Microservices"
			],
			features: [
				"Mobile-friendly inventory counting workflow",
				"Integration with TOTVS Protheus ERP",
				"Digital data capture to replace paper-based counting",
				"Automated data flow between supply and accounting",
				"Reduced manual ERP data entry",
				"Improved reliability and traceability of inventory records"
			],
		},
	},
	{
		title: "Purchasing Flow",
		subtitle: "An End-to-End Procurement Workflow Integrated with TOTVS Protheus",
		description:
			"The project covered the company’s entire purchasing flow, including purchase requests, purchase orders, receiving checks, inbound invoice registration, and inventory classification. Each stage required structured approvals, defined deadlines, role-based responsibilities, and seamless communication between departments. The process also demanded full integration with TOTVS Protheus, along with robust error handling, integration logs, and fallback mechanisms to ensure operational continuity.",
		image: fluigLogo,
		tags: [
			"Fluig",
			"Workflow",
			"Procurement",
			"ERP Integration",
			"TOTVS Protheus",
			"REST APIs",
			"Datasets",
			"Forms",
			"Notifications"
		],
		details: {
			challenge:
				"The main challenge was designing and implementing a reliable end-to-end procurement workflow capable of supporting multiple business-critical stages, hierarchical approvals, strict deadlines, and role-based responsibilities. At the same time, the solution needed to ensure seamless integration with TOTVS Protheus, provide visibility into integration events through logs, and remain resilient through fallback strategies in case of communication or processing failures.",
			solution:
				"I designed and implemented a complete purchasing workflow within the TOTVS Fluig platform, fully integrated with TOTVS Protheus. The solution covered the full procurement lifecycle, from purchase requests to inventory classification, with customized forms for each stage, hierarchical approval flows, automated notifications, email alerts, user role assignment, integration logging, and fallback mechanisms to handle ERP integration errors safely and efficiently.",
			techStack: [
				"JavaScript",
				"HTML5",
				"CSS3",
				"TOTVS Fluig",
				"TOTVS Protheus",
				"REST APIs",
				"Datasets",
				"Forms",
				"Workflow Engine",
				"Email Notifications"
			],
			features: [
				"End-to-end procurement workflow",
				"Purchase request and purchase order management",
				"Receiving validation and inbound invoice process",
				"Inventory classification flow",
				"Hierarchical approval rules",
				"Role-based user assignment",
				"Custom forms for each workflow stage",
				"Personalized notifications and email alerts",
				"Full integration with TOTVS Protheus",
				"Integration logs for monitoring and traceability",
				"Fallback mechanisms for integration failures",
				"Defined deadlines and SLA-oriented process control"
			],
		},
	},
	{
		title: "Vehicle Sales Flow",
		subtitle: "An Intelligent Vehicle Billing Workflow with ERP and AI Integration",
		description:
			"I worked on a vehicle sales and billing workflow within the TOTVS Fluig platform for a large car dealership. The process included document validation at the time of purchase, direct ERP data consultation, decision gateways to route the workflow correctly, and sales automations that drastically reduced the time required to invoice a vehicle. By combining workflow intelligence, AI-based document analysis, and integration with regulatory entities, the solution made the sales process faster, more reliable, and operationally efficient.",
		image: fluigLogo,
		tags: [
			"Fluig",
			"Vehicle Sales",
			"Billing Workflow",
			"AI Integration",
			"ERP Integration",
			"Automation",
			"Decision Gateways",
			"Forms",
			"Regulatory Integration"
		],
		details: {
			challenge:
				"The main challenge was streamlining a complex vehicle sales and billing process involving document validation, ERP data consultation, regulatory requirements, and multiple decision points. The solution needed to reduce the time required to complete a sale, prevent invalid document submissions, and ensure that each transaction followed the correct business and compliance path with minimal manual effort.",
			solution:
				"I contributed to the implementation and evolution of a vehicle sales workflow within the TOTVS Fluig platform, focused on speed, reliability, and automation. The solution included AI integration for document analysis during the purchase process, direct consultation of company ERP data, decision gateways to determine the correct process path, and sales automations that enabled sellers to invoice vehicles in just a few minutes using only the essential information. The workflow also supported the necessary integrations with regulatory entities to keep the process compliant and operationally efficient.",
			techStack: [
				"JavaScript",
				"HTML5",
				"CSS3",
				"TOTVS Fluig",
				"ERP Integration",
				"AI Document Analysis",
				"REST APIs",
				"Datasets",
				"Forms",
				"Workflow Engine"
			],
			features: [
				"AI-powered document validation during vehicle purchase",
				"Direct ERP data consultation",
				"Decision gateways for dynamic workflow routing",
				"Vehicle billing automation",
				"Reduced sales completion time",
				"Prevention of invalid document submission",
				"Process guidance based on business rules",
				"Integration with regulatory entities",
				"Operational compliance support",
				"Streamlined seller experience with minimal manual input"
			],
		},
	},
	{
		title: "HR Workflows",
		subtitle: "Automating Employee Lifecycle Processes with Fluig, Protheus, and Active Directory",
		description:
			"I developed HR workflows within the TOTVS Fluig platform to support employee hiring and internal movement processes. The solution was deeply integrated with the company’s TOTVS Protheus ERP, using registered departments and hierarchy data to drive approval flows automatically. It also automated the provisioning and update of system and Active Directory access based on each employee’s role, ensuring faster onboarding, safer transitions, and consistent access control across the organization.",
		image: fluigLogo,
		tags: [
			"Fluig",
			"HR",
			"Workflow",
			"TOTVS Protheus",
			"Active Directory",
			"Access Management",
			"Automation",
			"Approvals",
			"ERP Integration"
		],
		details: {
			challenge:
				"The main challenge was building HR workflows capable of handling employee hiring and internal movement processes with speed, reliability, and governance. The solution needed to reflect the company’s organizational structure as defined in TOTVS Protheus, route approvals according to departments and hierarchies, and automate access provisioning and permission changes across systems and Active Directory based on each employee’s role and movement.",
			solution:
				"I designed and implemented HR workflows in the TOTVS Fluig platform to automate key employee lifecycle processes, including hiring and internal movement. The workflows were fully integrated with TOTVS Protheus to identify departments, hierarchies, and role data, enabling dynamic approval routing. In addition, the solution automated the creation of system and Active Directory accounts, populated access levels according to job position, and updated rights and permissions whenever an employee changed roles within the company.",
			techStack: [
				"JavaScript",
				"HTML5",
				"CSS3",
				"TOTVS Fluig",
				"TOTVS Protheus",
				"Active Directory",
				"REST APIs",
				"Datasets",
				"Forms",
				"Workflow Engine"
			],
			features: [
				"Employee hiring workflow",
				"Employee movement workflow",
				"Approval flows based on departments and hierarchies from TOTVS Protheus",
				"Automatic system access provisioning",
				"Automatic Active Directory account creation",
				"Role-based access level assignment",
				"Automatic permission updates based on employee movement",
				"Consistent access governance across systems",
				"Reduced manual onboarding effort",
				"Safer and faster employee transitions"
			],
		},
	},
	{
		title: "Fluig Deployment Pipeline",
		subtitle: "Automating Fluig Deployments with Jenkins and Branch-Based Delivery",
		description:
			"I developed an automated deployment pipeline using Jenkins to publish forms, datasets, workflows, and widgets to the Fluig platform. The pipeline monitored merges from predefined branches and triggered the deployment process automatically, reducing manual intervention and significantly accelerating delivery time. This brought more consistency, reliability, and speed to the release process across Fluig projects.",
		image: jenkinsLogo,
		tags: [
			"Jenkins",
			"CI/CD",
			"Fluig",
			"Automation",
			"Deployment",
			"Workflow",
			"Datasets",
			"Forms",
			"DevOps"
		],
		details: {
			challenge:
				"The main challenge was creating a reliable deployment pipeline capable of automatically identifying and publishing different Fluig artifacts, such as forms, datasets, workflows, and widgets, based on merges from specific branches. The solution needed to reduce deployment time, minimize manual errors, and make the release process more consistent and scalable.",
			solution:
				"I designed and implemented an automated Jenkins pipeline responsible for deploying Fluig artifacts whenever merges occurred on predefined branches. The pipeline handled the publication of forms, datasets, workflows, and widgets, making the delivery process faster, safer, and far less dependent on manual execution. As a result, deployment time was drastically reduced and the overall release flow became more efficient and standardized.",
			techStack: [
				"Jenkins",
				"Groovy",
				"Fluig",
				"CI/CD",
				"REST APIs",
				"Git",
				"Automation",
				"DevOps"
			],
			features: [
				"Automatic deployment triggered by branch merges",
				"Publication of Fluig forms",
				"Publication of datasets",
				"Publication of workflows",
				"Publication of widgets",
				"Reduced manual deployment effort",
				"Faster and more consistent release cycle",
				"Branch-based deployment strategy",
				"Improved reliability in delivery process",
				"Scalable CI/CD workflow for Fluig projects"
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
			techStack: ["JavaScript", "OpenWeatherMap API", "REST APIs", "JSON"],
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
	const [visibleCount, setVisibleCount] = useState(4);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.innerWidth < 768;
			setIsMobile(mobile);
			// Set initial visible count based on screen size on first load
			if (visibleCount === 4 && mobile) {
				setVisibleCount(2);
			}
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const visibleProjects = projects.slice(0, visibleCount);
	const increment = isMobile ? 2 : 4;

	return (
		<>
			<section id="projects" className="py-16 bg-slate-50">
				<div className="max-w-6xl mx-auto px-4">
					<div className="text-center mb-14">
						<h2 className="text-4xl font-bold mb-3 text-slate-900 tracking-tight">
							Featured Projects
						</h2>
						<p className="text-slate-500 max-w-xl mx-auto text-lg">
							Here you can find <b>just some</b> of the solutions that I've built end-to-end — from architecture decisions to deployed products.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						{visibleProjects.map((project) => (
							<ProjectCard key={project.title} project={project} />
						))}
					</div>

					{visibleCount < projects.length && (
						<div className="mt-14 text-center">
							<button
								onClick={() => setVisibleCount((prev) => prev + increment)}
								className="px-8 py-3 bg-white text-slate-800 font-semibold rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-400 hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1"
							>
								Load More Projects
							</button>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default Projects;
