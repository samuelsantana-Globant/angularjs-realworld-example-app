import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticlesService } from '../../core/services/articles.service';
import { Article } from '../../core/models/article.model';
import { ListErrorsComponent } from '../../shared/components/list-errors/list-errors.component';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, ListErrorsComponent],
  templateUrl: './editor.component.html',
})
export class EditorComponent implements OnInit {
  private readonly articlesService = inject(ArticlesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly errors = signal<Record<string, string[]> | null>(null);
  protected readonly tagField = signal('');

  protected article: Partial<Article> & { slug?: string } = {
    title: '',
    description: '',
    body: '',
    tagList: [],
  };

  ngOnInit(): void {
    const slug = this.route.snapshot.params['slug'];
    if (slug) {
      this.articlesService.get(slug).subscribe((article) => {
        this.article = article;
      });
    }
  }

  protected addTag(): void {
    const tag = this.tagField().trim();
    if (tag && !this.article.tagList?.includes(tag)) {
      this.article.tagList = [...(this.article.tagList ?? []), tag];
      this.tagField.set('');
    }
  }

  protected removeTag(tagName: string): void {
    this.article.tagList = this.article.tagList?.filter((tag) => tag !== tagName);
  }

  protected onTagKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  protected submit(): void {
    this.isSubmitting.set(true);
    this.errors.set(null);

    this.articlesService.save(this.article).subscribe({
      next: (savedArticle) => this.router.navigate(['/article', savedArticle.slug]),
      error: (err) => {
        this.isSubmitting.set(false);
        this.errors.set(err.error?.errors ?? { general: ['An error occurred'] });
      },
    });
  }
}
