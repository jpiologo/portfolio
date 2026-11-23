import type { GenericTechId } from "../lib/techCatalog";
import type { Language } from "./language";

const NUMBER_WORDS = [
	"zero",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"eleven",
	"twelve",
	"thirteen",
	"fourteen",
	"fifteen",
	"sixteen",
	"seventeen",
	"eighteen",
	"nineteen",
	"twenty",
];

const toWords = (value: number) => NUMBER_WORDS[value] ?? String(value);

export const en = {
	language: "en" as Language,
	locale: "en-US",
	htmlLang: "en",

	common: {
		siteTitle: "João Piologo - Software Engineer",
		homeLabel: "João Piologo – home",
		minRead: (minutes: number) => `${minutes} min read`,
		close: "Close",
		skipToContent: "Skip to content",
		backToTop: "Back to top",
		copyCode: "Copy code",
		copy: "Copy",
		codeCopied: "Code copied",
		copied: "Copied!",
		carousel: {
			previous: "Previous",
			next: "Next",
			pageLabel: (page: number, names: string[]) => `Page ${page}: ${names.join(", ")}`,
			pageOf: (page: number, total: number) => `Page ${page} of ${total}`,
		},
	},

	header: {
		nav: {
			home: "Home",
			about: "About",
			whatIDo: "What I Do",
			blog: "Blog",
			projects: "Projects",
			testimonials: "Testimonials",
			contact: "Contact",
		},
		toggleMenu: "Toggle menu",
		menu: "Menu",
		closeMenu: "Close menu",
		talkToMe: "Talk to me",
		changeTheme: "Change theme",
		switchToLight: "Switch to light mode",
		switchToDark: "Switch to dark mode",
		lightMode: "Light mode",
		darkMode: "Dark mode",
		// Written in the target language, so a reader who doesn't understand the current page still finds it
		switchLanguage: "Mudar para português",
		otherLanguageCode: "PT",
	},

	hero: {
		titlePlain: "Software ",
		titleHighlight: "Engineer;",
		subtitle: "I build software that",
		outcomes: ["automates", "integrates", "scales", "delivers", "transforms"],
		viewWork: "View My Work",
		getInTouch: "Get in Touch",
		greeting: "Hi, I'm João Piologo",
		pitch:
			"Fluig workflows, microservices, ERP integrations for thousands of requests and whatever else your company might need.",
		stats: {
			years: "Years of experience",
			processes: "Deployed processes",
		},
		chips: {
			requests: { value: (thousands: number) => `${thousands}k+`, label: "requests processed in production" },
			tests: { label: "automated tests on every deploy" },
			integrations: { label: "integrated end to end" },
		},
	},

	about: {
		heading: "About Me",
		intro: (years: number) =>
			`Now, with over ${toWords(years)} years of hands-on experience in full-stack development and a degree in Software Engineering, I work as a B2B Consultant and Senior Engineer, drawing on a polyglot stack for web development, backend and CI/CD pipelines. I'm also a specialist in the TOTVS Fluig platform.`,
		story:
			"My journey in tech started as an apprentice, writing Excel VBA to automate manual processes, and I have loved solving problems ever since. That early passion led me to a degree in Software Engineering and a career architecting complex, scalable corporate solutions.",
		photoAlt: "João Piologo at Universo TOTVS 2026",
		photoCaption: "Universo TOTVS 2026, São Paulo - Brazil",
	},

	whatIDo: {
		heading: "What I Do",
		intro: "These are the areas I work in, from the first sketch of the architecture to keeping it healthy in production.",
		areas: {
			engineering: {
				title: "Software Engineering",
				description: "Backends, microservices and messaging. Architecture built to scale.",
			},
			web: {
				title: "Full-Stack Web Development",
				description: "From a weekend MVP to production, with React, Next.js and TypeScript. This site included.",
			},
			automation: {
				title: "Process Automation",
				description: "Workflows on TOTVS Fluig, integrated with Protheus and whatever else the business runs on.",
			},
			devops: {
				title: "DevOps & Observability",
				description: "CI/CD pipelines, cloud deploys and dashboards that show what is really happening in production.",
			},
			ai: {
				title: "Applied AI",
				description: "Integrating LLMs that validate documents and make decisions in real business flows, not in demos.",
			},
		},
		stackLabel: "Stack I work with",
		stackFilterLabel: "Filter by area",
		stackAll: "All",
		stackGroups: {
			languages: "Languages",
			frontend: "Frontend",
			backend: "Backend",
			data: "Data",
			cloud: "Cloud & Tools",
			totvs: "TOTVS",
		},
	},

	blog: {
		heading: "Blog",
		carouselLabel: "Latest posts",
		intro:
			"Notes, tutorials and lessons learned about software engineering, tooling and the technologies I work with every day.",
		viewAll: "View all posts",
		emptyTitle: "First post coming soon",
		emptyText: "I'm writing about the things I build and learn. Check back shortly!",
	},

	blogIndex: {
		documentTitle: "Blog | João Piologo",
		backHome: "Back to home",
		intro: "Every post I've written about software engineering and technology.",
		searchPlaceholder: "Search posts by title or content…",
		searchLabel: "Search posts",
		clearSearch: "Clear search",
		results: (count: number, query: string) => `${count} ${count === 1 ? "result" : "results"} for "${query}"`,
		noResultsTitle: "No posts found",
		noResultsText: "Try different keywords or clear the search to see every post.",
	},

	seo: {
		homeDescription:
			"João Piologo is a full stack software engineer. Projects, experience and blog posts about Fluig, CI/CD with Jenkins and web development.",
	},

	notFound: {
		documentTitle: "Page not found | João Piologo",
		title: "Page not found",
		text: "This page doesn't exist or was moved.",
		backHome: "Back to home",
	},

	blogPost: {
		notFoundDocumentTitle: "Post not found | João Piologo",
		notFoundTitle: "Post not found",
		notFoundText: "This post doesn't exist or was removed.",
		backToBlog: "Back to blog",
		allPosts: "All posts",
		nextPost: "Next post",
	},

	// Generic technologies; brand names (TypeScript, Jenkins...) live in src/lib/techCatalog.ts
	techNames: {
		restApi: "REST APIs",
		datasets: "Datasets",
		forms: "Forms",
		microservices: "Microservices",
		workflowEngine: "Workflow Engine",
		emailNotifications: "Email Notifications",
		erpIntegration: "ERP Integration",
		aiDocumentAnalysis: "AI Document Analysis",
		automation: "Automation",
		llm: "Large Language Models (LLM)",
	} satisfies Record<GenericTechId, string>,

	projects: {
		heading: "Featured Projects",
		introBefore: "Here you can find ",
		introBold: "just some",
		introAfter: " of the solutions that I've built end to end, from architecture decisions to deployed products.",
		quote: "Everything you can imagine is real.",
		quoteAuthor: "Pablo Picasso",
		carouselLabel: "Featured projects",
		inDevelopment: "In Development",
		studyProject: "Study project",
		allProjects: "All projects",
		nextProject: "Next project",
		viewCaseStudy: "View Case Study",
		challenge: "The Challenge",
		solution: "The Solution",
		techStack: "Tech Stack",
		deliverables: "Key Deliverables",
		liveDemo: "Live Demo",
		viewSource: "View Source",
		items: {
			salesAutomation: {
				title: "End-to-End Sales Automation",
				subtitle: "Event-Driven Microservices with LLM Document Validation",
				description:
					"End-to-end automation of the sales process, from document validation to invoice issuance. .NET Core microservices, RabbitMQ queues and an internal LLM replaced manual checks and cut each sale from 10–12 hours to about 1 hour.",
				details: {
					challenge:
						"Every sale required the customer's documents, stored in different formats (ID card, CPF, proofs, etc.), to be checked by hand before the invoice could be issued, followed by stock, warehouse, branch and transit checks. Each sale took 10 to 12 hours, depended on people being available, and had to stay reliable as volume grew.",
					solution:
						"Documents sent by customers were stored in a GCP bucket. With the generated ID and path, a .NET Core microservice published the information to a RabbitMQ queue, consumed by an internal LLM that validated each document against the defined rules. Once every document was approved, the sale moved to another queue that orchestrated the next steps: invoice issuance and stock, branch and transit validations, all observed through Grafana. I worked on every stage, from building the microservices and integrating the queues to coordinating the team, often making the architectural decisions. It's one of the projects I'm proudest of.",
					features: [
						"Sales cycle cut from 10–12 hours to about 1 hour",
						"LLM validation of PDFs and images against business rules",
						"Document storage in a Google Cloud bucket",
						".NET Core microservices publishing to RabbitMQ",
						"Queue-orchestrated invoicing with stock, branch and transit checks",
						"End-to-end observability with Grafana",
						"Architectural decisions and team coordination",
					],
				},
			},
			freightRouting: {
				title: "Freight Routing",
				subtitle: "Consolidating vehicle shipments into routes under Brazil's minimum freight rate",
				description:
					"When Brazil's transport agency (ANTT) changed the minimum freight rate, shipping one vehicle at a time between cities became expensive and non-compliant. I built a Fluig panel where the logistics team groups several requests into a single route, sees distance and tolls calculated on the spot, gets carriers sorted from cheapest to most expensive and, in one click, sends every request in the route to finance already filled in. More than 2,300 requests went through routing in the first two months in production.",
				details: {
					challenge:
						"Intercity freight requests moved on their own, with no consolidation at all. Under the new ANTT rule, every route had to be built, priced and validated before payment within 48 hours, without taking the team out of Fluig or retyping data across dozens of requests.",
					solution:
						"I added an \"Awaiting Routing\" step to the process, which same-city shipments skip automatically. In the panel, the router picks pending requests and builds the route: distance, tolls and freight table come from the NDD Cargo API, and carrier quotes come from a .NET endpoint, already sorted by price and checked against the minimum rate. The route is stored in a .NET microservice backed by MongoDB, and an integration with the Fluig API moves every request at once, writing the route data into each form. The code is covered by 99 automated tests that run in about 330 ms and became the team's reference.",
					features: [
						"More than 2,300 requests routed in the first two months in production",
						"Routing step with a 48h SLA and automatic bypass for same-city shipments",
						"Distance, tolls and freight table calculated by the NDD Cargo API",
						"Carriers listed from cheapest to most expensive",
						"Freight value validated against the ANTT minimum rate",
						"One click moves every request in the route, already filled in",
						"Route history, comments, attachments and cancellation locked once finance takes over",
						".NET microservice with MongoDB, pagination and search by route or request",
						"99 automated tests, XSS protection and automatic token renewal",
					],
				},
			},
			cleanUp: {
				title: "CleanUp",
				subtitle: "Full-Stack Architecture",
				description:
					"End-to-end service marketplace connecting homeowners with cleaning professionals, with real-time booking, role-based dashboards, and automated scheduling.",
				details: {
					challenge:
						"Design a service marketplace with separate user and admin workflows, real-time booking slots, and secure authentication, from database schema to frontend.",
					solution:
						"Built a decoupled architecture with Next.js handling SSR and client interactions, and Nest.js providing a modular, decorator-based REST API. Prisma ORM mapped complex booking relationships to PostgreSQL, while JWT guards enforce role-based access across the platform.",
					features: [
						"Role-based authentication (user / admin)",
						"Booking system with real-time availability",
						"Service management admin panel",
						"Responsive UI with TailwindCSS",
					],
				},
			},
			caseCobra: {
				title: "CaseCobra",
				subtitle: "E-Commerce",
				description:
					"Custom iPhone case designer with live preview, Stripe checkout, and automated order confirmation. Deployed on Vercel.",
				details: {
					challenge:
						"Build a store that lets users upload images, preview custom phone cases in real-time, and complete purchases through a secure payment flow.",
					solution:
						"Implemented an interactive case configurator with live 3D-style preview using Next.js. Integrated Stripe for PCI-compliant payments, Uploadthing for asset management, Kinde for authentication, and Resend for automated order confirmations. Deployed on Vercel with edge-optimized SSR.",
					features: [
						"Live case preview with image upload",
						"Stripe payment integration",
						"Automated email confirmations via Resend",
						"Auth-protected checkout flow",
					],
				},
			},
			realtimeChat: {
				title: "Private Chat",
				subtitle: "Realtime Self-Destructing Rooms",
				description:
					"Anonymous, two-person chat rooms that live for 10 minutes and can be destroyed on demand. Messages are delivered in real time and wiped from the server when the room ends.",
				details: {
					challenge:
						"Build a private chat with no sign-up where only two people can join a room, messages arrive instantly, and nothing is left behind once the room expires or is destroyed, all running on serverless infrastructure without a long-lived WebSocket server.",
					solution:
						"Built on Next.js with an Elysia API mounted in a catch-all route and consumed through Eden's end-to-end typed client. Room metadata and messages live in Upstash Redis with a shared TTL, while Upstash Realtime pushes new messages and destroy events to both participants. A Next.js proxy issues an httpOnly token per participant and caps each room at two, and Zod validates every request and event.",
					features: [
						"Rooms limited to two participants with httpOnly token access",
						"Real-time messaging via Upstash Realtime",
						"10-minute auto-expiry with live countdown",
						"One-click destroy that wipes all messages for both users",
						"Anonymous generated identities, no sign-up",
					],
				},
			},
			playoffsSimulator: {
				title: "4-0",
				subtitle: "NBA Legends Playoffs Simulator",
				description:
					"Browser game where you build a team from 184 NBA legends, simulate an 82-game season against 36 historic squads and fight through four best-of-seven playoff rounds for the title.",
				details: {
					challenge:
						"Design a replayable sports simulation that feels fair and readable: hundreds of tunable numbers had to produce realistic records, box scores and upsets, and a run had to survive a page refresh without letting the player re-roll their luck.",
					solution:
						"Wrote the game engine as pure TypeScript reducers driven by a seeded, serializable RNG, so every action resumes from the saved cursor and refreshing never changes the outcome. All balance constants live in a single module, checked by a script that plays hundreds of automated runs, and the engine is covered by Vitest tests. The run is persisted with Zustand and validated with Zod schemas plus versioned migrations, so corrupted or old saves never crash the app. Motion drives the slot-machine draws and live play-by-play.",
					features: [
						"Two modes: draft five real legends, or build a \"Frankenstein\" star inheriting one attribute from each drawn legend",
						"Normal and Almanac difficulties (Almanac hides player ratings)",
						"82-game season with seeding, then best-of-seven playoff series with live play-by-play",
						"Buff and debuff cards after every playoff game, plus in-game events and injuries",
						"S–F run grade with Wordle-style shareable result",
					],
				},
			},
			inventoryCount: {
				title: "Inventory Count",
				subtitle: "Digitizing Inventory Operations with Fluig and Protheus",
				description:
					"The client faced low confidence in the accuracy of their inventory data, which represented millions of reais in stock value. The inventory process was entirely manual, carried out using pen and paper. After the supply department completed the count, hundreds of handwritten pages were sent to accounting, where the data was manually entered into the ERP system.",
				details: {
					challenge:
						"The main challenge was replacing a highly manual, paper-based inventory process with a digital workflow that employees could easily adopt, with reliable integration with the company’s TOTVS Protheus ERP. The solution also had to reduce errors, improve trust in inventory data, and eliminate the operational bottlenecks caused by manual handoffs between departments.",
					solution:
						"I developed a mobile process within the TOTVS Fluig platform, fully integrated with the company’s TOTVS Protheus ERP, allowing the supply department to perform inventory counts in a more reliable and fully integrated way. This eliminated the manual work previously required across departments.",
					features: [
						"Mobile-friendly inventory counting workflow",
						"Integration with TOTVS Protheus ERP",
						"Digital data capture to replace paper-based counting",
						"Automated data flow between supply and accounting",
						"Reduced manual ERP data entry",
						"Improved reliability and traceability of inventory records",
					],
				},
			},
			purchasingFlow: {
				title: "Purchasing Flow",
				subtitle: "An End-to-End Procurement Workflow Integrated with TOTVS Protheus",
				description:
					"The project covered the company’s entire purchasing flow, including purchase requests, purchase orders, receiving checks, inbound invoice registration, and inventory classification. Each stage required structured approvals, defined deadlines, role-based responsibilities, and clear communication between departments. The process also demanded full integration with TOTVS Protheus, along with error handling, integration logs, and fallback mechanisms to ensure operational continuity.",
				details: {
					challenge:
						"The main challenge was designing and implementing a reliable end-to-end procurement workflow capable of supporting multiple business-critical stages, hierarchical approvals, strict deadlines, and role-based responsibilities. At the same time, the solution needed to integrate fully with TOTVS Protheus, provide visibility into integration events through logs, and remain resilient through fallback strategies in case of communication or processing failures.",
					solution:
						"I designed and implemented a complete purchasing workflow within the TOTVS Fluig platform, fully integrated with TOTVS Protheus. The solution covered the full procurement lifecycle, from purchase requests to inventory classification, with customized forms for each stage, hierarchical approval flows, automated notifications, email alerts, user role assignment, integration logging, and fallback mechanisms to handle ERP integration errors safely and efficiently.",
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
						"Defined deadlines and SLA-oriented process control",
					],
				},
			},
			vehicleSales: {
				title: "Vehicle Sales Flow",
				subtitle: "An Intelligent Vehicle Billing Workflow with ERP and AI Integration",
				description:
					"I worked on a vehicle sales and billing workflow within the TOTVS Fluig platform for a large car dealership. The process included document validation at the time of purchase, direct ERP data consultation, decision gateways to route the workflow correctly, and sales automations that drastically reduced the time required to invoice a vehicle. By combining workflow intelligence, AI-based document analysis, and integration with regulatory entities, the solution made the sales process faster, more reliable, and operationally efficient.",
				details: {
					challenge:
						"The main challenge was streamlining a complex vehicle sales and billing process involving document validation, ERP data consultation, regulatory requirements, and multiple decision points. The solution needed to reduce the time required to complete a sale, prevent invalid document submissions, and ensure that each transaction followed the correct business and compliance path with minimal manual effort.",
					solution:
						"I contributed to the implementation and evolution of a vehicle sales workflow within the TOTVS Fluig platform, focused on speed, reliability, and automation. The solution included AI integration for document analysis during the purchase process, direct consultation of company ERP data, decision gateways to determine the correct process path, and sales automations that enabled sellers to invoice vehicles in just a few minutes using only the essential information. The workflow also supported the necessary integrations with regulatory entities to keep the process compliant and operationally efficient.",
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
						"Streamlined seller experience with minimal manual input",
					],
				},
			},
			hrWorkflows: {
				title: "HR Workflows",
				subtitle: "Automating Employee Lifecycle Processes with Fluig, Protheus, and Active Directory",
				description:
					"I developed HR workflows within the TOTVS Fluig platform to support employee hiring and internal movement processes. The solution was deeply integrated with the company’s TOTVS Protheus ERP, using registered departments and hierarchy data to drive approval flows automatically. It also automated the provisioning and update of system and Active Directory access based on each employee’s role, ensuring faster onboarding, safer transitions, and consistent access control across the organization.",
				details: {
					challenge:
						"The main challenge was building HR workflows capable of handling employee hiring and internal movement processes with speed, reliability, and governance. The solution needed to reflect the company’s organizational structure as defined in TOTVS Protheus, route approvals according to departments and hierarchies, and automate access provisioning and permission changes across systems and Active Directory based on each employee’s role and movement.",
					solution:
						"I designed and implemented HR workflows in the TOTVS Fluig platform to automate key employee lifecycle processes, including hiring and internal movement. The workflows were fully integrated with TOTVS Protheus to identify departments, hierarchies, and role data, enabling dynamic approval routing. In addition, the solution automated the creation of system and Active Directory accounts, populated access levels according to job position, and updated rights and permissions whenever an employee changed roles within the company.",
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
						"Safer and faster employee transitions",
					],
				},
			},
			fluigPipeline: {
				title: "Fluig Deployment Pipeline",
				subtitle: "Automating Fluig Deployments with Jenkins and Branch-Based Delivery",
				description:
					"I developed an automated deployment pipeline using Jenkins to publish forms, datasets, workflows, and widgets to the Fluig platform. The pipeline monitored merges from predefined branches and triggered the deployment process automatically, reducing manual intervention and significantly accelerating delivery time. I later added an automated test stage that runs before every deployment: if a test fails, nothing reaches production. This brought more consistency, reliability, and speed to the release process across Fluig projects.",
				details: {
					challenge:
						"The main challenge was creating a reliable deployment pipeline capable of automatically identifying and publishing different Fluig artifacts, such as forms, datasets, workflows, and widgets, based on merges from specific branches. The solution needed to reduce deployment time, minimize manual errors, and make the release process more consistent and scalable.",
					solution:
						"I designed and implemented an automated Jenkins pipeline responsible for deploying Fluig artifacts whenever merges occurred on predefined branches. The pipeline handled the publication of forms, datasets, workflows, and widgets, making the delivery process faster, safer, and far less dependent on manual execution. As a result, deployment time was drastically reduced and the overall release flow became more efficient and standardized. I then built the test stage: it finds the tests of any process, dataset or widget in the repository on its own, runs the whole suite with Node's native test runner and no npm dependencies, and blocks the deployment if anything fails. When a commit changes code without touching a test, the build shows a coverage warning, nudging the team to test without holding up delivery.",
					features: [
						"Automatic deployment triggered by branch merges",
						"Publication of Fluig forms",
						"Publication of datasets",
						"Publication of workflows",
						"Publication of widgets",
						"Automated test stage that blocks deployment when a test fails",
						"Automatic test discovery across every project in the repository",
						"Coverage warning for code changed without tests",
						"Reduced manual deployment effort",
						"Faster and more consistent release cycle",
						"Branch-based deployment strategy",
						"Improved reliability in delivery process",
						"Scalable CI/CD workflow for Fluig projects",
					],
				},
			},
			taskManager: {
				title: "Task Management System",
				subtitle: "Productivity Tool",
				description:
					"Pomodoro-based task manager with persistent local storage. It helps users structure focused work sessions and track progress without account friction.",
				details: {
					challenge:
						"Create a frictionless productivity tool that combines task management with the Pomodoro technique, storing all data client-side without requiring user accounts.",
					solution:
						"Built a lightweight CRUD system using vanilla JavaScript with localStorage persistence. The timer system automatically transitions between focus and break intervals, encouraging structured work sessions. Clean UI ensures zero learning curve.",
					features: [
						"Pomodoro timer with focus / break cycles",
						"CRUD task management with persistence",
						"Zero-dependency architecture",
						"Deployed on Vercel",
					],
				},
			},
			weatherApp: {
				title: "Weather Search App",
				subtitle: "API Integration",
				description:
					"Real-time weather dashboard consuming the OpenWeatherMap API, showing clean API integration patterns and responsive data visualization.",
				details: {
					challenge:
						"Build a clean, responsive weather app that fetches real-time data from an external API and presents complex meteorological information in an intuitive, scannable layout.",
					solution:
						"Implemented async data fetching with proper error handling and loading states. The UI renders temperature, humidity, wind speed, and condition icons in a clear visual hierarchy. Input debouncing and city validation ensure a smooth search experience.",
					features: [
						"Real-time weather data by city",
						"Temperature, humidity, and wind display",
						"Error handling for invalid queries",
						"Responsive mobile-friendly layout",
					],
				},
			},
			vocalVault: {
				title: "Vocal Vault",
				subtitle: "Voice Interface",
				description:
					"Browser-based game controlled entirely by voice, exploring the Web Speech API to create accessible, hands-free user interactions.",
				details: {
					challenge:
						"Explore the capabilities of browser-native speech recognition to create a fully voice-controlled interactive experience, beyond traditional click-based interfaces.",
					solution:
						"Leveraged the webkitSpeechRecognition API to capture and parse voice input in real-time. Built a number-guessing game with clear voice feedback loops, demonstrating how speech interfaces can create engaging, accessible experiences without any manual input.",
					features: [
						"Real-time voice command recognition",
						"Interactive number-guessing gameplay",
						"Audio feedback on user input",
						"Zero-dependency browser-native API",
					],
				},
			},
		},
	},

	testimonials: {
		heading: "Testimonials",
		carouselLabel: "Testimonials",
		intro:
			"Don't just take my word for it. Here is what people who have worked with me have to say about my impact, skills, and collaboration.",
		leaveComment: "Leave a comment!",
		loading: "Loading amazing comments…",
		errorTitle: "Oops! Something went wrong",
		errorText: "Unable to load testimonials at this time. Please try again later.",
		tryAgain: "Try Again",
		emptyTitle: "No comments yet",
		emptyText: "Be the first one to share your experience working with me. Your feedback is highly appreciated!",
		writeFirst: "Write the first comment",
	},

	commentForm: {
		title: "Leave a testimonial",
		successTitle: "Thank you!",
		successText: "Your comment has been submitted successfully and will appear publicly after review.",
		closeWindow: "Close Window",
		nameLabel: "Your Name",
		namePlaceholder: "John Doe",
		companyLabel: "Company / Role",
		companyPlaceholder: "Tech Corp / CEO",
		commentLabel: "Your Comment",
		commentPlaceholder: "Share your experience working with me. How did we tackle challenges and projects together?",
		cancel: "Cancel",
		submit: "Submit",
		submitting: "Submitting…",
		reviewNotice: "Comments are securely submitted and manually reviewed prior to display.",
		requiredError: "Name and comment are required fields.",
		genericError: "An unexpected error occurred while submitting. Please try again.",
	},

	contact: {
		heading: "Get in Touch",
		intro: "I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions, no matter where in the world you are. Let's talk!",
		location: "Curitiba, PR - Brazil",
		nameLabel: "Name",
		namePlaceholder: "Your Name",
		messageLabel: "Message",
		messagePlaceholder: "Your message…",
		send: "Send",
		mailSubject: (name: string) => `Portfolio contact - ${name}`,
	},

	footer: {
		social: "Social",
		rights: "All rights reserved.",
		downloads: "Downloads",
		resumes: {
			en: "Resume (English)",
			ptBr: "Resume (Portuguese)",
		},
	},
};

export type Messages = typeof en;
export type ProjectId = keyof Messages["projects"]["items"];
