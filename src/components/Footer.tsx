import { FileDown } from "lucide-react";
import { Link } from "react-router-dom";
import { RESUMES } from "../lib/profile";
import Logo from "./Logo";

const Footer = () => (
	<footer className="bg-background-surface/80 backdrop-blur-sm text-text-muted border-t border-border-subtle">
		<div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
			<div className="flex flex-col gap-3">
				<Link
					to="/"
					aria-label="João Piologo – home"
					className="w-fit text-text-primary hover:opacity-80 transition-opacity"
				>
					<Logo className="w-12 h-12" />
				</Link>
				<p className="text-sm">© {new Date().getFullYear()} João Piologo. All rights reserved.</p>
			</div>

			<div>
				<h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary mb-3">Downloads</h3>
				<ul className="flex flex-col gap-2">
					{RESUMES.map(({ label, href }) => (
						<li key={href}>
							<a
								href={href}
								download
								className="inline-flex items-center gap-2 text-sm hover:text-accent-secondary transition-colors"
							>
								<FileDown className="w-4 h-4" />
								{label}
							</a>
						</li>
					))}
				</ul>
			</div>
		</div>
	</footer>
);

export default Footer;
