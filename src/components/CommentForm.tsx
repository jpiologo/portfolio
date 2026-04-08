
import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CommentInsert } from '../lib/types';

interface CommentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<CommentInsert>({
    user_name: '',
    company: '',
    commentary: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Validate inputs loosely (HTML5 required handles basic empty checks)
      if (!formData.user_name.trim() || !formData.commentary.trim()) {
        throw new Error('Name and commentary are required fields.');
      }

      // Insert into Supabase
      // Note: RLS forces `approved` = false on insertion by default if the policy is configured properly
      const { error } = await supabase.from('comments').insert([
        {
          user_name: formData.user_name.trim(),
          company: formData.company.trim(),
          commentary: formData.commentary.trim(),
        },
      ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ user_name: '', company: '', commentary: '' });
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 4000);
      
    } catch (err: any) {
      console.error('Error submitting comment:', err);
      setSubmitStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={!isSubmitting ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">Leave a testimonial</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          {submitStatus === 'success' ? (
            <div className="text-center py-10">
              <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Thank you!</h4>
              <p className="text-slate-500 leading-relaxed mb-8 max-w-md mx-auto text-lg">
                Your comment has been submitted successfully and will appear publicly after review.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {submitStatus === 'error' && (
                <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{errorMessage}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="user_name" className="block text-sm font-bold text-slate-700 mb-2 hover:text-blue-600 transition-colors">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                    placeholder="John Doe"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-bold text-slate-700 mb-2 hover:text-blue-600 transition-colors">
                    Company / Role
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                    placeholder="Tech Corp / CEO"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="commentary" className="block text-sm font-bold text-slate-700 mb-2 hover:text-blue-600 transition-colors">
                  Your Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="commentary"
                  rows={5}
                  value={formData.commentary}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-800 placeholder:text-slate-400 resize-none font-medium leading-relaxed"
                  placeholder="Share your experience working with me. How did treating challenge and projects go?..."
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="pt-4 flex justify-end gap-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-slate-500 hover:text-slate-800 font-bold transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed min-w-[150px]"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      Submit <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-md">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Comments are securely submitted and manually reviewed prior to display.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
