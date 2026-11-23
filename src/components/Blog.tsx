import { ArrowRight, PenLine } from "lucide-react";
import PostCard from "./PostCard";
import MobileCarousel from "./MobileCarousel";
import { getPosts } from "../lib/posts";
import { useI18n } from "../i18n/context";
import LocalLink from "./LocalLink";
import SectionHeader from "./SectionHeader";

const LATEST_COUNT = 3;

const Blog = () => {
	const t = useI18n();
	const posts = getPosts(t.language);
	const latestPosts = posts.slice(0, LATEST_COUNT);

	return (
		<section id="blog" className="page-section relative overflow-hidden">
			<div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

			<div className="page-container relative z-10">
				<SectionHeader
					title={t.blog.heading}
					intro={t.blog.intro}
					action={
						posts.length > 0 && (
							<LocalLink to="/blog" className="group btn-secondary shrink-0">
								<span>{t.blog.viewAll}</span>
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</LocalLink>
						)
					}
				/>

				{latestPosts.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 px-4 bg-background-elevated rounded-card border border-border-subtle text-center">
						<PenLine className="w-10 h-10 text-accent-secondary mb-6" />
						<h3 className="text-2xl font-bold text-text-primary mb-3">{t.blog.emptyTitle}</h3>
						<p className="text-text-muted max-w-md text-lg">{t.blog.emptyText}</p>
					</div>
				) : (
					<MobileCarousel
						items={latestPosts}
						label={t.blog.carouselLabel}
						getKey={(post) => post.slug}
						getName={(post) => post.title}
						renderItem={(post) => <PostCard post={post} />}
					/>
				)}
			</div>
		</section>
	);
};

export default Blog;
