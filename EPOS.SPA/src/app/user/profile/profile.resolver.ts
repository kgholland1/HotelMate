import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserService } from '../user.service';
import { AlertifyService } from './../../core/alertify.service';
import { AuthService } from './../../core/auth.service';
import { IProfile } from './../../_models/profile';

@Injectable()
export class ProfileResolver implements Resolve<IProfile> {

    constructor(private userService: UserService, private authService: AuthService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IProfile> {
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data', 5);
                this.router.navigate(['/dashboard']);
                return of(null);
            })
        );
    }
}
