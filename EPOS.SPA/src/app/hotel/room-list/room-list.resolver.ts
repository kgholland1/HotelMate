import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertifyService } from './../../core/alertify.service';
import { HotelService } from './../hotel.service';
import { IRoom } from './../../_models/room';

@Injectable()
export class RoomListResolver implements Resolve<IRoom[]> {
    pageSize = 10;
    pageNumber = 1;

    constructor(private hotelService: HotelService,
        private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IRoom[]> {
        return this.hotelService.getRooms(this.pageNumber, this.pageSize).pipe(
             catchError(error => {
                 this.alertify.error('Problem retrieving data', 5);
                 this.router.navigate(['/dashboard']);
                 return of(null);
             })
         );
     }

}
