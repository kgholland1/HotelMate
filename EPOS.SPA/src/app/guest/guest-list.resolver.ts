import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as m from 'moment';

import { AlertifyService } from './../core/alertify.service';
import { GuestService } from './../core/service/guest.service';

import { IBookingList } from './../_models/booking';

@Injectable()
export class GuestListResolver implements Resolve<IBookingList[]> {
    pageSize = 10;
    pageNumber = 1;

    constructor(private guestService: GuestService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IBookingList[]> {

        this.guestService.bookingParams = {};
        this.guestService.bookingParams.checkInDate = m().format('DD/MM/YYYY');
        this.guestService.bookingParams.orderBy = 'CheckIn';

        return this.guestService.getBookings(this.pageNumber, this.pageSize).pipe(
             catchError(error => {
                 this.alertify.error('Problem retrieving data', 5);
                 this.router.navigate(['/dashboard']);
                 return of(null);
             })
         );
     }

}
