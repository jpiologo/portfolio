
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Comment } from '../lib/types';
import { MessageSquarePlus, Quote, Loader2, AlertCircle } from 'lucide-react';
import CommentForm from './CommentForm';
import Carousel from './Carousel';
import { parallaxHandlers } from '../lib/parallax';
import { LARGE_QUERY, useIsDesktop, useMediaQuery } from '../lib/useMediaQuery';
import { useI18n } from '../i18n/context';

// One row of cards per page, so any number of comments keeps the section one screen tall
const PER_PAGE_LARGE = 3;
const PER_PAGE_DESKTOP = 2;
const PER_PAGE_MOBILE = 1;

const Testimonials = () => {
  const t = useI18n();
  const isLarge = useMediaQuery(LARGE_QUERY);
  const isDesktop = useIsDesktop();
  const perPage = isLarge ? PER_PAGE_LARGE : isDesktop ? PER_PAGE_DESKTOP : PER_PAGE_MOBILE;
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchComments = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      // The Supabase RLS policy strictly controls returning only approved=true
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select('id, created_at, user_name, company, commentary')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setComments(data as Comment[] || []);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(t.locale, options);
  };

  return (
    <section id="testimonials" className="page-section py-24 bg-background-surface/60 relative overflow-hidden">
      {/* Subtle decorative background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 full-page:mb-[4vh] gap-6">
          <div className="max-w-2xl">
            <h2 className="section-heading mb-6 full-page:mb-[2vh]">
              {t.testimonials.heading}
            </h2>
            <p className="section-intro">
              {t.testimonials.intro}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group btn-secondary shrink-0"
          >
            <MessageSquarePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>{t.testimonials.leaveComment}</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-background-elevated/50 backdrop-blur-sm rounded-[2rem] border border-border-subtle shadow-sm">
            <Loader2 className="w-12 h-12 text-accent-secondary animate-spin mb-6" />
            <p className="text-text-muted font-medium text-lg animate-pulse">{t.testimonials.loading}</p>
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-background-elevated rounded-[2rem] border border-feedback-error/30 shadow-sm">
            <div className="w-20 h-20 bg-feedback-error-bg rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-feedback-error" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">{t.testimonials.errorTitle}</h3>
            <p className="text-text-muted text-center max-w-md text-lg leading-relaxed">{t.testimonials.errorText}</p>
            <button 
              onClick={fetchComments}
              className="mt-8 btn-secondary"
            >
              {t.testimonials.tryAgain}
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-background-elevated rounded-[2rem] border border-border-subtle shadow-sm text-center">
            <div className="w-24 h-24 bg-accent-primary/15 rounded-full flex items-center justify-center mb-8 relative">
              <Quote className="w-10 h-10 text-accent-secondary absolute" />
            </div>
            <h3 className="text-3xl font-extrabold text-text-primary mb-4 tracking-tight">{t.testimonials.emptyTitle}</h3>
            <p className="text-text-muted max-w-lg mx-auto mb-10 text-lg leading-relaxed font-light">
              {t.testimonials.emptyText}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              {t.testimonials.writeFirst}
            </button>
          </div>
        ) : (
          <Carousel
            items={comments}
            perPage={perPage}
            label={t.testimonials.carouselLabel}
            getKey={(comment) => comment.id}
            getName={(comment) => comment.user_name}
            renderItem={(comment) => (
              <div
                {...parallaxHandlers}
                className="parallax-card bg-background-elevated rounded-[2rem] p-8 md:p-10 full-page:p-[3.5vh] border border-border-subtle shadow-sm hover:shadow-xl group flex flex-col h-full overflow-hidden"
              >
                {/* Decorative background glow that appears on hover */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-primary/10 to-transparent rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none translate-x-1/2 -translate-y-1/2" />
                
                {/* Decorative Quote Mark (drifts behind the text for depth) */}
                <div className="parallax-depth [--depth:28px] absolute top-8 right-8 text-border-subtle group-hover:text-accent-primary/30 pointer-events-none z-0">
                  <Quote className="w-20 h-20 transform rotate-180" />
                </div>
                
                {/* Commentary */}
                <div className="relative z-10 flex-grow mb-10 full-page:mb-[3vh] full-page:max-h-[24vh] full-page:overflow-y-auto">
                  <p className="text-text-muted leading-wider font-light text-[1.1rem]">
                    "{comment.commentary}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="relative z-10 mt-auto pt-8 full-page:pt-[2.5vh] border-t border-border-subtle flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-accent-primary/30 to-accent-secondary/15 flex items-center justify-center shrink-0 border border-border-subtle shadow-sm ring-2 ring-background-surface group-hover:ring-accent-primary/20 transition-all">
                    <span className="text-accent-secondary font-extrabold text-xl">
                      {comment.user_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-text-primary text-lg leading-snug mb-1 group-hover:text-accent-secondary transition-colors">
                      {comment.user_name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-2 text-sm">
                      {comment.company && (
                        <span className="font-label text-accent-secondary/90 font-semibold tracking-wide uppercase text-xs">
                          {comment.company}
                        </span>
                      )}
                      {comment.company && <span className="text-border-subtle">•</span>}
                      <span className="text-text-muted font-medium">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        )}

      </div>

      <CommentForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default Testimonials;
