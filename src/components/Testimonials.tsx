
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
    <section id="testimonials" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Subtle decorative background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">
              Testimonials
            </h2>
            <p className="text-xl text-slate-500 leading-relaxed font-light">
              Don't just take my word for it. Here is what people who have worked with me have to say about my impact, skills, and collaboration.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-center gap-2 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 text-slate-700 hover:text-blue-600 px-6 py-4 rounded-full font-bold transition-all shrink-0"
          >
            <MessageSquarePlus className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
            <span>Leave a comment!</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-slate-100/50 shadow-sm">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
            <p className="text-slate-500 font-medium text-lg animate-pulse">Loading amazing comments...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-[2rem] border border-red-100 shadow-sm">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Oops! Something went wrong</h3>
            <p className="text-slate-500 text-center max-w-md text-lg leading-relaxed">{error}</p>
            <button 
              onClick={fetchComments}
              className="mt-8 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm text-center">
            <div className="w-24 h-24 bg-blue-50/80 rounded-full flex items-center justify-center mb-8 relative">
              <Quote className="w-10 h-10 text-blue-400 absolute" />
            </div>
            <h3 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">No comments yet</h3>
            <p className="text-slate-500 max-w-lg mx-auto mb-10 text-lg leading-relaxed font-light">
              Be the first one to share your experience working with me. Your feedback is highly appreciated!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Write the first comment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comments.map((comment, index) => (
              <div 
                key={comment.id}
                className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative group flex flex-col h-full overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Decorative background glow that appears on hover */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none translate-x-1/2 -translate-y-1/2" />
                
                {/* Decorative Quote Mark */}
                <div className="absolute top-8 right-8 text-slate-100 group-hover:text-blue-50 transition-colors pointer-events-none z-0">
                  <Quote className="w-20 h-20 transform rotate-180" />
                </div>
                
                {/* Commentary */}
                <div className="relative z-10 flex-grow mb-10">
                  <p className="text-slate-600 leading-wider font-light text-[1.1rem]">
                    "{comment.commentary}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="relative z-10 mt-auto pt-8 border-t border-slate-100 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 flex items-center justify-center shrink-0 border border-white shadow-sm ring-2 ring-slate-50 group-hover:ring-blue-50 transition-all">
                    <span className="text-blue-600 font-extrabold text-xl">
                      {comment.user_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-lg leading-snug mb-1 group-hover:text-blue-600 transition-colors">
                      {comment.user_name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-2 text-sm">
                      {comment.company && (
                        <span className="text-blue-600/90 font-semibold tracking-wide uppercase text-xs">
                          {comment.company}
                        </span>
                      )}
                      {comment.company && <span className="text-slate-300">•</span>}
                      <span className="text-slate-400 font-medium">
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
