import { useEffect, useRef } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import WhatIDo from "../components/WhatIDo";
import Blog from "../components/Blog";
import Projects from "../components/Projects";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import { useI18n } from "../i18n/context";
import { useFullPage } from "../lib/useFullPage";

const Home = () => {
	const t = useI18n();
	const mainRef = useRef<HTMLElement>(null);
	useFullPage(mainRef);

	useEffect(() => {
		document.title = t.common.siteTitle;
	}, [t]);

	return (
		<main ref={mainRef}>
			<Hero />
			<About />
			<WhatIDo />
			<Projects />
			<Testimonials />
			<Blog />
			<Contact />
		</main>
	);
};

export default Home;
