import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PaginatedResult } from './../_models/pagination';
import { environment } from 'environments/environment';
import { AuthService } from './../core/auth.service';

import { IPayment } from './../_models/payment';
import { IRestaurant } from './../_models/restaurant';
import { IOpenHour } from './../_models/OpenHour';

@Injectable()
export class SystemService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getPayments(page?, itemsPerPage?): Observable<any>  {
    const paginatedResult: PaginatedResult<IPayment[]> = new PaginatedResult<IPayment[]>();
    let params = new HttpParams();
    const hotelId = this.authService.currentUser.hotelId;

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }

    return this.http
    .get<IPayment[]>(this.baseUrl + 'hotels/' + hotelId + '/payments/', { observe: 'response', params })
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

  getPayment(id): Observable<IPayment> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http
      .get<IPayment>(this.baseUrl + 'hotels/' + hotelId +  '/payments/' + id);
  }

  createPayment(payment: IPayment): Observable<IPayment> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.post<IPayment>(this.baseUrl + 'hotels/' + hotelId +  '/payments/', payment);
  }

  updatePayment(payment: IPayment): Observable<void>  {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.put<void>(this.baseUrl + 'hotels/' + hotelId +  '/payments/' + payment.id, payment)
  }

  deletePayment(id: number): Observable<void> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.delete<void>(this.baseUrl + 'hotels/' + hotelId +  '/payments/' + id, {});
  }

  getRestaurants(page?, itemsPerPage?): Observable<any>  {
    const paginatedResult: PaginatedResult<IRestaurant[]> = new PaginatedResult<IRestaurant[]>();
    let params = new HttpParams();
    const hotelId = this.authService.currentUser.hotelId;

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }

    return this.http
    .get<IRestaurant[]>(this.baseUrl + 'hotels/' + hotelId + '/restaurants', { observe: 'response', params })
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
  getRestaurant(id): Observable<IRestaurant> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http
      .get<IRestaurant>(this.baseUrl + 'hotels/' + hotelId +  '/restaurants/' + id);
  }
  createRestaurant(restaurant: IRestaurant): Observable<IRestaurant> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.post<IRestaurant>(this.baseUrl + 'hotels/' + hotelId +  '/restaurants/', restaurant);
  }
  updateRestaurant(restaurant: IRestaurant): Observable<void>  {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.put<void>(this.baseUrl + 'hotels/' + hotelId +  '/restaurants/' + restaurant.id, restaurant)
  }
  deleteRestaurant(id: number): Observable<void> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.delete<void>(this.baseUrl + 'hotels/' + hotelId +  '/restaurants/' + id, {});
  }
  getOpenHours(page?, itemsPerPage?): Observable<any>  {
    const paginatedResult: PaginatedResult<IOpenHour[]> = new PaginatedResult<IOpenHour[]>();
    let params = new HttpParams();
    const hotelId = this.authService.currentUser.hotelId;

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }

    return this.http
    .get<IOpenHour[]>(this.baseUrl + 'hotels/' + hotelId + '/openhours', { observe: 'response', params })
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

  getOpenHour(id): Observable<IOpenHour> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http
      .get<IOpenHour>(this.baseUrl + 'hotels/' + hotelId +  '/openhours/' + id);
  }

  createOpenHour(openHour: IOpenHour): Observable<IOpenHour> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.post<IOpenHour>(this.baseUrl + 'hotels/' + hotelId +  '/openhours/', openHour);
  }
  updateOpenHour(openHour: IOpenHour): Observable<void>  {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.put<void>(this.baseUrl + 'hotels/' + hotelId +  '/openhours/' + openHour.id, openHour)
  }
  deleteOpenHour(id: number): Observable<void> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.delete<void>(this.baseUrl + 'hotels/' + hotelId +  '/openhours/' + id, {});
  }
}
