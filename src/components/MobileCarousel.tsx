import { Fragment } from "react";
import Carousel, { type CarouselProps } from "./Carousel";
import { useIsDesktop } from "../lib/useMediaQuery";

/** A card grid on md+ screens and a one-card-per-page carousel on phones. */
const MobileCarousel = <T,>(props: Omit<CarouselProps<T>, "perPage">) => {
	const isDesktop = useIsDesktop();

	if (!isDesktop) return <Carousel {...props} perPage={1} />;

	return (
		<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
			{props.items.map((item) => (
				<Fragment key={props.getKey(item)}>{props.renderItem(item)}</Fragment>
			))}
		</div>
	);
};

export default MobileCarousel;
