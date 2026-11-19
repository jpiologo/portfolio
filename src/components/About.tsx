import { MapPin } from "lucide-react";
import profileImage from "../assets/eutotvs.webp";
import { useI18n } from "../i18n/context";
import { yearsOfExperience } from "../lib/profile";
import Reveal from "./Reveal";

const About = () => {
  const t = useI18n();

  return (
    <section id="about" className="pt-32 md:pt-40 pb-20 overflow-x-clip">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center text-start">
          <Reveal>
            <h2 className="section-heading mb-6">
              {t.about.heading}
            </h2>
            <div className="space-y-4">
              <p className="section-intro">{t.about.intro(yearsOfExperience())}</p>
              <p className="section-intro">{t.about.story}</p>
            </div>
          </Reveal>

          <Reveal delay={150} className="w-full max-w-sm mx-auto md:ml-auto md:mr-0">
            <figure>
              <div className="relative">
                {/* Offset accent frame behind the photo */}
                <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border-2 border-accent-secondary/40 pointer-events-none" />
                <div className="absolute -inset-6 bg-accent-primary/20 rounded-full blur-3xl pointer-events-none" />

                <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-subtle shadow-2xl">
                  <img
                    src={profileImage}
                    alt={t.about.photoAlt}
                    loading="lazy"
                    decoding="async"
                    width={768}
                    height={1024}
                    className="w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background-base/90 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* mt-8 clears the offset frame, which extends 16px below the photo */}
              <figcaption className="mt-8 flex items-center justify-center gap-1.5 text-sm text-text-muted">
                <MapPin className="w-4 h-4 text-accent-secondary shrink-0" />
                {t.about.photoCaption}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;
