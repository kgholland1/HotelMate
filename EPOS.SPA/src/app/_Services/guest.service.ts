import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthService } from './auth.service';
import { PaginatedResult } from '../_models/pagination';
import { IBookingList, IBooking } from '../_models/booking';
import { INote } from '../_models/note';
import { IReservationList, IReservation } from '../_models/reservation';
import { ReservationTimes } from '../_models/reservationTimes';

@Injectable()
export class GuestService {

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) { }

  getBookings(page?, itemsPerPage?, bookingParams?: any): Observable<any>  {
    const paginatedResult: PaginatedResult<IBookingList[]> = new PaginatedResult<IBookingList[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }

    if (bookingParams != null) {

      if (bookingParams.all) {
        params = params.append('All', bookingParams.all);
      } else {
        if (bookingParams.roomNumber && bookingParams.roomNumber.length > 0) {
          params = params.append('RoomNumber', bookingParams.roomNumber);
        }
        if (bookingParams.fullname && bookingParams.fullname.length > 0) {
          params = params.append('Fullname', bookingParams.fullname);
        }
        if (bookingParams.email && bookingParams.email.length > 0) {
          params = params.append('Email', bookingParams.email);
        }
        if (bookingParams.checkInDate) {
          params = params.append('CheckInDate', bookingParams.checkInDate);
        }
      }

      params = params.append('OrderBy', bookingParams.orderBy);
    }

    return this.http
    .get<IBookingList[]>(this.baseUrl + 'booking', { observe: 'response', params })
    .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
    });
  }
  getBooking(id): Observable<IBooking> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
      .get<IBooking>(this.baseUrl + 'booking/' + (+hotelClaim.claimValue) + '/' + id);
  }
  getNotes(bookingId): Observable<INote[]> {
    return this.http
      .get<INote[]>(this.baseUrl + 'note/' + bookingId);
  }
  createNote(note: INote): Observable<INote> {
    return this.http.post<INote>(this.baseUrl + 'note', note, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')});
  }
  setBookingAsDelete(bookingId: number) {
    return this.http
      .post(this.baseUrl + 'booking/'  + bookingId  + '/setDelete', {},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }
  getReservations(page?, itemsPerPage?, reservationParams?: any): Observable<any>  {
    const paginatedResult: PaginatedResult<IReservationList[]> = new PaginatedResult<IReservationList[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }

    if (reservationParams != null) {

      if (reservationParams.all) {
        params = params.append('All', reservationParams.all);
      } else {
        if (reservationParams.isNew) {
          params = params.append('IsNew', reservationParams.isNew);
        }
        if (reservationParams.roomNumber && reservationParams.roomNumber.length > 0) {
          params = params.append('RoomNumber', reservationParams.roomNumber);
        }
        if (reservationParams.fullname && reservationParams.fullname.length > 0) {
          params = params.append('Fullname', reservationParams.fullname);
        }
        if (reservationParams.email && reservationParams.email.length > 0) {
          params = params.append('Email', reservationParams.email);
        }
        if (reservationParams.phone && reservationParams.phone.length > 0) {
          params = params.append('Phone', reservationParams.phone);
        }
        if (reservationParams.reservationDate) {
          params = params.append('ReservationDate', reservationParams.reservationDate);
        }
      }

      params = params.append('OrderBy', reservationParams.orderBy);
    }
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
    .get<IReservationList[]>(this.baseUrl + 'reservation/' + (+hotelClaim.claimValue) , { observe: 'response', params })
    .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
    });
  }
  getReservation(Id): Observable<ReservationTimes> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
      .get<ReservationTimes>(this.baseUrl + 'reservation/' + (+hotelClaim.claimValue) + '/' + Id + '/reservation');
  }
  updateReservation(reservation: IReservation): Observable<void>  {

    return this.http.put<void>(this.baseUrl + 'reservation/' + reservation.id, reservation, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')})

  }
  setReservationAsDelete(reservationId: number) {
    return this.http
      .post(this.baseUrl + 'reservation/'  + reservationId  + '/setDelete', {},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }
}
