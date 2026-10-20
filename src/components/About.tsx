import { toWords } from "number-to-words";
import profileImage from "../assets/eutotvs.jpeg";

const About = () => {
  const startYear = 2021;
  const currentYear = new Date();
  const years = Math.max(0, currentYear.getFullYear() - startYear);
  const yearsLabel = `${years}+`;
  const yearsText = toWords(years);

  return (
    <section id="about" className="py-20 bg-background-base">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary tracking-tight">
              About Me
            </h2>
            <div className="space-y-4">
              <p className="text-xl text-text-muted leading-relaxed font-light">
                With over {yearsText} years of hands-on experience in full-stack
                development and graduated at Software Engineering, my expertise spans across
                web development, backend development and CI/CD pipelines. I'm also a specialist
                at TOTVS Fluig plataform.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-secondary">{yearsLabel}</div>
                <div className="text-sm font-medium text-text-muted mt-1">Years of Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-secondary">50+</div>
                <div className="text-sm font-medium text-text-muted mt-1">Projects</div>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-sm mx-auto md:ml-auto md:mr-0">
            {/* Offset accent frame behind the photo */}
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border-2 border-accent-secondary/40 pointer-events-none" />
            <div className="absolute -inset-6 bg-accent-primary/20 rounded-full blur-3xl pointer-events-none" />

            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-subtle shadow-2xl">
              <img
                src={profileImage}
                alt="João Piologo at Universo TOTVS"
                className="w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background-base/90 to-transparent pointer-events-none" />
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
