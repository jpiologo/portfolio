import type { TechId } from "./techCatalog";

export interface Comment {
  id: string;
  created_at: string;
  user_name: string;
  company: string;
  commentary: string;
}

export interface CommentInsert {
  user_name: string;
  company: string;
  commentary: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  cover?: string;
  draft: boolean;
  readingMinutes: number;
  /** False when a language without its own version falls back to the English text. */
  isTranslated: boolean;
}

/** Illustrated covers, drawn in src/components/ProjectArt.tsx. */
export type ProjectArtId = "sales" | "freight" | "pipeline" | "inventory" | "purchasing" | "vehicleSales" | "hr";

/**
 * Work projects get an illustration (their code is private), which also serves as their thumbnail.
 * Personal ones get a screenshot plus their logo as thumbnail; `logoIsWhite` gives it a dark backdrop in light mode.
 */
export type ProjectCover =
  | { kind: "art"; id: ProjectArtId }
  | { kind: "screenshot"; src: string; logo: string; logoIsWhite?: boolean };

export interface Project {
  /** Last part of its URL: /projects/<slug>. */
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  cover: ProjectCover;
  demoLink?: string;
  githubLink?: string;
  inDevelopment?: boolean;
  /** Built to learn, not for a client or as a product. */
  isStudy?: boolean;
  techStack: TechId[];
  details: {
    challenge: string;
    solution: string;
    features: string[];
  };
}
