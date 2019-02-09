import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertifyService } from './../../core/alertify.service';
import { HousekeepService } from './../../core/service/housekeep.service';

import { ITaxiList } from './../../_models/taxi';

@Injectable()
export class TaxiListResolver implements Resolve<ITaxiList[]> {
    pageSize = 10;
    pageNumber = 1;

    constructor(private housekeepService: HousekeepService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ITaxiList[]> {

        this.housekeepService.taxiParams = {};
        this.housekeepService.taxiParams.status = 'Pending,Processing';
        this.housekeepService.taxiParams.orderBy = 'Created';

        return this.housekeepService.getTaxis(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data', 5);
                this.router.navigate(['/dashboard']);
                return of(null);
            })
        );
    }
}
