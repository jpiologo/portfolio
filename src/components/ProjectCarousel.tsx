import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "./ProjectCard";
import type { Project } from "../lib/types";
import { useMediaQuery } from "../lib/useMediaQuery";

const PER_PAGE_DESKTOP = 2;
const PER_PAGE_MOBILE = 1;
const DESKTOP_QUERY = "(min-width: 768px)";
const SWIPE_THRESHOLD_PX = 50;

const chunk = <T,>(items: T[], size: number): T[][] => {
	const pages: T[][] = [];
	for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
	return pages;
};

const pageLabel = (index: number, pageProjects: Project[]) =>
	`Page ${index + 1}: ${pageProjects.map((p) => p.title).join(", ")}`;

const arrowClass =
	"p-2 rounded-full border border-border-subtle bg-background-elevated text-text-muted shadow-sm transition-colors hover:text-accent-secondary hover:border-accent-secondary disabled:opacity-40 disabled:pointer-events-none";

const ProjectCarousel = ({ projects }: { projects: Project[] }) => {
	const perPage = useMediaQuery(DESKTOP_QUERY) ? PER_PAGE_DESKTOP : PER_PAGE_MOBILE;
	const pages = chunk(projects, perPage);
	const [page, setPage] = useState(0);
	const touchStartX = useRef<number | null>(null);

	// Switching between 1 and 2 per page changes the page count
	useEffect(() => {
		setPage((current) => Math.min(current, pages.length - 1));
	}, [pages.length]);

	const goTo = (index: number) => setPage(Math.max(0, Math.min(index, pages.length - 1)));

	const onTouchEnd = (e: React.TouchEvent) => {
		if (touchStartX.current === null) return;
		const deltaX = e.changedTouches[0].clientX - touchStartX.current;
		touchStartX.current = null;
		if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
		goTo(deltaX < 0 ? page + 1 : page - 1);
	};

	return (
		<div aria-roledescription="carousel" aria-label="Featured projects">
			{/* Negative margin + page padding leave room for card shadows and tilt inside the clipped viewport */}
			<div
				className="overflow-hidden -m-3"
				onTouchStart={(e) => {
					touchStartX.current = e.touches[0].clientX;
				}}
				onTouchEnd={onTouchEnd}
			>
				<div
					className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
					style={{ transform: `translateX(-${page * 100}%)` }}
				>
					{pages.map((pageProjects, index) => (
						<div
							key={pageProjects[0].title}
							// Off-screen pages must not take keyboard focus
							ref={(el) => el?.toggleAttribute("inert", index !== page)}
							aria-roledescription="slide"
							aria-label={pageLabel(index, pageProjects)}
							className="w-full shrink-0 grid gap-8 p-3"
							style={{ gridTemplateColumns: `repeat(${perPage}, minmax(0, 1fr))` }}
						>
							{pageProjects.map((project) => (
								<ProjectCard key={project.title} project={project} />
							))}
						</div>
					))}
				</div>
			</div>

			<div className="mt-10 flex items-center justify-center gap-4">
				<button
					type="button"
					onClick={() => goTo(page - 1)}
					disabled={page === 0}
					className={arrowClass}
					aria-label="Previous projects"
				>
					<ChevronLeft className="w-5 h-5" />
				</button>

				<ul className="flex items-center gap-2">
					{pages.map((pageProjects, index) => {
						const isActive = index === page;
						return (
							<li key={pageProjects[0].title} className="group relative flex">
								<button
									type="button"
									onClick={() => goTo(index)}
									aria-label={pageLabel(index, pageProjects)}
									aria-current={isActive ? "true" : undefined}
									className="p-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary"
								>
									<span
										className={`block h-2.5 rounded-full transition-all duration-300 ${
											isActive
												? "w-8 bg-accent-secondary"
												: "w-2.5 bg-text-muted/40 group-hover:bg-text-muted/70"
										}`}
									/>
								</button>

								{!isActive && (
									<div
										aria-hidden="true"
										className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-has-[:focus-visible]:translate-y-0 group-has-[:focus-visible]:opacity-100"
									>
										<div className="flex gap-2 rounded-xl border border-border-subtle bg-background-elevated p-2 shadow-xl">
											{pageProjects.map((project) => (
												<div key={project.title} className="w-36">
													<img
														src={project.image}
														alt=""
														loading="lazy"
														className="aspect-video w-full rounded-md object-cover bg-background-surface"
													/>
													<p className="mt-1.5 truncate text-xs font-medium text-text-primary">
														{project.title}
													</p>
												</div>
											))}
										</div>
									</div>
								)}
							</li>
						);
					})}
				</ul>

				<button
					type="button"
					onClick={() => goTo(page + 1)}
					disabled={page === pages.length - 1}
					className={arrowClass}
					aria-label="Next projects"
				>
					<ChevronRight className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
};

export default ProjectCarousel;
