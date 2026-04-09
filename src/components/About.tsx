import { toWords } from "number-to-words";

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
              <p className="text-xl text-text-muted leading-relaxed font-light">
                I thrive on tackling complex challenges and delivering
                solutions that make a tangible impact. Whether it's
                building responsive, user-focused interfaces or engineering efficient, server-side systems.
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&q=80&w=300"
                alt="Workspace"
                className="rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              />
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=300"
                alt="Coding"
                className="rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              />
            </div>
            <div className="space-y-4 mt-8">
              <img
                src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=300"
                alt="Setup"
                className="rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              />
              <img
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=300"
                alt="Code"
                className="rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
