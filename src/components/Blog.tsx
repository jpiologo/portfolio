import { Link } from "react-router-dom";
import { ArrowRight, PenLine } from "lucide-react";
import PostCard from "./PostCard";
import { posts } from "../lib/posts";

const LATEST_COUNT = 3;

const Blog = () => {
	const latestPosts = posts.slice(0, LATEST_COUNT);

	return (
		<section id="blog" className="py-24 bg-background-surface relative overflow-hidden">
			<div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

			<div className="max-w-6xl mx-auto px-4 relative z-10">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
					<div className="max-w-2xl">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary tracking-tight">
							Blog
						</h2>
						<p className="text-xl text-text-muted leading-relaxed font-light">
							Notes, tutorials and lessons learned about software engineering, tooling and the technologies I work with every day.
						</p>
					</div>
					{posts.length > 0 && (
						<Link
							to="/blog"
							className="group btn-secondary shrink-0"
						>
							<span>View all posts</span>
							<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Link>
					)}
				</div>

				{latestPosts.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 px-4 bg-background-elevated rounded-[2rem] border border-border-subtle text-center">
						<PenLine className="w-10 h-10 text-accent-secondary mb-6" />
						<h3 className="text-2xl font-bold text-text-primary mb-3">First post coming soon</h3>
						<p className="text-text-muted max-w-md text-lg font-light">
							I'm writing about the things I build and learn. Check back shortly!
						</p>
					</div>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{latestPosts.map((post) => (
							<PostCard key={post.slug} post={post} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default Blog;
