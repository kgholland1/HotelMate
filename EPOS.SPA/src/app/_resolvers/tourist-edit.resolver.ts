import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { HotelService } from '../_Services/hotel.service';
import { TouristPhoto } from '../_models/touristPhoto';


@Injectable()
export class TouristEditResolver implements Resolve<TouristPhoto> {

    constructor(private hotelService: HotelService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<TouristPhoto> {

        return this.hotelService.getTourist(route.params['id']).catch(error => {
            this.alertify.error('Problem retrieving data', 5);
            this.router.navigate(['/be']);
            return Observable.of(null);
        });

    }
}
