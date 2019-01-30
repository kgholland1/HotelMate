import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IHotel } from '../_models/hotel';
import { AlertifyService } from './../core/alertify.service';
import { HotelService } from './hotel.service';

@Injectable()
export class HotelEditResolver implements Resolve<IHotel> {

    constructor(private hotelService: HotelService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IHotel> {
       return this.hotelService.getHotel().pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data', 5);
                this.router.navigate(['/dashboard']);
                return of(null);
            })
        );
    }
}
