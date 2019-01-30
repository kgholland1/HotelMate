import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertifyService } from './../core/alertify.service';
import { MenuService } from './menu.service';
import { IListMenu } from '../_models/menu';

@Injectable()
export class MenuListResolver implements Resolve<IListMenu[]> {
    pageSize = 10;
    pageNumber = 1;

    constructor(private menuService: MenuService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IListMenu[]> {
        return this.menuService.getMenus(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data', 5);
                this.router.navigate(['/dashboard']);
                return of(null);
            })
        );
    };

}
