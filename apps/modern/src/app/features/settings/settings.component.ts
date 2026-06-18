import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { ListErrorsComponent } from '../../shared/components/list-errors/list-errors.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, ListErrorsComponent],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly errors = signal<Record<string, string[]> | null>(null);

  protected formData = {
    email: '',
    bio: '',
    image: '',
    username: '',
    password: '',
  };

  ngOnInit(): void {
    const user = this.userService.currentUser();
    if (user) {
      this.formData = {
        email: user.email,
        bio: user.bio ?? '',
        image: user.image ?? '',
        username: user.username,
        password: '',
      };
    }
  }

  protected submitForm(): void {
    this.isSubmitting.set(true);
    this.errors.set(null);

    const { password, ...fields } = this.formData;
    const updatePayload = password ? { ...fields, password } : fields;

    this.userService.update(updatePayload).subscribe({
      next: (user) => this.router.navigate(['/profile', user.username]),
      error: (err) => {
        this.isSubmitting.set(false);
        this.errors.set(err.error?.errors ?? { general: ['An error occurred'] });
      },
    });
  }

  protected logout(): void {
    this.userService.logout();
  }
}
