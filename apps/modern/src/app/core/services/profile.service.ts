import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_CONSTANTS } from '../constants/app.constants';
import { Profile } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);

  get(username: string): Observable<Profile> {
    return this.http
      .get<{ profile: Profile }>(`${APP_CONSTANTS.api}/profiles/${username}`)
      .pipe(map((response) => response.profile));
  }

  follow(username: string): Observable<Profile> {
    return this.http
      .post<{ profile: Profile }>(`${APP_CONSTANTS.api}/profiles/${username}/follow`, {})
      .pipe(map((response) => response.profile));
  }

  unfollow(username: string): Observable<Profile> {
    return this.http
      .delete<{ profile: Profile }>(`${APP_CONSTANTS.api}/profiles/${username}/follow`)
      .pipe(map((response) => response.profile));
  }
}
