import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: 'editor',
    loadComponent: () =>
      import('./features/editor/editor.component').then((m) => m.EditorComponent),
  },
  {
    path: 'editor/:slug',
    loadComponent: () =>
      import('./features/editor/editor.component').then((m) => m.EditorComponent),
  },
  {
    path: 'article/:slug',
    loadComponent: () =>
      import('./features/article/article.component').then((m) => m.ArticleComponent),
  },
  {
    path: 'profile/:username',
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
