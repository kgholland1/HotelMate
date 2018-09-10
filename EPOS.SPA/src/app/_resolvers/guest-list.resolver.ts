import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { IBookingList } from '../_models/booking';
import { GuestService } from '../_Services/guest.service';
import * as m from 'moment';


@Injectable()
export class GuestListResolver implements Resolve<IBookingList[]> {
    pageSize = 10;
    pageNumber = 1;
    bookingParams: any = {};

    constructor(private guestService: GuestService,
        private router: Router, private alertify: AlertifyService) {
            this.bookingParams.checkInDate = m().format('DD/MM/YYYY');
            this.bookingParams.orderBy = 'CheckIn';
        }

    resolve(route: ActivatedRouteSnapshot): Observable<IBookingList[]> {
        return this.guestService.getBookings(this.pageNumber, this.pageSize, this.bookingParams).catch(error => {
            this.alertify.error('Problem retrieving data', 5);
            this.router.navigate(['/be']);
            return Observable.of(null);
        });
    }
}
