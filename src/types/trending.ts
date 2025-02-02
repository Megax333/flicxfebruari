export interface Author {
  id: string;
  name: string;
  handle: string;
  avatar: string;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  media?: string;
  projectUpdate?: boolean;
  projectProgress?: number;
}

export interface TrendingTopic {
  id: string;
  name: string;
  category: string;
  posts: number;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
}