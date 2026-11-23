
import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { submitComment } from '../lib/comments';
import type { CommentInsert } from '../lib/types';
import { useI18n } from '../i18n/context';
import Modal from './Modal';

const SUCCESS_AUTO_CLOSE_MS = 4000;
const SHORT_FIELD_MAX_LENGTH = 100;
const COMMENT_MAX_LENGTH = 1000;
const REQUIRED_FIELDS = ['user_name', 'commentary'] as const;
const ERROR_ID = 'comment-form-error';

interface CommentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ isOpen, onClose }) => {
  const t = useI18n();
  const [formData, setFormData] = useState<CommentInsert>({
    user_name: '',
    company: '',
    commentary: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [invalidField, setInvalidField] = useState<keyof CommentInsert | null>(null);

  // Reopening after a sent comment starts over with an empty form
  useEffect(() => {
    if (!isOpen) return;
    setSubmitStatus('idle');
    setInvalidField(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || submitStatus !== 'success') return;
    const timeout = setTimeout(onClose, SUCCESS_AUTO_CLOSE_MS);
    return () => clearTimeout(timeout);
  }, [isOpen, submitStatus, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    // HTML5 required catches empty fields; this also rejects whitespace-only input
    const blankField = REQUIRED_FIELDS.find((field) => !formData[field].trim()) ?? null;
    setInvalidField(blankField);
    if (blankField) {
      setSubmitStatus('error');
      setErrorMessage(t.commentForm.requiredError);
      (e.currentTarget.elements.namedItem(blankField) as HTMLElement | null)?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await submitComment({
        user_name: formData.user_name.trim(),
        company: formData.company.trim(),
        commentary: formData.commentary.trim(),
      });

      setSubmitStatus('success');
      setFormData({ user_name: '', company: '', commentary: '' });
    } catch (err) {
      console.error('Error submitting comment:', err);
      setSubmitStatus('error');
      setErrorMessage(t.commentForm.genericError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorProps = (field: keyof CommentInsert) =>
    field === invalidField ? { 'aria-invalid': true, 'aria-describedby': ERROR_ID } : {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} label={t.commentForm.title} isDismissible={!isSubmitting}>
      <div className="flex flex-col max-h-full bg-background-elevated rounded-card shadow-2xl w-full max-w-2xl overflow-hidden border border-border-subtle">
        <div className="shrink-0 px-8 py-6 border-b border-border-subtle flex justify-between items-center">
          <h3 className="text-2xl font-extrabold text-text-primary tracking-tight">{t.commentForm.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="tap-target text-text-muted hover:text-text-primary transition-colors p-2 rounded-control hover:bg-background-surface"
            disabled={isSubmitting}
            aria-label={t.common.close}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="min-h-0 p-8 overflow-y-auto overscroll-contain">
          {/* Always present, so screen readers announce the confirmation when it appears */}
          <div role="status">
            {submitStatus === 'success' && (
              <div className="text-center py-10">
                <div className="mx-auto w-20 h-20 bg-feedback-success-bg rounded-card flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-feedback-success" />
                </div>
                <h4 className="text-2xl font-bold text-text-primary mb-3 tracking-tight">{t.commentForm.successTitle}</h4>
                <p className="text-text-muted leading-relaxed mb-8 max-w-md mx-auto text-lg">
                  {t.commentForm.successText}
                </p>
                <button
                  onClick={onClose}
                  className="btn-secondary"
                >
                  {t.commentForm.closeWindow}
                </button>
              </div>
            )}
          </div>
          {submitStatus !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {submitStatus === 'error' && (
                <div id={ERROR_ID} role="alert" className="flex items-start gap-3 p-4 bg-feedback-error-bg text-feedback-error rounded-control border border-feedback-error/30">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{errorMessage}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="user_name" className="block text-sm font-bold text-text-muted mb-2 hover:text-accent-secondary transition-colors">
                    {t.commentForm.nameLabel} <span aria-hidden="true" className="text-feedback-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    autoComplete="name"
                    maxLength={SHORT_FIELD_MAX_LENGTH}
                    {...errorProps('user_name')}
                    value={formData.user_name}
                    onChange={handleChange}
                    className="field px-5 py-3.5 bg-background-surface font-medium"
                    placeholder={t.commentForm.namePlaceholder}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-bold text-text-muted mb-2 hover:text-accent-secondary transition-colors">
                    {t.commentForm.companyLabel}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    autoComplete="organization"
                    maxLength={SHORT_FIELD_MAX_LENGTH}
                    value={formData.company}
                    onChange={handleChange}
                    className="field px-5 py-3.5 bg-background-surface font-medium"
                    placeholder={t.commentForm.companyPlaceholder}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="commentary" className="block text-sm font-bold text-text-muted mb-2 hover:text-accent-secondary transition-colors">
                  {t.commentForm.commentLabel} <span aria-hidden="true" className="text-feedback-error">*</span>
                </label>
                <textarea
                  id="commentary"
                  name="commentary"
                  maxLength={COMMENT_MAX_LENGTH}
                  {...errorProps('commentary')}
                  rows={5}
                  value={formData.commentary}
                  onChange={handleChange}
                  className="field px-5 py-4 bg-background-surface resize-none font-medium leading-relaxed"
                  placeholder={t.commentForm.commentPlaceholder}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="pt-4 flex justify-end gap-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost"
                  disabled={isSubmitting}
                >
                  {t.commentForm.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary min-w-[150px]"
                >
                  {isSubmitting ? (
                    <>
                      <span className="sr-only">{t.commentForm.submitting}</span>
                      <span aria-hidden="true" className="w-5 h-5 border-2 border-on-accent/30 border-t-on-accent rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      {t.commentForm.submit} <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted bg-background-surface px-3 py-1.5 rounded-control">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {t.commentForm.reviewNotice}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CommentForm;
