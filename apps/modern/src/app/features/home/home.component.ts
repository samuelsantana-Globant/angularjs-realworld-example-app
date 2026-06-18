import { Component, inject, signal, OnInit } from '@angular/core';
import { TagsService } from '../../core/services/tags.service';
import { UserService } from '../../core/services/user.service';
import { ArticleListConfig } from '../../core/models/article.model';
import { ArticleListComponent } from '../../shared/components/article-list/article-list.component';
import { APP_CONSTANTS } from '../../core/constants/app.constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ArticleListComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly tagsService = inject(TagsService);
  private readonly userService = inject(UserService);

  protected readonly appName = APP_CONSTANTS.appName.toLowerCase();
  protected readonly isAuthenticated = this.userService.isAuthenticated;

  protected readonly tags = signal<string[]>([]);
  protected readonly tagsLoaded = signal(false);
  protected readonly listConfig = signal<ArticleListConfig>({
    type: this.userService.currentUser() ? 'feed' : 'all',
  });

  ngOnInit(): void {
    this.tagsService.getAll().subscribe({
      next: (tags) => {
        this.tags.set(tags);
        this.tagsLoaded.set(true);
      },
      error: () => this.tagsLoaded.set(true),
    });
  }

  protected changeList(type: 'feed' | 'all', tag?: string): void {
    this.listConfig.set({
      type,
      filters: tag ? { tag } : undefined,
    });
  }

  protected filterByTag(tag: string): void {
    this.listConfig.set({ type: 'all', filters: { tag } });
  }
}
