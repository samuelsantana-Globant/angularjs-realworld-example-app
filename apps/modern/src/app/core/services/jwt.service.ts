import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class JwtService {
  save(token: string): void {
    localStorage.setItem(APP_CONSTANTS.jwtKey, token);
  }

  get(): string | null {
    return localStorage.getItem(APP_CONSTANTS.jwtKey);
  }

  destroy(): void {
    localStorage.removeItem(APP_CONSTANTS.jwtKey);
  }
}
