import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertifyService } from './../../core/alertify.service';
import { RestaurantService } from './../../core/service/restaurant.service';
import { IReservationList } from './../../_models/reservation';



@Injectable()
export class ReservationListResolver implements Resolve<IReservationList[]> {
    pageSize = 10;
    pageNumber = 1;

    constructor(private restaurantService: RestaurantService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IReservationList[]> {

        this.restaurantService.reservationParams = {};
        this.restaurantService.reservationParams.isNew = true;
        this.restaurantService.reservationParams.orderBy = 'Created';

        return this.restaurantService.getReservations(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data', 5);
                this.router.navigate(['/dashboard']);
                return of(null);
            })
        );
    }
}
