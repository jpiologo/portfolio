import { isExternalLink, SOCIAL_LINKS } from "../lib/socialLinks";

/*
 * Fixed vertical bar of social icons on the left edge, ending in a thin line to the bottom.
 * Only shown on xl screens, where the gutter beside the max-w-6xl content is wide enough;
 * smaller screens use the links in the Contact section instead.
 * It slides down out of view once the footer, which repeats these links, is on screen.
 */
const SocialSidebar = ({ isHidden }: { isHidden: boolean }) => (
	<aside
		// Hidden links must not stay reachable by keyboard
		ref={(el) => el?.toggleAttribute("inert", isHidden)}
		className={`hidden xl:flex fixed left-8 bottom-0 z-40 flex-col items-center gap-6 text-text-muted transition-all duration-500 ease-out motion-reduce:transition-none ${
			isHidden ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
		}`}
	>
		<ul className="flex flex-col items-center gap-5">
			{SOCIAL_LINKS.map(({ id, label, href, icon: Icon }) => (
				<li key={id}>
					<a
						href={href}
						target={isExternalLink(href) ? "_blank" : undefined}
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
