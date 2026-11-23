export const FULL_NAME = "João Piologo";
export const JOB_TITLE = "Software Engineer";
/** Title of every page but the home. */
export const pageTitle = (title: string) => `${title} | ${FULL_NAME}`;

export const CONTACT_EMAIL = "joaotpiologo@hotmail.com";
export const CAREER_START_YEAR = 2021;
export const yearsOfExperience = () => Math.max(0, new Date().getFullYear() - CAREER_START_YEAR);
/** Processes I have delivered to production; shown in the hero. */
export const PROCESSES_IN_PRODUCTION = 50;
/** Thousands of requests: billing (83k) + freight routing (2.3k) since 2025-12-19, counted in Fluig production. */
export const REQUESTS_IN_PRODUCTION_THOUSANDS = 85;
/** Automated tests of the freight routing project. */
export const AUTOMATED_TESTS = 99;

export const WHATSAPP_URL = "https://wa.me/5541995927885";

// Labels live in src/i18n (footer.resumes), keyed by id
export const RESUMES = [
	{ id: "en", href: "/resume/joao-piologo-resume-en.pdf" },
	{ id: "ptBr", href: "/resume/joao-piologo-resume-pt-br.pdf" },
] as const;

export const buildContactMailto = (subject: string, body: string) =>
	`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
