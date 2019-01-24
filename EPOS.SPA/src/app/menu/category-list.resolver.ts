import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertifyService } from './../core/alertify.service';
import { ICategory } from '../_models/Category';
import { MenuService } from './menu.service';

@Injectable()
export class CategoryListResolver implements Resolve<ICategory[]> {
    pageSize = 10;
    pageNumber = 1;

    constructor(private menuService: MenuService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ICategory[]> {
        return this.menuService.getCategories(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                console.log(`${error}. Heading back to dashboard`);
                this.alertify.error('Problem retrieving data', 5);
                this.router.navigate(['/dashboard']);
                return of(null);
            })
        );
    };

}
