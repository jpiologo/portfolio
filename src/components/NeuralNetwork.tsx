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

type NodeSize = "lg" | "md" | "sm";

type TechNode = {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  description: string;
  category: string;
  color: string;
  baseX: number;
  baseY: number;
  floatSpeed: number;
  floatAmplitude: number;
  floatPhase: number;
  size: NodeSize;
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
/*  Node data – organic layout spanning full space                     */
/* ------------------------------------------------------------------ */

const NODES: TechNode[] = [
  // Languages – left region, slightly scattered
  { id: "js",        name: "Javascript",      icon: SiJavascript,  description: "Core language for dynamic web interfaces and server-side logic",           category: "Languages",       color: CAT.lang, baseX: 8,  baseY: 28, floatSpeed: 0.40, floatAmplitude: 6, floatPhase: 0.0,  size: "lg" },
  { id: "ts",        name: "Typescript",      icon: SiTypescript,  description: "Type-safe development for scalable, maintainable codebases",              category: "Languages",       color: CAT.lang, baseX: 18, baseY: 18, floatSpeed: 0.35, floatAmplitude: 8, floatPhase: 1.2,  size: "lg" },
  { id: "java",      name: "Java 20+",        icon: FaJava,        description: "Enterprise-grade backend services with modern Java features",             category: "Languages",       color: CAT.lang, baseX: 12, baseY: 44, floatSpeed: 0.45, floatAmplitude: 5, floatPhase: 2.5,  size: "md" },

  // Frontend – upper-center cluster
  { id: "react",     name: "React.js",        icon: SiReact,       description: "Component-driven UIs with hooks and state management",                   category: "Frontend",        color: CAT.front, baseX: 32, baseY: 15, floatSpeed: 0.50, floatAmplitude: 7, floatPhase: 0.8,  size: "lg" },
  { id: "next",      name: "Next.js",         icon: SiNextdotjs,   description: "Full-stack React framework for SSR and API routes",                      category: "Frontend",        color: CAT.front, baseX: 42, baseY: 28, floatSpeed: 0.38, floatAmplitude: 9, floatPhase: 3.1,  size: "lg" },
  { id: "tailwind",  name: "TailwindCSS",     icon: SiTailwindcss, description: "Utility-first CSS for rapid, consistent UI development",                 category: "Frontend",        color: CAT.front, baseX: 26, baseY: 35, floatSpeed: 0.42, floatAmplitude: 6, floatPhase: 1.7,  size: "md" },
  { id: "uxui",      name: "UX/UI",           icon: FaPaintbrush,  description: "User-centered design for intuitive interfaces",                          category: "Frontend",        color: CAT.front, baseX: 48, baseY: 16, floatSpeed: 0.30, floatAmplitude: 10, floatPhase: 4.2, size: "sm" },

  // Backend – center-right cluster
  { id: "node",      name: "Node.js",         icon: SiNodedotjs,   description: "Event-driven runtime for scalable backend services",                     category: "Backend",         color: CAT.back, baseX: 55, baseY: 22, floatSpeed: 0.36, floatAmplitude: 8, floatPhase: 0.5,  size: "lg" },
  { id: "nest",      name: "Nest.js",         icon: SiNestjs,      description: "Enterprise Node.js framework with modular architecture",                 category: "Backend",         color: CAT.back, baseX: 62, baseY: 38, floatSpeed: 0.44, floatAmplitude: 5, floatPhase: 2.8,  size: "md" },
  { id: "express",   name: "Express.js",      icon: SiExpress,     description: "Lightweight HTTP server for REST APIs and middleware",                    category: "Backend",         color: CAT.back, baseX: 50, baseY: 42, floatSpeed: 0.40, floatAmplitude: 7, floatPhase: 1.1,  size: "md" },
  { id: "spring",    name: "Spring",          icon: SiSpring,      description: "Robust Java framework for enterprise microservices",                      category: "Backend",         color: CAT.back, baseX: 68, baseY: 24, floatSpeed: 0.32, floatAmplitude: 9, floatPhase: 3.5,  size: "md" },
  { id: "maven",     name: "Maven",           icon: SiApachemaven, description: "Dependency management and build automation for Java",                     category: "Backend",         color: CAT.back, baseX: 74, baseY: 32, floatSpeed: 0.48, floatAmplitude: 4, floatPhase: 0.3,  size: "sm" },

  // Database & Infra – right side
  { id: "pg",        name: "PostgreSQL",      icon: SiPostgresql,  description: "Advanced relational database for complex data models",                    category: "Database & Infra", color: CAT.db, baseX: 82, baseY: 18, floatSpeed: 0.37, floatAmplitude: 8, floatPhase: 2.1, size: "lg" },
  { id: "mysql",     name: "MySQL",           icon: SiMysql,       description: "Reliable relational database for web applications",                       category: "Database & Infra", color: CAT.db, baseX: 90, baseY: 30, floatSpeed: 0.43, floatAmplitude: 6, floatPhase: 4.7, size: "md" },
  { id: "mssql",     name: "MSSQL",           icon: Database,      description: "Microsoft SQL Server for enterprise data solutions",                      category: "Database & Infra", color: CAT.db, baseX: 86, baseY: 44, floatSpeed: 0.34, floatAmplitude: 7, floatPhase: 1.9, size: "sm" },
  { id: "docker",    name: "Docker",          icon: SiDocker,      description: "Containerized environments for consistent deployments",                   category: "Database & Infra", color: CAT.db, baseX: 78, baseY: 50, floatSpeed: 0.41, floatAmplitude: 5, floatPhase: 3.3, size: "lg" },
  { id: "prisma",    name: "Prisma ORM",      icon: SiPrisma,      description: "Type-safe database access with auto-generated queries",                   category: "Database & Infra", color: CAT.db, baseX: 91, baseY: 56, floatSpeed: 0.39, floatAmplitude: 9, floatPhase: 0.7, size: "md" },
  { id: "redis",     name: "Redis",           icon: SiRedis,       description: "In-memory caching for high-performance data access",                      category: "Database & Infra", color: CAT.db, baseX: 72, baseY: 58, floatSpeed: 0.46, floatAmplitude: 6, floatPhase: 5.1, size: "md" },

  // Dev Tools – lower-left
  { id: "biome",     name: "Biome",           icon: SiBiome,       description: "Fast linting and formatting for consistent code",                         category: "Dev Tools",       color: CAT.tool, baseX: 10, baseY: 62, floatSpeed: 0.33, floatAmplitude: 8, floatPhase: 2.4, size: "md" },
  { id: "swagger",   name: "Swagger",         icon: SiSwagger,     description: "API documentation and interactive endpoint testing",                      category: "Dev Tools",       color: CAT.tool, baseX: 22, baseY: 72, floatSpeed: 0.47, floatAmplitude: 5, floatPhase: 0.9, size: "md" },
  { id: "postman",   name: "Postman",         icon: SiPostman,     description: "API development, testing, and collaboration",                             category: "Dev Tools",       color: CAT.tool, baseX: 8,  baseY: 78, floatSpeed: 0.38, floatAmplitude: 7, floatPhase: 4.0, size: "sm" },

  // Best Practices – center-bottom
  { id: "restapi",   name: "RESTful API's",   icon: FaGears,       description: "Designing scalable, well-documented REST endpoints",                      category: "Best Practices",  color: CAT.best, baseX: 38, baseY: 55, floatSpeed: 0.39, floatAmplitude: 6, floatPhase: 1.0, size: "md" },
  { id: "clean",     name: "Clean Code",      icon: FaCode,        description: "Writing readable, maintainable, and testable code",                       category: "Best Practices",  color: CAT.best, baseX: 30, baseY: 62, floatSpeed: 0.42, floatAmplitude: 6, floatPhase: 1.5, size: "md" },
  { id: "tdd",       name: "TDD",             icon: FaCode,        description: "Test-first development for reliable software",                            category: "Best Practices",  color: CAT.best, baseX: 44, baseY: 68, floatSpeed: 0.35, floatAmplitude: 9, floatPhase: 3.8, size: "sm" },
  { id: "scrum",     name: "Scrum",           icon: FaUsersGear,   description: "Agile methodology for iterative delivery",                                category: "Best Practices",  color: CAT.best, baseX: 52, baseY: 58, floatSpeed: 0.40, floatAmplitude: 5, floatPhase: 0.2, size: "sm" },
  { id: "deploy",    name: "Deployment",      icon: FaRocket,      description: "Automated release pipelines for production",                              category: "Best Practices",  color: CAT.best, baseX: 36, baseY: 80, floatSpeed: 0.44, floatAmplitude: 8, floatPhase: 2.7, size: "md" },
  { id: "cicd",      name: "CI/CD",           icon: FaRocket,      description: "Continuous integration and delivery for rapid iteration",                  category: "Best Practices",  color: CAT.best, baseX: 50, baseY: 76, floatSpeed: 0.36, floatAmplitude: 7, floatPhase: 5.5, size: "md" },

  // Version Control – lower-right
  { id: "git",       name: "Git",             icon: SiGit,         description: "Distributed version control for collaborative development",                category: "Version Control", color: CAT.vc, baseX: 64, baseY: 65, floatSpeed: 0.41, floatAmplitude: 8, floatPhase: 3.2, size: "lg" },
  { id: "gitflows",  name: "Git Flows",       icon: GitBranch,     description: "Structured branching strategies for organized releases",                   category: "Version Control", color: CAT.vc, baseX: 76, baseY: 72, floatSpeed: 0.37, floatAmplitude: 6, floatPhase: 0.6, size: "md" },
  { id: "branch",    name: "Branching",       icon: GitBranch,     description: "Feature isolation and parallel development",                              category: "Version Control", color: CAT.vc, baseX: 84, baseY: 68, floatSpeed: 0.45, floatAmplitude: 5, floatPhase: 4.4, size: "sm" },
  { id: "collab",    name: "Collaboration",   icon: FaUsersGear,   description: "Cross-team coordination and code review practices",                       category: "Version Control", color: CAT.vc, baseX: 58, baseY: 78, floatSpeed: 0.34, floatAmplitude: 9, floatPhase: 2.0, size: "sm" },
  { id: "semcommit", name: "Semantic Commits",icon: FaCode,        description: "Conventional commits for automated changelogs",                            category: "Version Control", color: CAT.vc, baseX: 88, baseY: 82, floatSpeed: 0.43, floatAmplitude: 4, floatPhase: 1.3, size: "sm" },
];

/* ------------------------------------------------------------------ */
/*  Background particles                                               */
/* ------------------------------------------------------------------ */

type Particle = { x: number; y: number; vx: number; vy: number; size: number; alpha: number };

function createParticles(count: number, w: number, h: number): Particle[] {
  const p: Particle[] = [];
  for (let i = 0; i < count; i++) {
    p.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.25 + 0.05,
    });
  }
  return p;
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  w: number,
  h: number,
  mouse: { x: number; y: number } | null,
) {
  for (const p of particles) {
    // Subtle mouse attraction
    if (mouse) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 200) {
        const force = (200 - d) / 200 * 0.02;
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
      }
    }

    p.x += p.vx;
    p.y += p.vy;

    // Damping
    p.vx *= 0.998;
    p.vy *= 0.998;

    // Wrap
    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
    ctx.fill();
  }
}

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
  connectedSet: Set<number>,
  mouse: { x: number; y: number } | null,
  activeCategory: string | null,
) {
  const maxDist = Math.min(w, h) * 0.32;

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dx = positions[i].x - positions[j].x;
      const dy = positions[i].y - positions[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > maxDist) continue;

      const base = (1 - d / maxDist) * 0.12;
      const isConnectedToHovered =
        hovered !== null && connectedSet.size > 0 &&
        (connectedSet.has(i) && connectedSet.has(j));
      const isHi = hovered === i || hovered === j || isConnectedToHovered;

      // Dim connections for non-active category
      let categoryDim = 1;
      if (activeCategory) {
        const iMatch = NODES[i].category === activeCategory;
        const jMatch = NODES[j].category === activeCategory;
        if (!iMatch && !jMatch) categoryDim = 0.15;
        else if (iMatch && jMatch) categoryDim = 2.5;
        else categoryDim = 0.5;
      }

      const pulse = Math.sin(time * 0.8 + i * 0.5 + j * 0.3) * 0.25 + 0.75;
      const alpha = (isHi ? base * 5 : base) * pulse * categoryDim;

      // Parse hex to rgb for the highlighted color
      let r = 148, g = 163, b = 184;
      if (isHi && hovered !== null) {
        const hex = positions[hovered].color;
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
      }

      ctx.beginPath();
      ctx.moveTo(positions[i].x, positions[i].y);
      ctx.lineTo(positions[j].x, positions[j].y);
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth = isHi ? 1.5 : 0.5;
      ctx.stroke();

      // Energy pulse dots traveling along lines
      if (alpha > 0.02) {
        const speed = 0.15 + (i % 3) * 0.05;
        const progress = ((time * speed + i * 0.7 + j * 1.1) % 3) / 3;
        if (progress > 0 && progress < 1) {
          const px = positions[i].x + (positions[j].x - positions[i].x) * progress;
          const py = positions[i].y + (positions[j].y - positions[i].y) * progress;
          const pulseAlpha = Math.sin(progress * Math.PI) * alpha * 3;
          ctx.beginPath();
          ctx.arc(px, py, isHi ? 2 : 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(pulseAlpha, 0.6)})`;
          ctx.fill();
        }
      }
    }
  }

  // Mouse proximity lines
  if (mouse && hovered === null) {
    for (let i = 0; i < positions.length; i++) {
      const dx = positions[i].x - mouse.x;
      const dy = positions[i].y - mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDist * 0.5) {
        const alpha = (1 - d / (maxDist * 0.5)) * 0.05;
        ctx.beginPath();
        ctx.moveTo(positions[i].x, positions[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(148,163,184,${alpha})`;
        ctx.lineWidth = 0.4;
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
/*  Size config                                                        */
/* ------------------------------------------------------------------ */

const SIZE_CONFIG: Record<NodeSize, { dot: number; point: number; icon: number; activePoint: number; activeIcon: number }> = {
  lg: { dot: 48, point: 12, icon: 0, activePoint: 42, activeIcon: 24 },
  md: { dot: 40, point: 10, icon: 0, activePoint: 36, activeIcon: 20 },
  sm: { dot: 32, point: 7,  icon: 0, activePoint: 28, activeIcon: 16 },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface NeuralNetworkProps {
  activeCategory: string | null;
}

const NeuralNetwork: FC<NeuralNetworkProps> = ({ activeCategory }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const hoveredRef = useRef<number | null>(null);
  const dimRef = useRef({ w: 0, h: 0 });
  const particlesRef = useRef<Particle[]>([]);

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Compute connected nodes for hover highlighting
  const connectedNodes = useCallback(
    (idx: number, positions: { x: number; y: number }[], w: number, h: number): Set<number> => {
      const maxDist = Math.min(w, h) * 0.32;
      const set = new Set<number>([idx]);
      for (let j = 0; j < positions.length; j++) {
        if (j === idx) continue;
        const dx = positions[idx].x - positions[j].x;
        const dy = positions[idx].y - positions[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d <= maxDist) set.add(j);
      }
      return set;
    },
    [],
  );

  /* ---- resize observer ---- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      dimRef.current = { w: width, h: height };

      // Re-create particles on resize
      particlesRef.current = createParticles(35, width, height);

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

      ctx.clearRect(0, 0, w, h);

      // Draw background particles
      drawParticles(ctx, particlesRef.current, w, h, mousePosRef.current);

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

      // Compute connected set for current hover
      const hIdx = hoveredRef.current;
      const cSet = hIdx !== null ? connectedNodes(hIdx, positions, w, h) : new Set<number>();

      drawConnections(ctx, positions, w, h, t, hoveredRef.current, cSet, mousePosRef.current, activeCategory);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [connectedNodes, activeCategory]);

  /* ---- mouse tracking ---- */
  const onMove = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (r) mousePosRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  const onLeave = useCallback(() => {
    mousePosRef.current = null;
  }, []);

  /* ---- touch tracking ---- */
  const handleTouchNode = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;
    const r = container.getBoundingClientRect();
    const tx = clientX - r.left;
    const ty = clientY - r.top;

    mousePosRef.current = { x: tx, y: ty };

    const { w, h } = dimRef.current;
    if (w === 0 || h === 0) return;
    
    // Using a more generous touch threshold compared to strict point hovering
    const maxTouchDist = Math.max(80, Math.min(w, h) * 0.15);
    
    let closestNode: number | null = null;
    let minDist = maxTouchDist;

    for (let i = 0; i < NODES.length; i++) {
        // We use base positions since the layout is stable enough around the float origin
        const nx = (NODES[i].baseX / 100) * w;
        const ny = (NODES[i].baseY / 100) * h;
        const dx = tx - nx;
        const dy = ty - ny;
        const d = Math.sqrt(dx * dx + dy * dy);
        
        if (d < minDist) {
            minDist = d;
            closestNode = i;
        }
    }

    if (closestNode !== hoveredRef.current) {
        setHoveredNode(closestNode);
        hoveredRef.current = closestNode;
    }
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleTouchNode(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleTouchNode]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      // Intentionally not preventing default to preserve some page scrolling if drag starts outside node,
      // but keeping node tracking smooth.
      handleTouchNode(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleTouchNode]);

  const onTouchEnd = useCallback(() => {
    mousePosRef.current = null;
    setHoveredNode(null);
    hoveredRef.current = null;
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

  /* ---- compute connected nodes for CSS dimming ---- */
  const connectedSet = useCallback((): Set<number> => {
    if (hoveredNode === null) return new Set();
    const { w, h } = dimRef.current;
    const maxDist = Math.min(w, h) * 0.32;
    const set = new Set<number>([hoveredNode]);
    for (let j = 0; j < NODES.length; j++) {
      if (j === hoveredNode) continue;
      const dx = (NODES[hoveredNode].baseX - NODES[j].baseX) / 100 * w;
      const dy = (NODES[hoveredNode].baseY - NODES[j].baseY) / 100 * h;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= maxDist) set.add(j);
    }
    return set;
  }, [hoveredNode]);

  const connected = connectedSet();

  return (
    <div
      ref={containerRef}
      className="nn-container touch-pan-y"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <canvas ref={canvasRef} className="nn-canvas" />

      <div ref={nodesRef} className="nn-nodes">
        {NODES.map((node, i) => {
          const sc = SIZE_CONFIG[node.size];
          const isHovered = hoveredNode === i;
          const isConnected = hoveredNode !== null && connected.has(i);
          const isDimmed =
            (hoveredNode !== null && !isHovered && !isConnected) ||
            (activeCategory !== null && node.category !== activeCategory);
          const isCatActive = activeCategory !== null && node.category === activeCategory;

          return (
            <div
              key={node.id}
              className="nn-wrapper"
              style={{
                left: `${node.baseX}%`,
                top: `${node.baseY}%`,
                opacity: isDimmed ? 0.25 : 1,
                transition: "opacity 0.4s ease",
              }}
            >
              <div className="nn-float">
                {/* Dot */}
                <div
                  className={`nn-dot${isHovered ? " nn-dot-active" : ""}${isCatActive ? " nn-dot-cat-active" : ""}`}
                  style={
                    {
                      "--dot-color": node.color,
                      "--dot-glow": `${node.color}55`,
                      width: `${sc.dot}px`,
                      height: `${sc.dot}px`,
                    } as React.CSSProperties
                  }
                  onMouseEnter={() => enter(i)}
                  onMouseLeave={() => leave()}
                >
                  <span
                    className="nn-dot-point"
                    style={{
                      width: isHovered ? `${sc.activePoint}px` : `${sc.point}px`,
                      height: isHovered ? `${sc.activePoint}px` : `${sc.point}px`,
                    }}
                  />
                  <node.icon
                    className="nn-dot-icon"
                    style={{
                      width: isHovered ? `${sc.activeIcon}px` : "0px",
                      height: isHovered ? `${sc.activeIcon}px` : "0px",
                      opacity: isHovered ? 1 : 0,
                    }}
                  />
                </div>

                {/* Tooltip */}
                <div
                  className={`nn-tooltip ${tooltipClasses(node.baseX, node.baseY)}${isHovered ? " nn-tooltip-show" : ""}`}
                  style={{ "--tip-color": node.color } as React.CSSProperties}
                >
                  <div className="nn-tooltip-header">
                    <div className="nn-tooltip-icon-wrap" style={{ background: `${node.color}18` }}>
                      <node.icon className="nn-tooltip-hicon" style={{ color: node.color }} />
                    </div>
                    <div>
                      <span className="nn-tooltip-cat" style={{ color: node.color }}>
                        {node.category}
                      </span>
                      <span className="nn-tooltip-name">{node.name}</span>
                    </div>
                  </div>
                  <p className="nn-tooltip-desc">{node.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NeuralNetwork;
