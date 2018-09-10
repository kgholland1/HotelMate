import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { MenuService } from '../_Services/menu.service';
import { IExtra } from '../_models/extra';

@Injectable()
export class ExtraListResolver implements Resolve<IExtra[]> {
    pageSize = 10;
    pageNumber = 1;

    constructor(private extraService: MenuService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IExtra[]> {
        return this.extraService.getExtras(this.pageNumber, this.pageSize).catch(error => {
            this.alertify.error('Problem retrieving data', 5);
            this.router.navigate(['/be']);
            return Observable.of(null);
        });
    }
}
