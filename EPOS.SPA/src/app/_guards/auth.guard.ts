import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../_Services/auth.service';
import { AlertifyService } from '../_Services/alertify.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const claimType: string = next.data['claimType'];

    if (this.authService.loggedIn() && this.authService.hasClaim(claimType))  {
      return true;
    }

    this.alertify.error('You need to be logged in to access this area', 5);
    this.router.navigate(['/login'],
        { queryParams: { returnUrl: state.url }});
    return false;
  }
}
