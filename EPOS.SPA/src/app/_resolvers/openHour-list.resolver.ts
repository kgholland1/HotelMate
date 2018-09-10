import { IOpenHour } from './../_models/OpenHour';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/alertify.service';
import { SystemService } from '../_Services/system.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';



@Injectable()
export class OpenHourListResolver implements Resolve<IOpenHour[]> {
    pageSize = 10;
    pageNumber = 1;

    constructor(private systemService: SystemService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IOpenHour[]> {
        return this.systemService.getOpenHours(this.pageNumber, this.pageSize).catch(error => {
            this.alertify.error('Problem retrieving data', 5);
            this.router.navigate(['/be']);
            return Observable.of(null);
        });
    }
}
