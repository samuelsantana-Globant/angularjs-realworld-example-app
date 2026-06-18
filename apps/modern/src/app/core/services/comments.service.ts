import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_CONSTANTS } from '../constants/app.constants';
import { Comment } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private readonly http = inject(HttpClient);

  add(slug: string, body: string): Observable<Comment> {
    return this.http
      .post<{ comment: Comment }>(`${APP_CONSTANTS.api}/articles/${slug}/comments`, { comment: { body } })
      .pipe(map((response) => response.comment));
  }

  getAll(slug: string): Observable<Comment[]> {
    return this.http
      .get<{ comments: Comment[] }>(`${APP_CONSTANTS.api}/articles/${slug}/comments`)
      .pipe(map((response) => response.comments));
  }

  destroy(commentId: number, articleSlug: string): Observable<void> {
    return this.http.delete<void>(`${APP_CONSTANTS.api}/articles/${articleSlug}/comments/${commentId}`);
  }
}
