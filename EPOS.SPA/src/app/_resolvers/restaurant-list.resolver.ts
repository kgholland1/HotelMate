import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/alertify.service';
import { SystemService } from '../_Services/system.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { IRestaurant } from '../_models/restaurant';



@Injectable()
export class RestaurantListResolver implements Resolve<IRestaurant[]> {
    pageSize = 10;
    pageNumber = 1;

    constructor(private systemService: SystemService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IRestaurant[]> {
        return this.systemService.getRestaurants(this.pageNumber, this.pageSize).catch(error => {
            this.alertify.error('Problem retrieving data', 5);
            this.router.navigate(['/be']);
            return Observable.of(null);
        });
    }
}
