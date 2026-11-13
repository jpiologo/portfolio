import { MapPin } from "lucide-react";
import profileImage from "../assets/eutotvs.jpeg";
import { useI18n } from "../i18n/context";

const About = () => {
  const t = useI18n();
  const startYear = 2021;
  const currentYear = new Date();
  const years = Math.max(0, currentYear.getFullYear() - startYear);
  const yearsLabel = `${years}+`;

  return (
    <section id="about" className="page-section pt-32 md:pt-40 pb-20 overflow-x-clip">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-heading mb-6 full-page:mb-[2vh]">
              {t.about.heading}
            </h2>
            <div className="space-y-4 full-page:space-y-[1.5vh]">
              <p className="section-intro">{t.about.intro(years)}</p>
              <p className="section-intro">{t.about.story}</p>
            </div>

            <div className="mt-8 full-page:mt-[4vh] grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-secondary">{yearsLabel}</div>
                <div className="text-sm font-medium text-text-muted mt-1">{t.about.yearsOfExperience}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-secondary">50+</div>
                <div className="text-sm font-medium text-text-muted mt-1">{t.about.projects}</div>
              </div>
            </div>
          </div>

          <figure className="w-full max-w-sm full-page:max-w-[min(24rem,calc((100vh-13rem)*0.8))] mx-auto md:ml-auto md:mr-0">
            <div className="relative">
              {/* Offset accent frame behind the photo */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border-2 border-accent-secondary/40 pointer-events-none" />
              <div className="absolute -inset-6 bg-accent-primary/20 rounded-full blur-3xl pointer-events-none" />

              <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-subtle shadow-2xl">
                <img
                  src={profileImage}
                  alt={t.about.photoAlt}
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
        </div>
      </div>
    </section>
  );
};

export default About;
