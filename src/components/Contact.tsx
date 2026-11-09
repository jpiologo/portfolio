import type React from 'react';
import { useState } from 'react';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { buildContactMailto, CONTACT_EMAIL } from '../lib/profile';
import { useI18n } from '../i18n/context';

const Contact = () => {
  const t = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });

  // Opens the visitor's mail app, so their own address is the sender
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${formData.message}\n\n${formData.name}`;
    window.location.href = buildContactMailto(t.contact.mailSubject(formData.name), body);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text-primary tracking-tight">{t.contact.heading}</h2>
          <p className="text-xl text-text-muted leading-relaxed font-light max-w-2xl mx-auto">{t.contact.intro}</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6 text-sm text-text-muted">
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-secondary" />
              {t.contact.location}
            </span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 hover:text-accent-secondary transition-colors"
            >
              <Mail className="w-4 h-4 text-accent-secondary" />
              {CONTACT_EMAIL}
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-1">{t.contact.nameLabel}</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background-elevated border border-border-subtle rounded-lg focus:ring-2 focus:ring-accent-secondary focus:border-transparent text-text-primary placeholder:text-text-muted/50 outline-none transition-all"
                placeholder={t.contact.namePlaceholder}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-muted mb-1">{t.contact.messageLabel}</label>
              <textarea
                id="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background-elevated border border-border-subtle rounded-lg focus:ring-2 focus:ring-accent-secondary focus:border-transparent text-text-primary placeholder:text-text-muted/50 outline-none transition-all resize-none"
                placeholder={t.contact.messagePlaceholder}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
            >
              {t.contact.send}
              <Mail className="w-5 h-5" />
            </button>
          </form>

          {/* On xl screens these live in the fixed SocialSidebar instead */}
          <div className="flex justify-center gap-4 mt-8 xl:hidden">
            <a href="https://github.com/jpiologo" className="p-3 bg-social-github text-background-base rounded-lg hover:opacity-80 transition-opacity">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/in/jo%C3%A3o-piologo-85ba9a226/" className="p-3 bg-social-linkedin text-on-accent rounded-lg hover:opacity-80 transition-opacity">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="p-3 bg-social-email text-on-accent rounded-lg hover:opacity-80 transition-opacity">
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;