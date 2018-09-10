import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { KeepingService } from '../_Services/keeping.service';
import { IWakeupList } from '../_models/wakeup';


@Injectable()
export class WakeupListResolver implements Resolve<IWakeupList[]> {
    pageSize = 10;
    pageNumber = 1;
    wakeParams: any = {};

    constructor(private wakeService: KeepingService,
        private router: Router, private alertify: AlertifyService) {
            this.wakeParams.status = 'Pending,Processing';
            this.wakeParams.orderBy = 'Created';
        }

    resolve(route: ActivatedRouteSnapshot): Observable<IWakeupList[]> {
        return this.wakeService.getWakeups(this.pageNumber, this.pageSize, this.wakeParams).catch(error => {
            this.alertify.error('Problem retrieving data', 5);
            this.router.navigate(['/be']);
            return Observable.of(null);
        });
    }
}
