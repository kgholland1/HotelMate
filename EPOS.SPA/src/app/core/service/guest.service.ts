import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { AuthService } from './../auth.service';

import { PaginatedResult } from './../../_models/pagination';
import { IBookingList } from './../../_models/booking';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  baseUrl = environment.apiUrl;

  // search properties
  bookingParams?: any = {};

  constructor(private http: HttpClient, private authService: AuthService) { }

  getBookings(page?, itemsPerPage?): Observable<any>  {
    const paginatedResult: PaginatedResult<IBookingList[]> = new PaginatedResult<IBookingList[]>();
    const hotelId = this.authService.currentUser.hotelId;
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }

    if (this.bookingParams !== null) {

      if (this.bookingParams.all) {
        params = params.append('All', this.bookingParams.all);
      } else {
        if (this.bookingParams.roomNumber && this.bookingParams.roomNumber.length > 0) {
          params = params.append('RoomNumber', this.bookingParams.roomNumber);
        }
        if (this.bookingParams.fullname && this.bookingParams.fullname.length > 0) {
          params = params.append('Fullname', this.bookingParams.fullname);
        }
        if (this.bookingParams.email && this.bookingParams.email.length > 0) {
          params = params.append('Email', this.bookingParams.email);
        }
        if (this.bookingParams.checkInDate) {
          params = params.append('CheckInDate', this.bookingParams.checkInDate);
        }
      }

      params = params.append('OrderBy', this.bookingParams.orderBy);
    }

    return this.http
    .get<IBookingList[]>(this.baseUrl + 'booking/hotels/' + hotelId , { observe: 'response', params })
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
