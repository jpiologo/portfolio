import { useEffect } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Blog from "../components/Blog";
import Projects from "../components/Projects";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";

const Home = () => {
	useEffect(() => {
		document.title = "João Piologo - Software Engineer";
	}, []);

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
