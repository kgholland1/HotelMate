import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { GuestService } from '../_Services/guest.service';
import { IReservationList } from '../_models/reservation';


@Injectable()
export class ReservationListResolver implements Resolve<IReservationList[]> {
    pageSize = 10;
    pageNumber = 1;
    reservationParams: any = {};

    constructor(private guestService: GuestService,
        private router: Router, private alertify: AlertifyService) {
            this.reservationParams.isNew = true;
            this.reservationParams.orderBy = 'Created';
        }

    resolve(route: ActivatedRouteSnapshot): Observable<IReservationList[]> {
        return this.guestService.getReservations(this.pageNumber, this.pageSize, this.reservationParams).catch(error => {
            this.alertify.error('Problem retrieving data', 5);
            this.router.navigate(['/be']);
            return Observable.of(null);
        });
    }
}
