import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { KeepingService } from '../_Services/keeping.service';
import { ILuggageList } from '../_models/luggage';


@Injectable()
export class LuggageListResolver implements Resolve<ILuggageList[]> {
    pageSize = 10;
    pageNumber = 1;
    luggageParams: any = {};

    constructor(private luggageService: KeepingService,
        private router: Router, private alertify: AlertifyService) {
            this.luggageParams.status = 'Pending,Processing';
            this.luggageParams.orderBy = 'Created';
        }

    resolve(route: ActivatedRouteSnapshot): Observable<ILuggageList[]> {
        return this.luggageService.getLuggages(this.pageNumber, this.pageSize, this.luggageParams).catch(error => {
            this.alertify.error('Problem retrieving data', 5);
            this.router.navigate(['/be']);
            return Observable.of(null);
        });
    }
}
