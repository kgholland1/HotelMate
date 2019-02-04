import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertifyService } from './../../core/alertify.service';
import { HotelService } from './../hotel.service';
import { TouristPhoto } from './../../_models/touristPhoto';

@Injectable()
export class TouristEditResolver implements Resolve<TouristPhoto> {

    constructor(private hotelService: HotelService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<TouristPhoto> {

        return this.hotelService.getTourist(route.params['id']).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data', 5);
                this.router.navigate(['/hotel/tourists']);
                return of(null);
            })
        );
    }
}
