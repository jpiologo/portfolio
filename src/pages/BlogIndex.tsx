import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, X } from "lucide-react";
import PostCard from "../components/PostCard";
import { searchPosts } from "../lib/posts";

const BlogIndex = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const query = searchParams.get("q") ?? "";
	const visiblePosts = searchPosts(query);

	useEffect(() => {
		document.title = "Blog | João Piologo";
	}, []);

	// Keep the query in the URL so searches can be shared and survive reloads
	const updateQuery = (value: string) =>
		setSearchParams(value ? { q: value } : {}, { replace: true });

	return (
		<section className="pt-32 pb-24 bg-background-base min-h-screen">
			<div className="max-w-6xl mx-auto px-4">
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-text-muted hover:text-accent-secondary transition-colors mb-10"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to home
				</Link>

				<div className="max-w-2xl mb-10">
					<h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary tracking-tight">
						Blog
					</h1>
					<p className="text-xl text-text-muted leading-relaxed font-light">
						Every post I've written about software engineering and technology.
					</p>
				</div>

				{/* Search */}
				<div className="relative max-w-xl mb-12">
					<Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
					<input
						type="search"
						value={query}
						onChange={(e) => updateQuery(e.target.value)}
						placeholder="Search posts by title or content..."
						aria-label="Search posts"
						className="w-full pl-14 pr-12 py-3.5 bg-background-elevated border border-border-subtle rounded-full text-text-primary placeholder:text-text-muted/70 shadow-sm outline-none focus:border-accent-secondary focus:ring-4 focus:ring-accent-secondary/15 transition-all [&::-webkit-search-cancel-button]:hidden"
					/>
					{query && (
						<button
							type="button"
							onClick={() => updateQuery("")}
							className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-background-surface transition-colors"
							aria-label="Clear search"
						>
							<X className="w-4 h-4" />
						</button>
					)}
				</div>

				{query && (
					<p className="text-sm text-text-muted mb-6">
						{visiblePosts.length} {visiblePosts.length === 1 ? "result" : "results"} for "{query}"
					</p>
				)}

				{visiblePosts.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 px-4 bg-background-elevated rounded-[2rem] border border-border-subtle text-center">
						<Search className="w-10 h-10 text-accent-secondary mb-6" />
						<h2 className="text-2xl font-bold text-text-primary mb-3">No posts found</h2>
						<p className="text-text-muted max-w-md text-lg font-light mb-8">
							Try different keywords or clear the search to see every post.
						</p>
						<button type="button" onClick={() => updateQuery("")} className="btn-secondary">
							Clear search
						</button>
					</div>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{visiblePosts.map((post) => (
							<PostCard key={post.slug} post={post} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default BlogIndex;
