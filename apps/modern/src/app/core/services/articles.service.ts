import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_CONSTANTS } from '../constants/app.constants';
import { Article, ArticleListConfig, ArticlesResponse } from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private readonly http = inject(HttpClient);

  query(config: ArticleListConfig): Observable<ArticlesResponse> {
    const isFeed = config.type === 'feed';
    const endpoint = `${APP_CONSTANTS.api}/articles${isFeed ? '/feed' : ''}`;

    let params = new HttpParams();
    if (config.filters) {
      Object.entries(config.filters).forEach(([key, value]) => {
        params = params.set(key, String(value));
      });
    }

    return this.http.get<ArticlesResponse>(endpoint, { params });
  }

  get(slug: string): Observable<Article> {
    return this.http
      .get<{ article: Article }>(`${APP_CONSTANTS.api}/articles/${slug}`)
      .pipe(map((response) => response.article));
  }

  save(article: Partial<Article> & { slug?: string }): Observable<Article> {
    if (article.slug) {
      const { slug, ...articleBody } = article;
      return this.http
        .put<{ article: Article }>(`${APP_CONSTANTS.api}/articles/${slug}`, { article: articleBody })
        .pipe(map((response) => response.article));
    }
    return this.http
      .post<{ article: Article }>(`${APP_CONSTANTS.api}/articles`, { article })
      .pipe(map((response) => response.article));
  }

  destroy(slug: string): Observable<void> {
    return this.http.delete<void>(`${APP_CONSTANTS.api}/articles/${slug}`);
  }

  favorite(slug: string): Observable<Article> {
    return this.http
      .post<{ article: Article }>(`${APP_CONSTANTS.api}/articles/${slug}/favorite`, {})
      .pipe(map((response) => response.article));
  }

  unfavorite(slug: string): Observable<Article> {
    return this.http
      .delete<{ article: Article }>(`${APP_CONSTANTS.api}/articles/${slug}/favorite`)
      .pipe(map((response) => response.article));
  }
}
