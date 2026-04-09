import type React from 'react';
import { useState } from 'react';
import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

// biome-ignore lint/suspicious/noExplicitAny: icon prop accepts any Lucide component
const ContactInfo = ({ icon: Icon, title, content }: { icon: any; title: string; content: string }) => (
  <div className="flex items-center p-4 bg-background-elevated rounded-lg shadow-sm border border-border-subtle">
    <div className="p-3 bg-accent-primary/15 rounded-lg">
      <Icon className="w-6 h-6 text-accent-secondary" />
    </div>
    <div className="ml-4">
      <h3 className="text-sm font-medium text-text-muted">{title}</h3>
      <p className="text-base font-semibold text-text-primary">{content}</p>
    </div>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappNumber = '5541995927885';
    const message = `Name: ${formData.name}%0AEmail: ${formData.email}%0AMessage: ${formData.message}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-background-base">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text-primary tracking-tight">Get in Touch</h2>
          <p className="text-xl text-text-muted leading-relaxed font-light max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <ContactInfo icon={MapPin} title="Location" content="Curitiba, PR - Brazil" />
            <ContactInfo icon={Mail} title="Email" content="joaotpiologo@hotmail.com" />
            <ContactInfo icon={Phone} title="Phone" content="+55 (41) 99592-7885" />
            
            <div className="flex gap-4 mt-8">
              <a href="https://github.com/jpiologo" className="p-3 bg-social-github text-background-base rounded-lg hover:opacity-80 transition-opacity">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/jo%C3%A3o-piologo-85ba9a226/" className="p-3 bg-social-linkedin text-text-primary rounded-lg hover:opacity-80 transition-opacity">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="mailto:joaotpiologo@hotmail.com" className="p-3 bg-social-email text-text-primary rounded-lg hover:opacity-80 transition-opacity">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-1">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background-elevated border border-border-subtle rounded-lg focus:ring-2 focus:ring-accent-secondary focus:border-transparent text-text-primary placeholder:text-text-muted/50 outline-none transition-all"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background-elevated border border-border-subtle rounded-lg focus:ring-2 focus:ring-accent-secondary focus:border-transparent text-text-primary placeholder:text-text-muted/50 outline-none transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-muted mb-1">Message</label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background-elevated border border-border-subtle rounded-lg focus:ring-2 focus:ring-accent-secondary focus:border-transparent text-text-primary placeholder:text-text-muted/50 outline-none transition-all resize-none"
                placeholder="Your message..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent-primary text-text-primary py-3 px-6 rounded-lg hover:bg-accent-hover transition-colors font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;