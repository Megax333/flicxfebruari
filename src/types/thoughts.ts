export interface Author {
  id: string;
  name: string;
  handle: string;
  avatar: string;
}

export interface ThoughtPost {
  id: string;
  type?: string;
  author: Author;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  media?: string;
  audioUrl?: string;
  tribe?: string;
}

export interface TrendingThought {
  id: string;
  topic: string;
  category: string;
  thoughts: number;
}