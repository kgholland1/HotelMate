import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { ITaxiList } from '../_models/taxi';
import { KeepingService } from '../_Services/keeping.service';


@Injectable()
export class TaxiListResolver implements Resolve<ITaxiList[]> {
    pageSize = 10;
    pageNumber = 1;
    taxiParams: any = {};

    constructor(private taxiService: KeepingService,
        private router: Router, private alertify: AlertifyService) {
            this.taxiParams.status = 'Pending,Processing';
            this.taxiParams.orderBy = 'Created';
        }

    resolve(route: ActivatedRouteSnapshot): Observable<ITaxiList[]> {
        return this.taxiService.getTaxis(this.pageNumber, this.pageSize, this.taxiParams).catch(error => {
            this.alertify.error('Problem retrieving data', 5);
            this.router.navigate(['/be']);
            return Observable.of(null);
        });
    }
}
