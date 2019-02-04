import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertifyService } from './../../core/alertify.service';
import { SystemService } from './../system.service';
import { IOpenHour } from './../../_models/OpenHour';


@Injectable()
export class OpenHourListResolver implements Resolve<IOpenHour[]> {
    pageSize = 10;
    pageNumber = 1;

    constructor(private systemService: SystemService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IOpenHour[]> {
        return this.systemService.getOpenHours(this.pageNumber, this.pageSize).pipe(
             catchError(error => {
                 this.alertify.error('Problem retrieving data', 5);
                 this.router.navigate(['/dashboard']);
                 return of(null);
             })
         );
     }
}
