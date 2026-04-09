
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Comment } from '../lib/types';
import { MessageSquarePlus, Quote, Loader2, AlertCircle } from 'lucide-react';
import CommentForm from './CommentForm';

const Testimonials = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
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
      setError('Unable to load testimonials at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section id="testimonials" className="py-24 bg-background-surface relative overflow-hidden">
      {/* Subtle decorative background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary tracking-tight">
              Testimonials
            </h2>
            <p className="text-xl text-text-muted leading-relaxed font-light">
              Don't just take my word for it. Here is what people who have worked with me have to say about my impact, skills, and collaboration.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-center gap-2 bg-background-elevated border border-border-subtle shadow-sm hover:shadow-md hover:border-accent-secondary text-text-muted hover:text-accent-secondary px-6 py-4 rounded-full font-bold transition-all shrink-0"
          >
            <MessageSquarePlus className="w-5 h-5 text-accent-secondary group-hover:scale-110 transition-transform" />
            <span>Leave a comment!</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-background-elevated/50 backdrop-blur-sm rounded-[2rem] border border-border-subtle shadow-sm">
            <Loader2 className="w-12 h-12 text-accent-secondary animate-spin mb-6" />
            <p className="text-text-muted font-medium text-lg animate-pulse">Loading amazing comments...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-background-elevated rounded-[2rem] border border-feedback-error/30 shadow-sm">
            <div className="w-20 h-20 bg-feedback-error-bg rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-feedback-error" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">Oops! Something went wrong</h3>
            <p className="text-text-muted text-center max-w-md text-lg leading-relaxed">{error}</p>
            <button 
              onClick={fetchComments}
              className="mt-8 px-8 py-3 bg-background-surface hover:bg-background-base text-text-muted font-bold rounded-full transition-colors border border-border-subtle"
            >
              Try Again
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-background-elevated rounded-[2rem] border border-border-subtle shadow-sm text-center">
            <div className="w-24 h-24 bg-accent-primary/15 rounded-full flex items-center justify-center mb-8 relative">
              <Quote className="w-10 h-10 text-accent-secondary absolute" />
            </div>
            <h3 className="text-3xl font-extrabold text-text-primary mb-4 tracking-tight">No comments yet</h3>
            <p className="text-text-muted max-w-lg mx-auto mb-10 text-lg leading-relaxed font-light">
              Be the first one to share your experience working with me. Your feedback is highly appreciated!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-accent-primary hover:bg-accent-hover text-text-primary px-8 py-4 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Write the first comment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comments.map((comment, index) => (
              <div 
                key={comment.id}
                className="bg-background-elevated rounded-[2rem] p-8 md:p-10 border border-border-subtle shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative group flex flex-col h-full overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Decorative background glow that appears on hover */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-primary/10 to-transparent rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none translate-x-1/2 -translate-y-1/2" />
                
                {/* Decorative Quote Mark */}
                <div className="absolute top-8 right-8 text-border-subtle group-hover:text-accent-primary/30 transition-colors pointer-events-none z-0">
                  <Quote className="w-20 h-20 transform rotate-180" />
                </div>
                
                {/* Commentary */}
                <div className="relative z-10 flex-grow mb-10">
                  <p className="text-text-muted leading-wider font-light text-[1.1rem]">
                    "{comment.commentary}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="relative z-10 mt-auto pt-8 border-t border-border-subtle flex items-center gap-5">
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
                        <span className="text-accent-secondary/90 font-semibold tracking-wide uppercase text-xs">
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
            ))}
          </div>
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
