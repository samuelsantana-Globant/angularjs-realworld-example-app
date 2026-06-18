import { Component, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { UserService } from '../../../core/services/user.service';
import { Profile } from '../../../core/models/profile.model';

@Component({
  selector: 'app-follow-btn',
  standalone: true,
  imports: [],
  templateUrl: './follow-btn.component.html',
})
export class FollowBtnComponent {
  private readonly profileService = inject(ProfileService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly profile = input.required<Profile>();
  readonly profileChange = output<Profile>();

  protected readonly isSubmitting = signal(false);

  protected toggleFollow(): void {
    if (!this.userService.currentUser()) {
      this.router.navigate(['/register']);
      return;
    }

    this.isSubmitting.set(true);
    const currentProfile = this.profile();
    const action$ = currentProfile.following
      ? this.profileService.unfollow(currentProfile.username)
      : this.profileService.follow(currentProfile.username);

    action$.subscribe({
      next: (updatedProfile) => {
        this.isSubmitting.set(false);
        this.profileChange.emit(updatedProfile);
      },
      error: () => this.isSubmitting.set(false),
    });
  }
}
