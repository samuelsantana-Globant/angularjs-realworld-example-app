import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { marked } from 'marked';
import { ArticlesService } from '../../core/services/articles.service';
import { CommentsService } from '../../core/services/comments.service';
import { UserService } from '../../core/services/user.service';
import { Article } from '../../core/models/article.model';
import { Comment } from '../../core/models/comment.model';
import { ArticleMetaComponent } from '../../shared/components/article-meta/article-meta.component';
import { FavoriteBtnComponent } from '../../shared/components/favorite-btn/favorite-btn.component';
import { FollowBtnComponent } from '../../shared/components/follow-btn/follow-btn.component';
import { ListErrorsComponent } from '../../shared/components/list-errors/list-errors.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    DatePipe,
    ArticleMetaComponent,
    FavoriteBtnComponent,
    FollowBtnComponent,
    ListErrorsComponent,
  ],
  templateUrl: './article.component.html',
})
export class ArticleComponent implements OnInit {
  private readonly articlesService = inject(ArticlesService);
  private readonly commentsService = inject(CommentsService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly article = signal<Article | null>(null);
  protected readonly comments = signal<Comment[]>([]);
  protected readonly isAuthenticated = this.userService.isAuthenticated;
  protected readonly currentUser = this.userService.currentUser;

  protected readonly canModify = computed(() => {
    const user = this.userService.currentUser();
    const articleAuthor = this.article()?.author?.username;
    return !!user && user.username === articleAuthor;
  });

  protected readonly articleBodyHtml = computed<SafeHtml>(() => {
    const body = this.article()?.body ?? '';
    const html = marked(body) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  protected commentBody = '';
  protected isSubmittingComment = signal(false);
  protected commentErrors = signal<Record<string, string[]> | null>(null);
  protected isDeleting = signal(false);

  ngOnInit(): void {
    const slug = this.route.snapshot.params['slug'];
    this.articlesService.get(slug).subscribe((article) => {
      this.article.set(article);
    });
    this.commentsService.getAll(slug).subscribe((comments) => {
      this.comments.set(comments);
    });
  }

  protected onArticleChange(updatedArticle: Article): void {
    this.article.set(updatedArticle);
  }

  protected addComment(): void {
    this.isSubmittingComment.set(true);
    this.commentErrors.set(null);
    const slug = this.article()!.slug;

    this.commentsService.add(slug, this.commentBody).subscribe({
      next: (comment) => {
        this.comments.update((existing) => [comment, ...existing]);
        this.commentBody = '';
        this.isSubmittingComment.set(false);
      },
      error: (err) => {
        this.isSubmittingComment.set(false);
        this.commentErrors.set(err.error?.errors ?? { general: ['An error occurred'] });
      },
    });
  }

  protected deleteComment(commentId: number, index: number): void {
    this.commentsService.destroy(commentId, this.article()!.slug).subscribe(() => {
      this.comments.update((existing) => existing.filter((_, i) => i !== index));
    });
  }

  protected deleteArticle(): void {
    this.isDeleting.set(true);
    this.articlesService.destroy(this.article()!.slug).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/']),
    });
  }
}
