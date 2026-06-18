import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-article-meta',
  standalone: true,
  imports: [RouterModule, DatePipe],
  templateUrl: './article-meta.component.html',
})
export class ArticleMetaComponent {
  readonly article = input.required<Article>();
}
