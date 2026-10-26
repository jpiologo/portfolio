import { Github, Linkedin, Mail } from "lucide-react";

const SOCIAL_LINKS = [
	{ label: "GitHub", href: "https://github.com/jpiologo", icon: Github },
	{ label: "LinkedIn", href: "https://www.linkedin.com/in/jo%C3%A3o-piologo-85ba9a226/", icon: Linkedin },
	{ label: "Email", href: "mailto:joaotpiologo@hotmail.com", icon: Mail },
];

/*
 * Fixed vertical bar of social icons on the left edge, ending in a thin line to the bottom.
 * Only shown on xl screens, where the gutter beside the max-w-6xl content is wide enough;
 * smaller screens use the links in the Contact section instead.
 */
const SocialSidebar = () => (
	<aside className="hidden xl:flex fixed left-8 bottom-0 z-40 flex-col items-center gap-6 text-text-muted">
		<ul className="flex flex-col items-center gap-5">
			{SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
				<li key={label}>
					<a
						href={href}
						target={href.startsWith("http") ? "_blank" : undefined}
						rel="noopener noreferrer"
						aria-label={label}
						title={label}
						className="block p-1 transition-all duration-200 hover:text-accent-secondary hover:-translate-y-1"
					>
						<Icon className="w-5 h-5" strokeWidth={1.75} />
					</a>
				</li>
			))}
		</ul>
		<span aria-hidden="true" className="w-px h-24 bg-current opacity-60" />
	</aside>
);

export default SocialSidebar;
