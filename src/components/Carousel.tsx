import type React from "react";
import type { ReactNode } from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "../i18n/context";

const SWIPE_THRESHOLD_PX = 50;
/** Above this many pages the dots no longer fit a phone screen, so a "3 / 12" counter replaces them. */
const MAX_DOTS = 7;

export type CarouselProps<T> = {
	items: T[];
	perPage: number;
	/** Accessible name of the whole carousel. */
	label: string;
	getKey: (item: T) => string;
	/** Short name of an item, used in the accessible label of its page. */
	getName: (item: T) => string;
	renderItem: (item: T) => ReactNode;
	/** Thumbnail of an item, shown when hovering the dot of its page (pointer devices only). */
	renderPreview?: (item: T) => ReactNode;
};

const chunk = <T,>(items: T[], size: number): T[][] => {
	const pages: T[][] = [];
	for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
	return pages;
};

const arrowClass =
	"p-2 rounded-full border border-border-subtle bg-background-elevated text-text-muted shadow-sm transition-colors hover:text-accent-secondary hover:border-accent-secondary disabled:opacity-40 disabled:pointer-events-none";

const Carousel = <T,>({ items, perPage, label, getKey, getName, renderItem, renderPreview }: CarouselProps<T>) => {
	const t = useI18n();
	const pages = chunk(items, perPage);
	const [page, setPage] = useState(0);
	const touchStartX = useRef<number | null>(null);

	// A different page size or item count changes the page count
	useEffect(() => {
		setPage((current) => Math.min(current, Math.max(pages.length - 1, 0)));
	}, [pages.length]);

	const goTo = (index: number) => setPage(Math.max(0, Math.min(index, pages.length - 1)));
	const pageLabel = (index: number) => t.common.carousel.pageLabel(index + 1, pages[index].map(getName));

	const onTouchEnd = (e: React.TouchEvent) => {
		if (touchStartX.current === null) return;
		const deltaX = e.changedTouches[0].clientX - touchStartX.current;
		touchStartX.current = null;
		if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
		goTo(deltaX < 0 ? page + 1 : page - 1);
	};

	return (
		<div aria-roledescription="carousel" aria-label={label}>
			{/* Negative margin + page padding leave room for card shadows and tilt inside the clipped viewport */}
			<div
				className="overflow-hidden -m-3 touch-pan-y"
				onTouchStart={(e) => {
					touchStartX.current = e.touches[0].clientX;
				}}
				onTouchEnd={onTouchEnd}
			>
				<div
					className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
					style={{ transform: `translateX(-${page * 100}%)` }}
				>
					{pages.map((pageItems, index) => (
						<div
							key={getKey(pageItems[0])}
							// Off-screen pages must not take keyboard focus
							ref={(el) => el?.toggleAttribute("inert", index !== page)}
							aria-roledescription="slide"
							aria-label={pageLabel(index)}
							className="w-full shrink-0 grid gap-8 p-3"
							style={{ gridTemplateColumns: `repeat(${perPage}, minmax(0, 1fr))` }}
						>
							{pageItems.map((item) => (
								<Fragment key={getKey(item)}>{renderItem(item)}</Fragment>
							))}
						</div>
					))}
				</div>
			</div>

			{pages.length > 1 && (
				<div className="mt-10 flex items-center justify-center gap-4">
					<button
						type="button"
						onClick={() => goTo(page - 1)}
						disabled={page === 0}
						className={arrowClass}
						aria-label={t.common.carousel.previous}
					>
						<ChevronLeft className="w-5 h-5" />
					</button>

					{pages.length > MAX_DOTS ? (
						<p
							aria-live="polite"
							aria-label={t.common.carousel.pageOf(page + 1, pages.length)}
							className="min-w-[4.5rem] text-center text-sm font-medium tabular-nums text-text-muted"
						>
							<span className="text-accent-secondary">{page + 1}</span> / {pages.length}
						</p>
					) : (
						<ul className="flex items-center gap-2">
							{pages.map((pageItems, index) => {
								const isActive = index === page;
								return (
									<li key={getKey(pageItems[0])} className="group relative flex">
										<button
											type="button"
											onClick={() => goTo(index)}
											aria-label={pageLabel(index)}
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

										{/* display:none on touch screens, where there is no hover and the hidden box would widen the page */}
										{renderPreview && !isActive && (
											<div
												aria-hidden="true"
												className="hidden [@media(hover:hover)]:block pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-has-[:focus-visible]:translate-y-0 group-has-[:focus-visible]:opacity-100"
											>
												<div className="flex gap-2 rounded-xl border border-border-subtle bg-background-elevated p-2 shadow-xl">
													{pageItems.map((item) => (
														<div key={getKey(item)} className="w-36">
															{renderPreview(item)}
														</div>
													))}
												</div>
											</div>
										)}
									</li>
								);
							})}
						</ul>
					)}

					<button
						type="button"
						onClick={() => goTo(page + 1)}
						disabled={page === pages.length - 1}
						className={arrowClass}
						aria-label={t.common.carousel.next}
					>
						<ChevronRight className="w-5 h-5" />
					</button>
				</div>
			)}
		</div>
	);
};

export default Carousel;
