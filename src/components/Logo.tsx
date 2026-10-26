/*
 * "JP." monogram: the J and the P share a single stem, followed by an accent dot.
 * The letters use currentColor so the logo follows whatever text color it sits in.
 */
const Logo = ({ className = "" }: { className?: string }) => (
	<svg viewBox="0 0 40 40" fill="none" role="img" aria-label="João Piologo" className={className}>
		<path
			d="M14 8H24A6 6 0 0 1 24 20H20M20 8V26A6 6 0 0 1 8 26"
			stroke="currentColor"
			strokeWidth={3.2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<circle cx="31.5" cy="29.5" r="2.4" className="fill-accent-secondary" />
	</svg>
);

export default Logo;
