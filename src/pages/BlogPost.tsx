import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ArrowLeft, Clock } from "lucide-react";
import "highlight.js/styles/github-dark.css";
import BackToTop from "../components/BackToTop";
import CodeBlock from "../components/CodeBlock";
import { formatPostDate, getPost, resolvePostAsset } from "../lib/posts";
import { useI18n } from "../i18n/context";

const BlogPost = () => {
	const { slug = "" } = useParams();
	const post = getPost(slug);
	const t = useI18n();

	useEffect(() => {
		document.title = post ? `${post.title} | João Piologo` : t.blogPost.notFoundDocumentTitle;
	}, [post, t]);

	if (!post) {
		return (
			<section className="pt-40 pb-24 bg-background-base min-h-screen">
				<div className="max-w-3xl mx-auto px-4 text-center">
					<h1 className="text-4xl font-bold text-text-primary mb-4">{t.blogPost.notFoundTitle}</h1>
					<p className="text-text-muted text-lg mb-10">{t.blogPost.notFoundText}</p>
					<Link
						to="/blog"
						className="btn-primary"
					>
						<ArrowLeft className="w-4 h-4" />
						{t.blogPost.backToBlog}
					</Link>
				</div>
			</section>
		);
	}

	return (
		<article className="pt-32 pb-24 bg-background-base min-h-screen">
			<div className="max-w-3xl mx-auto px-4">
				<Link
					to="/blog"
					className="inline-flex items-center gap-2 text-text-muted hover:text-accent-secondary transition-colors mb-10"
				>
					<ArrowLeft className="w-4 h-4" />
					{t.blogPost.allPosts}
				</Link>

				{/* Post header */}
				<header className="mb-10">
					<h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-5">
						{post.title}
					</h1>
					{post.description && (
						<p className="text-xl text-text-muted font-light leading-relaxed mb-6">{post.description}</p>
					)}
					<div className="flex items-center gap-4 text-sm text-text-muted">
						{post.date && <time dateTime={post.date}>{formatPostDate(post.date, t.locale)}</time>}
						<span className="flex items-center gap-1">
							<Clock className="w-3.5 h-3.5" />
							{t.common.minRead(post.readingMinutes)}
						</span>
					</div>
				</header>

				{post.cover && (
					<img
						src={post.cover}
						alt={post.title}
						className="w-full rounded-2xl border border-border-subtle mb-12"
					/>
				)}

				{/* Post body */}
				<div className="post-content prose dark:prose-invert prose-lg max-w-none">
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						rehypePlugins={[rehypeHighlight]}
						components={{
							pre: ({ node: _node, ...props }) => <CodeBlock {...props} />,
							img: ({ src, alt }) => (
								<img src={resolvePostAsset(post.slug, src)} alt={alt ?? ""} loading="lazy" />
							),
							a: ({ href, children }) =>
								href?.startsWith("http") ? (
									<a href={href} target="_blank" rel="noreferrer">
										{children}
									</a>
								) : (
									<a href={href}>{children}</a>
								),
						}}
					>
						{post.content}
					</ReactMarkdown>
				</div>
			</div>
			<BackToTop />
		</article>
	);
};

export default BlogPost;
