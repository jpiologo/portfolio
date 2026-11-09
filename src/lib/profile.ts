export const CONTACT_EMAIL = "joaotpiologo@hotmail.com";

// Labels live in src/i18n (footer.resumes), keyed by id
export const RESUMES = [
	{ id: "en", href: "/resume/joao-piologo-resume-en.pdf" },
	{ id: "ptBr", href: "/resume/joao-piologo-resume-pt-br.pdf" },
] as const;

export const buildContactMailto = (subject: string, body: string) =>
	`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
