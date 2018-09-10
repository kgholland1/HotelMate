import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { IHotel } from '../_models/hotel';
import { HotelService } from '../_Services/hotel.service';


@Injectable()
export class HotelEditResolver implements Resolve<IHotel> {

    constructor(private hotelService: HotelService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IHotel> {
        return this.hotelService.getHotel().catch(error => {
            this.alertify.error('Problem retrieving data', 5);
            this.router.navigate(['/be']);
            return Observable.of(null);
        });
    }
}
