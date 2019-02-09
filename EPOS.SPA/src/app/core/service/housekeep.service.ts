import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { AuthService } from './../auth.service';
import { PaginatedResult } from './../../_models/pagination';

import { ITaxiList } from './../../_models/taxi';

@Injectable({
  providedIn: 'root'
})
export class HousekeepService {
  baseUrl = environment.apiUrl;

  // search properties
  taxiParams?: any = {};

  constructor(private http: HttpClient, private authService: AuthService) { }

  getTaxis(page?, itemsPerPage?): Observable<PaginatedResult<ITaxiList[]>>   {
    const paginatedResult: PaginatedResult<ITaxiList[]> = new PaginatedResult<ITaxiList[]>();
    const hotelId = this.authService.currentUser.hotelId;
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }

    if (this.taxiParams != null) {

      if (this.taxiParams.all) {
        params = params.append('All', this.taxiParams.all);
      } else {
        if (this.taxiParams.status && this.taxiParams.status.length > 0) {
          params = params.append('Status', this.taxiParams.status);
        }
        if (this.taxiParams.roomNumber && this.taxiParams.roomNumber.length > 0) {
          params = params.append('RoomNumber', this.taxiParams.roomNumber);
        }
        if (this.taxiParams.fullname && this.taxiParams.fullname.length > 0) {
          params = params.append('Fullname', this.taxiParams.fullname);
        }
        if (this.taxiParams.email && this.taxiParams.email.length > 0) {
          params = params.append('Email', this.taxiParams.email);
        }
        if (this.taxiParams.phone && this.taxiParams.phone.length > 0) {
          params = params.append('Phone', this.taxiParams.phone);
        }
        if (this.taxiParams.bookingDate) {
          params = params.append('BookingDate', this.taxiParams.bookingDate);
        }
      }

      params = params.append('OrderBy', this.taxiParams.orderBy);
    }

    return this.http
    .get<ITaxiList[]>(this.baseUrl + 'taxi/hotels/' + hotelId , { observe: 'response', params })
    .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
    );
  }
}
