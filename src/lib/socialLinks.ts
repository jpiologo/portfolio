import { Github, Instagram, Linkedin, Mail, type LucideIcon } from "lucide-react";
import { CONTACT_EMAIL } from "./profile";

export type SocialLink = { id: "github" | "linkedin" | "instagram" | "email"; label: string; href: string; icon: LucideIcon };

export const SOCIAL_LINKS: SocialLink[] = [
	{ id: "github", label: "GitHub", href: "https://github.com/jpiologo", icon: Github },
	{ id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/jo%C3%A3o-piologo-85ba9a226/", icon: Linkedin },
	{ id: "instagram", label: "Instagram", href: "https://www.instagram.com/jpiologo", icon: Instagram },
	{ id: "email", label: "Email", href: `mailto:${CONTACT_EMAIL}`, icon: Mail },
];

export const isExternalLink = (href: string) => href.startsWith("http");
