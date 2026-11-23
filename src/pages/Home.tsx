import { useEffect } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import WhatIDo from "../components/WhatIDo";
import Blog from "../components/Blog";
import Projects from "../components/Projects";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import TriangleMesh from "../components/TriangleMesh";
import { useI18n } from "../i18n/context";

const Home = () => {
	const t = useI18n();

	useEffect(() => {
		document.title = t.common.siteTitle;
	}, [t]);

	return (
		<>
			{/* Every other page covers it with an opaque background */}
			<TriangleMesh />
			<Hero />
			<About />
			<WhatIDo />
			<Projects />
			<Testimonials />
			<Blog />
			<Contact />
		</>
	);
};

export default Home;
