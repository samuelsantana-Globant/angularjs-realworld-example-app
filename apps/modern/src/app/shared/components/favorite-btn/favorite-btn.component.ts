import { Component, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ArticlesService } from '../../../core/services/articles.service';
import { UserService } from '../../../core/services/user.service';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-favorite-btn',
  standalone: true,
  imports: [],
  templateUrl: './favorite-btn.component.html',
})
export class FavoriteBtnComponent {
  private readonly articlesService = inject(ArticlesService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly article = input.required<Article>();
  readonly articleChange = output<Article>();

  protected readonly isSubmitting = signal(false);

  protected toggleFavorite(): void {
    if (!this.userService.currentUser()) {
      this.router.navigate(['/register']);
      return;
    }

    this.isSubmitting.set(true);
    const currentArticle = this.article();
    const action$ = currentArticle.favorited
      ? this.articlesService.unfavorite(currentArticle.slug)
      : this.articlesService.favorite(currentArticle.slug);

    action$.subscribe({
      next: (updatedArticle) => {
        this.isSubmitting.set(false);
        this.articleChange.emit(updatedArticle);
      },
      error: () => this.isSubmitting.set(false),
    });
  }
}
