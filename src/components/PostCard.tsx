import { Link } from "react-router-dom";
import { ArrowRight, Clock, FileText } from "lucide-react";
import type { Post } from "../lib/types";
import { formatPostDate } from "../lib/posts";

const PostCard = ({ post }: { post: Post }) => (
	<Link
		to={`/blog/${post.slug}`}
		className="group flex flex-col h-full bg-background-elevated rounded-2xl border border-border-subtle overflow-hidden shadow-sm hover:shadow-xl hover:border-accent-secondary/60 hover:-translate-y-1.5 transition-all duration-300"
	>
		{/* Cover */}
		<div className="aspect-[16/9] overflow-hidden bg-background-surface">
			{post.cover ? (
				<img
					src={post.cover}
					alt={post.title}
					loading="lazy"
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
				/>
			) : (
				<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-primary/40 to-background-surface">
					<FileText className="w-12 h-12 text-accent-secondary/70" />
				</div>
			)}
		</div>

		{/* Body */}
		<div className="flex flex-col flex-grow p-6">
			<h3 className="text-xl font-bold text-text-primary leading-snug mb-3 group-hover:text-accent-secondary transition-colors">
				{post.title}
			</h3>
			<p className="text-text-muted font-light leading-relaxed mb-6 line-clamp-3">
				{post.description}
			</p>

			<div className="mt-auto pt-4 border-t border-border-subtle flex items-center justify-between text-sm text-text-muted">
				<span className="flex items-center gap-3">
					{post.date && <span>{formatPostDate(post.date)}</span>}
					<span className="flex items-center gap-1">
						<Clock className="w-3.5 h-3.5" />
						{post.readingMinutes} min read
					</span>
				</span>
				<ArrowRight className="w-4 h-4 text-accent-secondary group-hover:translate-x-1 transition-transform" />
			</div>
		</div>
	</Link>
);

export default PostCard;
