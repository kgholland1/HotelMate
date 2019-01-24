import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertifyService } from './../core/alertify.service';
import { ISystemUser } from '../_models/user';
import { UserService } from './user.service';


@Injectable()
export class UserListResolver implements Resolve<ISystemUser[]> {

    constructor(private userService: UserService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ISystemUser[]> {

        return this.userService.getSystemUsers().pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data', 5);
                this.router.navigate(['/dashboard']);
                return of(null);
            })
        );

    }
}
