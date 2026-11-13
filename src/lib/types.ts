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
  content: string;
}

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  /** Small logo shown in the carousel hover preview. */
  mini: string;
  demoLink?: string;
  githubLink?: string;
  inDevelopment?: boolean;
  techStack: TechId[];
  details: {
    challenge: string;
    solution: string;
    features: string[];
  };
}
