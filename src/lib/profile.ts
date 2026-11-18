export const CONTACT_EMAIL = "joaotpiologo@hotmail.com";
export const CAREER_START_YEAR = 2021;
export const yearsOfExperience = () => Math.max(0, new Date().getFullYear() - CAREER_START_YEAR);
/** Processes I have delivered to production; shown in the hero. */
export const PROCESSES_IN_PRODUCTION = 50;

export const WHATSAPP_NUMBER = "+55 (41) 99592-7885";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;

// Labels live in src/i18n (footer.resumes), keyed by id
export const RESUMES = [
	{ id: "en", href: "/resume/joao-piologo-resume-en.pdf" },
	{ id: "ptBr", href: "/resume/joao-piologo-resume-pt-br.pdf" },
] as const;

export const buildContactMailto = (subject: string, body: string) =>
	`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
