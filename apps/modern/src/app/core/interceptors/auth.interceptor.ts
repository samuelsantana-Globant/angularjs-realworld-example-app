import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const jwtService = inject(JwtService);
  const token = jwtService.get();

  if (!token) {
    return next(request);
  }

  const authorizedRequest = request.clone({
    setHeaders: { Authorization: `Token ${token}` },
  });

  return next(authorizedRequest);
};
