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
  demoLink?: string;
  githubLink?: string;
  inDevelopment?: boolean;
  details: {
    challenge: string;
    solution: string;
    techStack: string[];
    features: string[];
  };
}
