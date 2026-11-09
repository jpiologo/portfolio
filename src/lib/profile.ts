export const CONTACT_EMAIL = "joaotpiologo@hotmail.com";

export const RESUMES = [
	{ label: "Resume (English)", href: "/resume/joao-piologo-resume-en.pdf" },
	{ label: "Currículo (Português)", href: "/resume/joao-piologo-resume-pt-br.pdf" },
];

export const buildContactMailto = (name: string, message: string) => {
	const subject = `Portfolio contact - ${name}`;
	const body = `${message}\n\n${name}`;
	return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
