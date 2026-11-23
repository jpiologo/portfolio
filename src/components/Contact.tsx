import type React from 'react';
import { useState } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { TbBrandWhatsapp } from 'react-icons/tb';
import { buildContactMailto, CONTACT_EMAIL, WHATSAPP_URL } from '../lib/profile';
import { externalLinkProps, SOCIAL_LINKS } from '../lib/socialLinks';
import { useI18n } from '../i18n/context';
import AsciiGlobe from './AsciiGlobe';
import Reveal from './Reveal';

const NAME_MAX_LENGTH = 100;
/** Mail apps cut off long mailto links, so the message has to stay well under 2,000 characters. */
const MESSAGE_MAX_LENGTH = 1500;

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
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="page-section overflow-x-clip">
      {/* Two columns on large screens: the existing content on the left, the globe on the right */}
      <div className="page-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <Reveal className="min-w-0">
          <div className="mb-12">
            <h2 className="section-heading mb-4">{t.contact.heading}</h2>
            <p className="section-intro max-w-2xl">{t.contact.intro}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 md:gap-y-1 mb-6 text-sm text-text-muted">
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-secondary" />
              {t.contact.location}
            </span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 py-3 md:py-1 hover:text-accent-secondary transition-colors"
            >
              <Mail className="w-4 h-4 text-accent-secondary" />
              {CONTACT_EMAIL}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 md:py-1 hover:text-accent-secondary transition-colors"
            >
              <TbBrandWhatsapp className="w-4 h-4 text-accent-secondary" />
              WhatsApp
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-1">{t.contact.nameLabel}</label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                maxLength={NAME_MAX_LENGTH}
                value={formData.name}
                onChange={handleChange}
                className="field px-4 py-2 bg-background-elevated"
                placeholder={t.contact.namePlaceholder}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-muted mb-1">{t.contact.messageLabel}</label>
              <textarea
                id="message"
                name="message"
                maxLength={MESSAGE_MAX_LENGTH}
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="field px-4 py-2 bg-background-elevated resize-none"
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
          <div className="flex flex-wrap gap-4 mt-8 xl:hidden">
            {SOCIAL_LINKS.map(({ id, label, href, icon: Icon }) => (
              <a
                key={id}
                href={href}
                {...externalLinkProps(href)}
                aria-label={label}
                className="p-3 rounded-control border border-border-subtle bg-background-elevated text-text-muted shadow-sm transition-colors hover:text-accent-secondary hover:border-accent-secondary"
              >
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </Reveal>

        {/* "From anywhere in the world": decorative spinning Earth */}
        <Reveal delay={150} className="flex justify-center lg:justify-end">
          <AsciiGlobe className="text-[7px] min-[360px]:text-[8px] sm:text-[11px] xl:text-[13px]" />
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;