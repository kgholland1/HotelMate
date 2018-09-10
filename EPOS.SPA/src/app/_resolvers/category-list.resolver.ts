import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { MenuService } from '../_Services/menu.service';
import { ICategory } from '../_models/Category';

@Injectable()
export class CategoryListResolver implements Resolve<ICategory[]> {
    pageSize = 10;
    pageNumber = 1;

    constructor(private menuService: MenuService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ICategory[]> {
        return this.menuService.getCategories(this.pageNumber, this.pageSize).catch(error => {
            this.alertify.error('Problem retrieving data', 5);
            this.router.navigate(['/be']);
            return Observable.of(null);
        });
    }
}
