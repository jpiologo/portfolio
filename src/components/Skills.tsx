import type { ComponentType, FC } from "react";

import {
  Code2,
  Database,
  Server,
  Layout,
  Terminal,
  GitBranch,
  Braces,
} from "lucide-react";

import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs as SiNextJs,
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
  SiApachemaven
} from "react-icons/si";

import {
  FaPaintbrush,
  FaCode,
  FaGears,
  FaRocket,
  FaUsersGear,
  FaJava,
} from "react-icons/fa6";

type IconProps = {
  className?: string;
};

type IconComponent = ComponentType<IconProps>;

// Mapa de ícones (apenas ícones existentes)
const skillIconMap: Record<string, IconComponent> = {
  Javascript: SiJavascript,
  Typescript: SiTypescript,
  "Java 20+": FaJava,
  "React.js": SiReact,
  "Next.js": SiNextJs,
  TailwindCSS: SiTailwindcss,
  "Node.js": SiNodedotjs,
  "Nest.js": SiNestjs,
  "Express.js": SiExpress,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  MSSQL: Database,
  Docker: SiDocker,
  Redis: SiRedis,
  Git: SiGit,
  "Prisma ORM": SiPrisma,
  Biome: SiBiome,
  Swagger: SiSwagger,
  Postman: SiPostman,
  Spring: SiSpring,
  Maven: SiApachemaven,

  // Genéricos
  "UX/UI": FaPaintbrush,
  "RESTful API's": FaGears,
  "Clean Code": FaCode,
  TDD: FaCode,
  Scrum: FaUsersGear,
  Deployment: FaRocket,
  "CI/CD": FaRocket,
  "Git Flows": FaCode,
  Branching: FaCode,
  Collaboration: FaUsersGear,
  "Semantic Commits": FaCode,
};

type Skill = {
  name: string;
};

type SkillCategoryProps = {
  title: string;
  skills: Skill[];
  icon: IconComponent;
};

const fallbackIcon: IconComponent = FaCode;

const SkillCategory: FC<SkillCategoryProps> = ({ title, skills, icon: Icon }) => {
  // Primeiro as skills com ícone, depois as sem ícone
  const skillsWithIcon = skills.filter((s) => skillIconMap[s.name]);
  const skillsWithoutIcon = skills.filter((s) => !skillIconMap[s.name]);
  const orderedSkills = [...skillsWithIcon, ...skillsWithoutIcon];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      <div className="flex justify-center items-center mb-8">
        <Icon className="w-7 h-7 text-indigo-600 mr-3" />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {orderedSkills.map((skill) => {
          const IconComponent = skillIconMap[skill.name] ?? fallbackIcon;
          const hasCustomIcon = Boolean(skillIconMap[skill.name]);

          return (
            <div
              key={skill.name}
              className="flex items-center justify-center space-x-3"
            >
              <IconComponent className="w-6 h-6 text-indigo-600 flex-shrink-0" />
              <span
                className={`text-sm text-gray-700 ${
                  !hasCustomIcon ? "opacity-90" : ""
                }`}
              >
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Config de categorias para manter o JSX mais limpo
const SKILL_CATEGORIES: SkillCategoryProps[] = [
  {
    title: "Languages",
    icon: Braces,
    skills: [
      { name: "Javascript" },
      { name: "Typescript" },
      { name: "Java 20+" },
    ],
  },
  {
    title: "Frontend",
    icon: Layout,
    skills: [
      { name: "React.js" },
      { name: "Next.js" },
      { name: "TailwindCSS" },
      { name: "UX/UI" },
    ],
  },
  {
    title: "Backend",
    icon: Server,
    skills: [
      { name: "Node.js" },
      { name: "Nest.js" },
      { name: "Express.js" },
      { name: "Next.js" },
      { name: "Spring" },
      { name: "Maven" },
    ],
  },
  {
    title: "Database & Infra",
    icon: Database,
    skills: [
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "MSSQL" },
      { name: "Docker" },
      { name: "Prisma ORM" },
      { name: "Redis" },
    ],
  },
  {
    title: "Development Tools",
    icon: Terminal,
    skills: [
      { name: "Biome" },
      { name: "Swagger" },
      { name: "Postman" },
    ],
  },
  {
    title: "Best Practices",
    icon: Code2,
    skills: [
      { name: "Clean Code" },
      { name: "TDD" },
      { name: "Scrum" },
      { name: "Deployment" },
      { name: "CI/CD" },
    ],
  },
  {
    title: "Version Control",
    icon: GitBranch,
    skills: [
      { name: "Git" },
      { name: "Git Flows" },
      { name: "Branching" },
      { name: "Collaboration" },
    ],
  },
];

const Skills: FC = () => {
  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Technical Skills</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            My expertise spans a wide range of technologies and practices,
            enabling me to design, build, and maintain end-to-end solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SKILL_CATEGORIES.map((category) => (
            <SkillCategory
              key={category.title}
              title={category.title}
              icon={category.icon}
              skills={category.skills}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
