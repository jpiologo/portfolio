/*
 * DESIGN DECISION — "Bento Grid" on a light canvas
 * ─────────────────────────────────────────────────────────────────────
 * Accordions hide information behind clicks. Dot ratings are noise.
 * This layout puts every skill on screen at once, zero interaction needed.
 *
 * Each category gets a card with a unique color accent (carried from the
 * existing portfolio color system). Skills are icon + name chips — dense
 * but structured. Wide categories span 2 columns, creating natural visual
 * hierarchy without explicit ranking.
 *
 * The filter system spotlights one card at a time: it brightens and glows
 * while the rest dim — giving recruiters both a full-picture view and a
 * focused lens in one component, no page change needed.
 */
import { useState, type FC, type ComponentType } from "react";

import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiNestjs,
  SiExpress,
  SiPostgresql,
  SiMysql,
  SiDocker,
  SiRedis,
  SiGit,
  SiPrisma,
  SiBiome,
  SiSwagger,
  SiPostman,
  SiSpring,
  SiApachemaven,
} from "react-icons/si";

import {
  FaPaintbrush,
  FaCode,
  FaGears,
  FaRocket,
  FaUsersGear,
  FaJava,
} from "react-icons/fa6";

import { Database, GitBranch } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface Skill {
  name: string;
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

interface Category {
  id: string;
  name: string;
  color: string;
  span: 1 | 2;
  skills: Skill[];
}

const CATEGORIES: Category[] = [
  {
    id: "languages",
    name: "Languages",
    color: "#22d3ee",
    span: 1,
    skills: [
      { name: "JavaScript", icon: SiJavascript },
      { name: "TypeScript", icon: SiTypescript },
      { name: "Java 20+",   icon: FaJava },
    ],
  },
  {
    id: "frontend",
    name: "Frontend",
    color: "#a78bfa",
    span: 2,
    skills: [
      { name: "React.js",    icon: SiReact },
      { name: "Next.js",     icon: SiNextdotjs },
      { name: "TailwindCSS", icon: SiTailwindcss },
      { name: "UX / UI",     icon: FaPaintbrush },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    color: "#34d399",
    span: 2,
    skills: [
      { name: "Node.js",    icon: SiNodedotjs },
      { name: "Nest.js",    icon: SiNestjs },
      { name: "Express.js", icon: SiExpress },
      { name: "Spring",     icon: SiSpring },
      { name: "Maven",      icon: SiApachemaven },
    ],
  },
  {
    id: "database",
    name: "Database & Infra",
    color: "#fbbf24",
    span: 1,
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MySQL",      icon: SiMysql },
      { name: "MSSQL",      icon: Database },
      { name: "Docker",     icon: SiDocker },
      { name: "Prisma ORM", icon: SiPrisma },
      { name: "Redis",      icon: SiRedis },
    ],
  },
  {
    id: "devtools",
    name: "Dev Tools",
    color: "#fb7185",
    span: 1,
    skills: [
      { name: "Biome",   icon: SiBiome },
      { name: "Swagger", icon: SiSwagger },
      { name: "Postman", icon: SiPostman },
    ],
  },
  {
    id: "practices",
    name: "Best Practices",
    color: "#38bdf8",
    span: 1,
    skills: [
      { name: "RESTful APIs", icon: FaGears },
      { name: "Clean Code",   icon: FaCode },
      { name: "TDD",          icon: FaCode },
      { name: "Scrum",        icon: FaUsersGear },
      { name: "Deployment",   icon: FaRocket },
      { name: "CI / CD",      icon: FaRocket },
    ],
  },
  {
    id: "vcs",
    name: "Version Control",
    color: "#818cf8",
    span: 1,
    skills: [
      { name: "Git",              icon: SiGit },
      { name: "Git Flows",        icon: GitBranch },
      { name: "Branching",        icon: GitBranch },
      { name: "Collaboration",    icon: FaUsersGear },
      { name: "Semantic Commits", icon: FaCode },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const Skills: FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setActiveId((prev) => (prev === id ? null : id));

  return (
    <section id="skills" className="sk-section">
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3" />
      <div className="sk-inner">
        {/* Header */}
        <header className="sk-header">
          <h2 className="sk-title">Skills &amp; Expertise</h2>
          <p className="sk-subtitle">
            End-to-end proficiency across modern technologies, languages, and
            engineering practices.
          </p>
        </header>

        {/* Filter chips */}
        <div className="sk-filters" role="tablist" aria-label="Filter skills by category">
          <button
            role="tab"
            aria-selected={activeId === null}
            className={`sk-chip${activeId === null ? " sk-chip-active sk-chip-all-active" : ""}`}
            onClick={() => setActiveId(null)}
            type="button"
          >
            All
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeId === cat.id}
              className={`sk-chip${activeId === cat.id ? " sk-chip-active" : ""}`}
              onClick={() => toggle(cat.id)}
              type="button"
              style={
                {
                  "--chip-color": cat.color,
                  "--chip-glow": `${cat.color}18`,
                } as React.CSSProperties
              }
            >
              <span
                className="sk-chip-dot"
                style={{ background: cat.color }}
              />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Bento grid */}
        <div className="sk-grid">
          {CATEGORIES.map((cat) => {
            const dim = activeId !== null && activeId !== cat.id;
            const lit = activeId === cat.id;

            return (
              <div
                key={cat.id}
                className={`sk-card${lit ? " sk-card-lit" : ""}${dim ? " sk-card-dim" : ""}`}
                data-span={cat.span}
                style={
                  {
                    "--cat-color": cat.color,
                    "--cat-glow": `${cat.color}12`,
                    "--cat-border": `${cat.color}30`,
                  } as React.CSSProperties
                }
                onClick={() => toggle(cat.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && toggle(cat.id)}
                aria-pressed={activeId === cat.id}
              >
                {/* Top accent bar */}
                <div className="sk-card-bar" />

                {/* Card heading */}
                <div className="sk-card-head">
                  <span className="sk-card-cat">{cat.name}</span>
                  <span className="sk-card-count">{cat.skills.length}</span>
                </div>

                {/* Skill pills */}
                <div className="sk-pills">
                  {cat.skills.map((skill) => (
                    <div key={skill.name} className="sk-pill">
                      <skill.icon className="sk-pill-icon" />
                      <span className="sk-pill-name">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
