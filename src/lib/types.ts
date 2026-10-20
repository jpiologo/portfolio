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
