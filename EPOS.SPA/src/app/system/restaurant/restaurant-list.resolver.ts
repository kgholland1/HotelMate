import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertifyService } from './../../core/alertify.service';
import { SystemService } from './../system.service';
import { IRestaurant } from './../../_models/restaurant';


@Injectable()
export class RestaurantListResolver implements Resolve<IRestaurant[]> {
    pageSize = 10;
    pageNumber = 1;

    constructor(private systemService: SystemService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IRestaurant[]> {
        return this.systemService.getRestaurants(this.pageNumber, this.pageSize).pipe(
             catchError(error => {
                 this.alertify.error('Problem retrieving data', 5);
                 this.router.navigate(['/dashboard']);
                 return of(null);
             })
         );
     }
}
