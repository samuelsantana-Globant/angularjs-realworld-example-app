import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, switchMap, of } from 'rxjs';
import { APP_CONSTANTS } from '../constants/app.constants';
import { JwtService } from './jwt.service';
import { User, AuthCredentials } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly jwtService = inject(JwtService);

  private readonly currentUserSignal = signal<User | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  attemptAuth(type: 'login' | 'register', credentials: AuthCredentials): Observable<{ user: User }> {
    const route = type === 'login' ? '/login' : '';
    return this.http.post<{ user: User }>(`${APP_CONSTANTS.api}/users${route}`, { user: credentials }).pipe(
      tap((response) => {
        this.jwtService.save(response.user.token);
        this.currentUserSignal.set(response.user);
      })
    );
  }

  update(fields: Partial<User>): Observable<User> {
    return this.http.put<{ user: User }>(`${APP_CONSTANTS.api}/user`, { user: fields }).pipe(
      tap((response) => this.currentUserSignal.set(response.user)),
      switchMap((response) => of(response.user))
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.jwtService.destroy();
    this.router.navigate(['/']);
  }

  verifyAuth(): Observable<boolean> {
    if (!this.jwtService.get()) {
      return of(false);
    }
    if (this.currentUserSignal()) {
      return of(true);
    }
    return this.http.get<{ user: User }>(`${APP_CONSTANTS.api}/user`).pipe(
      tap((response) => this.currentUserSignal.set(response.user)),
      switchMap(() => of(true))
    );
  }
}
