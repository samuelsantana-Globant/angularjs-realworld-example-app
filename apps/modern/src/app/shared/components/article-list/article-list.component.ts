import { Component, inject, input, OnInit, signal, effect } from '@angular/core';
import { ArticlesService } from '../../../core/services/articles.service';
import { Article, ArticleListConfig } from '../../../core/models/article.model';
import { ArticlePreviewComponent } from '../article-preview/article-preview.component';
import { ListPaginationComponent } from '../list-pagination/list-pagination.component';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [ArticlePreviewComponent, ListPaginationComponent],
  templateUrl: './article-list.component.html',
})
export class ArticleListComponent implements OnInit {
  private readonly articlesService = inject(ArticlesService);

  readonly listConfig = input.required<ArticleListConfig>();
  readonly limit = input<number>(10);

  protected readonly articles = signal<Article[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(0);

  constructor() {
    effect(() => {
      const config = this.listConfig();
      if (config) {
        this.currentPage.set(1);
        this.runQuery();
      }
    });
  }

  ngOnInit(): void {
    this.runQuery();
  }

  protected onPageChange(pageNumber: number): void {
    this.currentPage.set(pageNumber);
    this.runQuery();
  }

  private runQuery(): void {
    this.isLoading.set(true);
    this.articles.set([]);

    const pageOffset = this.limit() * (this.currentPage() - 1);
    const queryConfig: ArticleListConfig = {
      type: this.listConfig().type,
      filters: {
        ...this.listConfig().filters,
        limit: this.limit(),
        offset: pageOffset,
      },
    };

    this.articlesService.query(queryConfig).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.articles.set(response.articles);
        this.totalPages.set(Math.ceil(response.articlesCount / this.limit()));
      },
      error: () => this.isLoading.set(false),
    });
  }
}
