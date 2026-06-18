import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuthCredentials } from '../../core/models/user.model';
import { ListErrorsComponent } from '../../shared/components/list-errors/list-errors.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, FormsModule, ListErrorsComponent],
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly authType = signal<'login' | 'register'>('login');
  protected readonly title = computed(() =>
    this.authType() === 'login' ? 'Sign In' : 'Sign Up'
  );
  protected readonly isSubmitting = signal(false);
  protected readonly errors = signal<Record<string, string[]> | null>(null);

  protected formData: AuthCredentials = { email: '', password: '' };

  ngOnInit(): void {
    const routePath = this.route.snapshot.url[0]?.path;
    this.authType.set(routePath === 'register' ? 'register' : 'login');
  }

  protected submitForm(): void {
    this.isSubmitting.set(true);
    this.errors.set(null);

    this.userService.attemptAuth(this.authType(), this.formData).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.isSubmitting.set(false);
        this.errors.set(err.error?.errors ?? { general: ['An error occurred'] });
      },
    });
  }
}
