import { Component, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Article } from '../../../core/models/article.model';
import { ArticleMetaComponent } from '../article-meta/article-meta.component';
import { FavoriteBtnComponent } from '../favorite-btn/favorite-btn.component';

@Component({
  selector: 'app-article-preview',
  standalone: true,
  imports: [RouterModule, ArticleMetaComponent, FavoriteBtnComponent],
  templateUrl: './article-preview.component.html',
})
export class ArticlePreviewComponent {
  readonly article = input.required<Article>();

  protected readonly currentArticle = signal<Article | null>(null);

  protected get displayArticle(): Article {
    return this.currentArticle() ?? this.article();
  }

  protected onArticleChange(updatedArticle: Article): void {
    this.currentArticle.set(updatedArticle);
  }
}
