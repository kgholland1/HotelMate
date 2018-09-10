import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { HotelService } from '../_Services/hotel.service';
import { ITourist } from '../_models/tourist';

@Injectable()
export class TouristListResolver implements Resolve<ITourist[]> {
    pageSize = 10;
    pageNumber = 1;

    constructor(private hotelService: HotelService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ITourist[]> {
        return this.hotelService.getTourists(this.pageNumber, this.pageSize).catch(error => {
            this.alertify.error('Problem retrieving data', 5);
            this.router.navigate(['/be']);
            return Observable.of(null);
        });
    }
}
