import { Profile } from './profile.model';

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}

export interface ArticleListConfig {
  type: 'feed' | 'all';
  filters?: Record<string, string | number>;
  currentPage?: number;
  totalPages?: number;
}

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}
