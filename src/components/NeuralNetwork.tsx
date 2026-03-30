import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type FC,
  type ComponentType,
} from "react";

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
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TechNode = {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
  category: string;
  color: string;
  baseX: number;
  baseY: number;
  floatSpeed: number;
  floatAmplitude: number;
  floatPhase: number;
};

/* ------------------------------------------------------------------ */
/*  Category colours                                                   */
/* ------------------------------------------------------------------ */

const CAT = {
  lang: "#22d3ee",
  front: "#a78bfa",
  back: "#34d399",
  db: "#fbbf24",
  tool: "#fb7185",
  best: "#38bdf8",
  vc: "#818cf8",
} as const;

export const CATEGORIES = [
  { name: "Languages", color: CAT.lang },
  { name: "Frontend", color: CAT.front },
  { name: "Backend", color: CAT.back },
  { name: "Database & Infra", color: CAT.db },
  { name: "Dev Tools", color: CAT.tool },
  { name: "Best Practices", color: CAT.best },
  { name: "Version Control", color: CAT.vc },
];

/* ------------------------------------------------------------------ */
/*  Node data (positions as % of container)                            */
/* ------------------------------------------------------------------ */

const NODES: TechNode[] = [
  // Languages
  { id: "js",        name: "Javascript",      icon: SiJavascript,  description: "Core language for dynamic web interfaces and server-side logic",           category: "Languages",       color: CAT.lang, baseX: 21, baseY: 31, floatSpeed: 0.40, floatAmplitude: 8,  floatPhase: 0.0 },
  { id: "ts",        name: "Typescript",      icon: SiTypescript,  description: "Type-safe development for scalable, maintainable codebases",              category: "Languages",       color: CAT.lang, baseX: 30, baseY: 28, floatSpeed: 0.35, floatAmplitude: 10, floatPhase: 1.2 },
  { id: "java",      name: "Java 20+",        icon: FaJava,        description: "Enterprise-grade backend services with modern Java features",             category: "Languages",       color: CAT.lang, baseX: 18, baseY: 41, floatSpeed: 0.45, floatAmplitude: 7,  floatPhase: 2.5 },

  // Frontend
  { id: "react",     name: "React.js",        icon: SiReact,       description: "Component-driven UIs with hooks and state management",                   category: "Frontend",        color: CAT.front, baseX: 39, baseY: 27, floatSpeed: 0.50, floatAmplitude: 9,  floatPhase: 0.8 },
  { id: "next",      name: "Next.js",         icon: SiNextdotjs,   description: "Full-stack React framework for SSR and API routes",                      category: "Frontend",        color: CAT.front, baseX: 46, baseY: 37, floatSpeed: 0.38, floatAmplitude: 11, floatPhase: 3.1 },
  { id: "tailwind",  name: "TailwindCSS",     icon: SiTailwindcss, description: "Utility-first CSS for rapid, consistent UI development",                 category: "Frontend",        color: CAT.front, baseX: 34, baseY: 40, floatSpeed: 0.42, floatAmplitude: 8,  floatPhase: 1.7 },
  { id: "uxui",      name: "UX/UI",           icon: FaPaintbrush,  description: "User-centered design for intuitive interfaces",                          category: "Frontend",        color: CAT.front, baseX: 51, baseY: 25, floatSpeed: 0.30, floatAmplitude: 12, floatPhase: 4.2 },

  // Backend
  { id: "node",      name: "Node.js",         icon: SiNodedotjs,   description: "Event-driven runtime for scalable backend services",                     category: "Backend",         color: CAT.back, baseX: 57, baseY: 32, floatSpeed: 0.36, floatAmplitude: 10, floatPhase: 0.5 },
  { id: "nest",      name: "Nest.js",         icon: SiNestjs,      description: "Enterprise Node.js framework with modular architecture",                 category: "Backend",         color: CAT.back, baseX: 62, baseY: 43, floatSpeed: 0.44, floatAmplitude: 7,  floatPhase: 2.8 },
  { id: "express",   name: "Express.js",      icon: SiExpress,     description: "Lightweight HTTP server for REST APIs and middleware",                    category: "Backend",         color: CAT.back, baseX: 54, baseY: 46, floatSpeed: 0.40, floatAmplitude: 9,  floatPhase: 1.1 },
  { id: "spring",    name: "Spring",          icon: SiSpring,      description: "Robust Java framework for enterprise microservices",                      category: "Backend",         color: CAT.back, baseX: 67, baseY: 30, floatSpeed: 0.32, floatAmplitude: 11, floatPhase: 3.5 },
  { id: "maven",     name: "Maven",           icon: SiApachemaven, description: "Dependency management and build automation for Java",                     category: "Backend",         color: CAT.back, baseX: 71, baseY: 38, floatSpeed: 0.48, floatAmplitude: 6,  floatPhase: 0.3 },

  // Database & Infra
  { id: "pg",        name: "PostgreSQL",      icon: SiPostgresql,  description: "Advanced relational database for complex data models",                    category: "Database & Infra", color: CAT.db, baseX: 76, baseY: 27, floatSpeed: 0.37, floatAmplitude: 10, floatPhase: 2.1 },
  { id: "mysql",     name: "MySQL",           icon: SiMysql,       description: "Reliable relational database for web applications",                       category: "Database & Infra", color: CAT.db, baseX: 81, baseY: 35, floatSpeed: 0.43, floatAmplitude: 8,  floatPhase: 4.7 },
  { id: "mssql",     name: "MSSQL",           icon: Database,      description: "Microsoft SQL Server for enterprise data solutions",                      category: "Database & Infra", color: CAT.db, baseX: 79, baseY: 47, floatSpeed: 0.34, floatAmplitude: 9,  floatPhase: 1.9 },
  { id: "docker",    name: "Docker",          icon: SiDocker,      description: "Containerized environments for consistent deployments",                   category: "Database & Infra", color: CAT.db, baseX: 73, baseY: 50, floatSpeed: 0.41, floatAmplitude: 7,  floatPhase: 3.3 },
  { id: "prisma",    name: "Prisma ORM",      icon: SiPrisma,      description: "Type-safe database access with auto-generated queries",                   category: "Database & Infra", color: CAT.db, baseX: 82, baseY: 56, floatSpeed: 0.39, floatAmplitude: 11, floatPhase: 0.7 },
  { id: "redis",     name: "Redis",           icon: SiRedis,       description: "In-memory caching for high-performance data access",                      category: "Database & Infra", color: CAT.db, baseX: 68, baseY: 55, floatSpeed: 0.46, floatAmplitude: 8,  floatPhase: 5.1 },

  // Dev Tools
  { id: "biome",     name: "Biome",           icon: SiBiome,       description: "Fast linting and formatting for consistent code",                         category: "Dev Tools",       color: CAT.tool, baseX: 24, baseY: 59, floatSpeed: 0.33, floatAmplitude: 10, floatPhase: 2.4 },
  { id: "swagger",   name: "Swagger",         icon: SiSwagger,     description: "API documentation and interactive endpoint testing",                      category: "Dev Tools",       color: CAT.tool, baseX: 31, baseY: 67, floatSpeed: 0.47, floatAmplitude: 7,  floatPhase: 0.9 },
  { id: "postman",   name: "Postman",         icon: SiPostman,     description: "API development, testing, and collaboration",                             category: "Dev Tools",       color: CAT.tool, baseX: 20, baseY: 69, floatSpeed: 0.38, floatAmplitude: 9,  floatPhase: 4.0 },

  // Best Practices
  { id: "restapi",   name: "RESTful API's",   icon: FaGears,       description: "Designing scalable, well-documented REST endpoints",                      category: "Best Practices",  color: CAT.best, baseX: 48, baseY: 55, floatSpeed: 0.39, floatAmplitude: 8,  floatPhase: 1.0 },
  { id: "clean",     name: "Clean Code",      icon: FaCode,        description: "Writing readable, maintainable, and testable code",                       category: "Best Practices",  color: CAT.best, baseX: 39, baseY: 61, floatSpeed: 0.42, floatAmplitude: 8,  floatPhase: 1.5 },
  { id: "tdd",       name: "TDD",             icon: FaCode,        description: "Test-first development for reliable software",                            category: "Best Practices",  color: CAT.best, baseX: 46, baseY: 68, floatSpeed: 0.35, floatAmplitude: 11, floatPhase: 3.8 },
  { id: "scrum",     name: "Scrum",           icon: FaUsersGear,   description: "Agile methodology for iterative delivery",                                category: "Best Practices",  color: CAT.best, baseX: 54, baseY: 61, floatSpeed: 0.40, floatAmplitude: 7,  floatPhase: 0.2 },
  { id: "deploy",    name: "Deployment",      icon: FaRocket,      description: "Automated release pipelines for production",                              category: "Best Practices",  color: CAT.best, baseX: 42, baseY: 75, floatSpeed: 0.44, floatAmplitude: 10, floatPhase: 2.7 },
  { id: "cicd",      name: "CI/CD",           icon: FaRocket,      description: "Continuous integration and delivery for rapid iteration",                  category: "Best Practices",  color: CAT.best, baseX: 55, baseY: 72, floatSpeed: 0.36, floatAmplitude: 9,  floatPhase: 5.5 },

  // Version Control
  { id: "git",       name: "Git",             icon: SiGit,         description: "Distributed version control for collaborative development",                category: "Version Control", color: CAT.vc, baseX: 64, baseY: 62, floatSpeed: 0.41, floatAmplitude: 10, floatPhase: 3.2 },
  { id: "gitflows",  name: "Git Flows",       icon: GitBranch,     description: "Structured branching strategies for organized releases",                   category: "Version Control", color: CAT.vc, baseX: 71, baseY: 69, floatSpeed: 0.37, floatAmplitude: 8,  floatPhase: 0.6 },
  { id: "branch",    name: "Branching",       icon: GitBranch,     description: "Feature isolation and parallel development",                              category: "Version Control", color: CAT.vc, baseX: 77, baseY: 65, floatSpeed: 0.45, floatAmplitude: 7,  floatPhase: 4.4 },
  { id: "collab",    name: "Collaboration",   icon: FaUsersGear,   description: "Cross-team coordination and code review practices",                       category: "Version Control", color: CAT.vc, baseX: 61, baseY: 74, floatSpeed: 0.34, floatAmplitude: 11, floatPhase: 2.0 },
  { id: "semcommit", name: "Semantic Commits",icon: FaCode,        description: "Conventional commits for automated changelogs",                            category: "Version Control", color: CAT.vc, baseX: 80, baseY: 75, floatSpeed: 0.43, floatAmplitude: 6,  floatPhase: 1.3 },
];

/* ------------------------------------------------------------------ */
/*  Canvas drawing                                                     */
/* ------------------------------------------------------------------ */

function drawConnections(
  ctx: CanvasRenderingContext2D,
  positions: { x: number; y: number; color: string }[],
  w: number,
  h: number,
  time: number,
  hovered: number | null,
  mouse: { x: number; y: number } | null,
) {
  ctx.clearRect(0, 0, w, h);
  const maxDist = Math.min(w, h) * 0.28;

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dx = positions[i].x - positions[j].x;
      const dy = positions[i].y - positions[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > maxDist) continue;

      const base = (1 - d / maxDist) * 0.12;
      const isHi = hovered === i || hovered === j;
      const pulse = Math.sin(time * 0.8 + i * 0.5 + j * 0.3) * 0.25 + 0.75;
      const alpha = (isHi ? base * 5 : base) * pulse;

      ctx.beginPath();
      ctx.moveTo(positions[i].x, positions[i].y);
      ctx.lineTo(positions[j].x, positions[j].y);
      ctx.strokeStyle = isHi
        ? `rgba(167,139,250,${alpha})`
        : `rgba(148,163,184,${alpha})`;
      ctx.lineWidth = isHi ? 1.5 : 0.6;
      ctx.stroke();
    }
  }

  // Mouse proximity lines
  if (mouse) {
    for (let i = 0; i < positions.length; i++) {
      const dx = positions[i].x - mouse.x;
      const dy = positions[i].y - mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDist * 0.6) {
        const alpha = (1 - d / (maxDist * 0.6)) * 0.06;
        ctx.beginPath();
        ctx.moveTo(positions[i].x, positions[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Tooltip position helper                                            */
/* ------------------------------------------------------------------ */

function tooltipClasses(baseX: number, baseY: number): string {
  const h = baseX > 72 ? "nn-tip-left" : baseX < 28 ? "nn-tip-right" : "nn-tip-center";
  const v = baseY > 60 ? "nn-tip-above" : "nn-tip-below";
  return `${h} ${v}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const NeuralNetwork: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const hoveredRef = useRef<number | null>(null);
  const dimRef = useRef({ w: 0, h: 0 });

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  /* ---- resize observer ---- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      dimRef.current = { w: width, h: height };

      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ---- animation loop ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const nodesContainer = nodesRef.current;
    if (!canvas || !nodesContainer) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const floatEls = nodesContainer.querySelectorAll<HTMLElement>(".nn-float");

    const animate = (ts: number) => {
      const t = ts / 1000;
      const { w, h } = dimRef.current;
      if (w === 0) {
        animId = requestAnimationFrame(animate);
        return;
      }

      const positions: { x: number; y: number; color: string }[] = [];

      NODES.forEach((node, i) => {
        const el = floatEls[i];
        if (!el) return;
        const ox = Math.sin(t * node.floatSpeed + node.floatPhase) * node.floatAmplitude;
        const oy = Math.cos(t * node.floatSpeed * 0.7 + node.floatPhase + 1.5) * node.floatAmplitude * 0.6;
        el.style.transform = `translate(${ox}px, ${oy}px)`;

        positions.push({
          x: (node.baseX / 100) * w + ox,
          y: (node.baseY / 100) * h + oy,
          color: node.color,
        });
      });

      drawConnections(ctx, positions, w, h, t, hoveredRef.current, mousePosRef.current);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  /* ---- mouse tracking ---- */
  const onMove = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (r) mousePosRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  const onLeave = useCallback(() => {
    mousePosRef.current = null;
  }, []);

  /* ---- hover handlers ---- */
  const enter = useCallback((i: number) => {
    setHoveredNode(i);
    hoveredRef.current = i;
  }, []);

  const leave = useCallback(() => {
    setHoveredNode(null);
    hoveredRef.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      className="nn-container"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <canvas ref={canvasRef} className="nn-canvas" />

      <div ref={nodesRef} className="nn-nodes">
        {NODES.map((node, i) => (
          <div
            key={node.id}
            className="nn-wrapper"
            style={{ left: `${node.baseX}%`, top: `${node.baseY}%` }}
          >
            <div className="nn-float">
              {/* Dot */}
              <div
                className={`nn-dot${hoveredNode === i ? " nn-dot-active" : ""}`}
                style={
                  { "--dot-color": node.color, "--dot-glow": `${node.color}55` } as React.CSSProperties
                }
                onMouseEnter={() => enter(i)}
                onMouseLeave={() => leave()}
              >
                <span className="nn-dot-point" />
                <node.icon className="nn-dot-icon" />
              </div>

              {/* Tooltip */}
              <div
                className={`nn-tooltip ${tooltipClasses(node.baseX, node.baseY)}${hoveredNode === i ? " nn-tooltip-show" : ""}`}
                style={{ "--tip-color": node.color } as React.CSSProperties}
              >
                <span className="nn-tooltip-cat" style={{ color: node.color }}>
                  {node.category}
                </span>
                <span className="nn-tooltip-name">{node.name}</span>
                <p className="nn-tooltip-desc">{node.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeuralNetwork;
