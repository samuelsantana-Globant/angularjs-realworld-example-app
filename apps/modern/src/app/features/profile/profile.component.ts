import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { UserService } from '../../core/services/user.service';
import { Profile } from '../../core/models/profile.model';
import { ArticleListConfig } from '../../core/models/article.model';
import { ArticleListComponent } from '../../shared/components/article-list/article-list.component';
import { FollowBtnComponent } from '../../shared/components/follow-btn/follow-btn.component';

type ProfileTab = 'articles' | 'favorites';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, ArticleListComponent, FollowBtnComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  protected readonly profile = signal<Profile | null>(null);
  protected readonly activeTab = signal<ProfileTab>('articles');

  protected readonly isOwnProfile = computed(() => {
    const currentUser = this.userService.currentUser();
    const profileUser = this.profile()?.username;
    return !!currentUser && currentUser.username === profileUser;
  });

  protected readonly listConfig = computed<ArticleListConfig>(() => {
    const username = this.profile()?.username ?? '';
    const filters: Record<string, string | number> =
      this.activeTab() === 'favorites' ? { favorited: username } : { author: username };
    return { type: 'all', filters };
  });

  ngOnInit(): void {
    this.route.params.subscribe(({ username }) => {
      this.profileService.get(username).subscribe((profile) => {
        this.profile.set(profile);
      });
    });
  }

  protected setTab(tab: ProfileTab): void {
    this.activeTab.set(tab);
  }

  protected onProfileChange(updatedProfile: Profile): void {
    this.profile.set(updatedProfile);
  }
}
