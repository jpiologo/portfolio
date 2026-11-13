import type React from 'react';
import { useState } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { buildContactMailto, CONTACT_EMAIL } from '../lib/profile';
import { isExternalLink, SOCIAL_LINKS } from '../lib/socialLinks';
import { useI18n } from '../i18n/context';
import AsciiGlobe from './AsciiGlobe';

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
    <section id="contact" className="page-section py-20 overflow-x-clip">
      {/* Two columns on large screens: the existing content on the left, the globe on the right */}
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-2xl w-full mx-auto">
          <div className="text-center lg:text-left mb-12 full-page:mb-[3vh]">
            <h2 className="section-heading mb-4 full-page:mb-[1.5vh]">{t.contact.heading}</h2>
            <p className="section-intro max-w-2xl mx-auto lg:mx-0">{t.contact.intro}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mb-6 text-sm text-text-muted">
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
                className="full-page:h-[clamp(3.5rem,13vh,9.5rem)] w-full px-4 py-2 bg-background-elevated border border-border-subtle rounded-lg focus:ring-2 focus:ring-accent-secondary focus:border-transparent text-text-primary placeholder:text-text-muted/50 outline-none transition-all resize-none"
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
          <div className="flex justify-center lg:justify-start gap-4 mt-8 full-page:mt-[3vh] xl:hidden">
            {SOCIAL_LINKS.map(({ id, label, href, icon: Icon }) => (
              <a
                key={id}
                href={href}
                target={isExternalLink(href) ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="p-3 rounded-lg border border-border-subtle bg-background-elevated text-text-muted shadow-sm transition-colors hover:text-accent-secondary hover:border-accent-secondary"
              >
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        {/* "From anywhere in the world": decorative spinning Earth */}
        <div className="flex justify-center lg:justify-end xl:translate-x-8">
          <AsciiGlobe className="text-[8px] sm:text-[11px] xl:text-[13px]" />
        </div>
      </div>
    </section>
  );
};

export default Contact;