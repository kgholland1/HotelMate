import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):  boolean {

    const roles = next.data['roles'] as Array<string>;
    if (roles) {
      const match = this.authService.roleMatch(roles);
      if (match) {
        return true;
      } else {
        this.router.navigate(['/dashboard']);
        this.alertify.error('You are not authorized to access this area', 5);
      }
    }

    if (this.authService.loggedIn()) {
      return true;
    }

    this.alertify.error('You need to be logged in to access this area', 5);
    this.router.navigate(['/login'],
        { queryParams: { returnUrl: state.url }});
    return false;

  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }
}
