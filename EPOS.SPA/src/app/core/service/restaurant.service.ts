import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { AuthService } from './../auth.service';
import { PaginatedResult } from './../../_models/pagination';

import { IReservationList, IReservation } from './../../_models/reservation';
import { ReservationTimes } from './../../_models/reservationTimes';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  baseUrl = environment.apiUrl;

  // search properties
  reservationParams?: any = {};

  constructor(private http: HttpClient, private authService: AuthService) { }

  getReservations(page?, itemsPerPage?): Observable<PaginatedResult<IReservationList[]>>  {
    const paginatedResult: PaginatedResult<IReservationList[]> = new PaginatedResult<IReservationList[]>();
    const hotelId = this.authService.currentUser.hotelId;
    let params = new HttpParams();

    if (page !== null && itemsPerPage !== null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }

    if (this.reservationParams != null) {

      if (this.reservationParams.all) {
        params = params.append('All', this.reservationParams.all);
      } else {
        if (this.reservationParams.isNew) {
          params = params.append('IsNew', this.reservationParams.isNew);
        }
        if (this.reservationParams.roomNumber && this.reservationParams.roomNumber.length > 0) {
          params = params.append('RoomNumber', this.reservationParams.roomNumber);
        }
        if (this.reservationParams.fullname && this.reservationParams.fullname.length > 0) {
          params = params.append('Fullname', this.reservationParams.fullname);
        }
        if (this.reservationParams.email && this.reservationParams.email.length > 0) {
          params = params.append('Email', this.reservationParams.email);
        }
        if (this.reservationParams.phone && this.reservationParams.phone.length > 0) {
          params = params.append('Phone', this.reservationParams.phone);
        }
        if (this.reservationParams.reservationDate) {
          params = params.append('ReservationDate', this.reservationParams.reservationDate);
        }
      }

      params = params.append('OrderBy', this.reservationParams.orderBy);
    }

    return this.http
    .get<IReservationList[]>(this.baseUrl + 'reservation/hotels/' + hotelId , { observe: 'response', params })
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
  getReservation(Id): Observable<ReservationTimes> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http
      .get<ReservationTimes>(this.baseUrl + 'reservation/hotels/' + hotelId + '/' + Id + '/reservation');
  }
  updateReservation(reservation: IReservation): Observable<void>  {

    return this.http.put<void>(this.baseUrl + 'reservation/' + reservation.id, reservation);

  }
  setReservationAsDelete(reservationId: number) {
    return this.http.post(this.baseUrl + 'reservation/'  + reservationId  + '/setDelete', {});
  }
}
