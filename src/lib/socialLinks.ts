import { Github, Instagram, Linkedin, Mail, type LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { TbBrandWhatsapp } from "react-icons/tb";
import { CONTACT_EMAIL, WHATSAPP_URL } from "./profile";

export type SocialLink = {
	id: "github" | "linkedin" | "instagram" | "whatsapp" | "email";
	label: string;
	href: string;
	icon: LucideIcon | IconType;
};

export const SOCIAL_LINKS: SocialLink[] = [
	{ id: "github", label: "GitHub", href: "https://github.com/jpiologo", icon: Github },
	{ id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/jo%C3%A3o-piologo-85ba9a226/", icon: Linkedin },
	{ id: "instagram", label: "Instagram", href: "https://www.instagram.com/jpiologo", icon: Instagram },
	{ id: "whatsapp", label: "WhatsApp", href: WHATSAPP_URL, icon: TbBrandWhatsapp },
	{ id: "email", label: "Email", href: `mailto:${CONTACT_EMAIL}`, icon: Mail },
];

export const isExternalLink = (href: string) => href.startsWith("http");
