import { useEffect } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Blog from "../components/Blog";
import Projects from "../components/Projects";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import { useI18n } from "../i18n/context";

const Home = () => {
	const t = useI18n();

	useEffect(() => {
		document.title = t.common.siteTitle;
	}, [t]);

	return (
		<>
			<Hero />
			<About />
			<Blog />
			<Projects />
			<Testimonials />
			<Contact />
		</>
	);
};

export default Home;
