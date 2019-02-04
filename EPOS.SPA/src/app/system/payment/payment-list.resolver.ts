import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertifyService } from './../../core/alertify.service';
import { SystemService } from './../system.service';
import { IPayment } from './../../_models/payment';




@Injectable()
export class PaymentListResolver implements Resolve<IPayment[]> {
    pageSize = 10;
    pageNumber = 1;

    constructor(private systemService: SystemService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IPayment[]> {
        return this.systemService.getPayments(this.pageNumber, this.pageSize).pipe(
             catchError(error => {
                 this.alertify.error('Problem retrieving data', 5);
                 this.router.navigate(['/dashboard']);
                 return of(null);
             })
         );
     }

}
