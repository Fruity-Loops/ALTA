import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canLoad(): Observable<boolean> {
    // Verify that the user is authenticated
    return this.authService.isAuthenticated.pipe(
      filter(isNonNull),
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          // If not authenticated navigate to login page
          this.router.navigateByUrl('signin');
        }
        else {
          return true;
        }

      })
    );
  }
}

function isNonNull<T>(value: T): value is NonNullable<T> {
  return value != null;
}
