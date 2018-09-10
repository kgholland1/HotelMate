import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PaginatedResult } from '../_models/pagination';
import { AuthService } from './auth.service';
import { IPayment } from '../_models/payment';
import { IRestaurant } from '../_models/restaurant';
import { IOpenHour } from '../_models/OpenHour';

@Injectable()
export class SystemService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) { }

  getPayments(page?, itemsPerPage?): Observable<any>  {
    const paginatedResult: PaginatedResult<IPayment[]> = new PaginatedResult<IPayment[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
    .get<IPayment[]>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) + '/payments', { observe: 'response', params })
    .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
    });
  }
  getPayment(id): Observable<IPayment> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
      .get<IPayment>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) +  '/payments/' + id);
  }
  createPayment(payment: IPayment): Observable<IPayment> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http.post<IPayment>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) +  '/payments/',
      payment, {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }
  updatePayment(payment: IPayment): Observable<void>  {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http.put<void>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) +  '/payments/' + payment.id,
    payment, {headers: new HttpHeaders().set('Content-Type', 'application/json')})

  }
  deletePayment(id: number): Observable<void> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http.delete<void>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) +  '/payments/' + id, {});
    }

  getRestaurants(page?, itemsPerPage?): Observable<any>  {
      const paginatedResult: PaginatedResult<IRestaurant[]> = new PaginatedResult<IRestaurant[]>();
      let params = new HttpParams();

      if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
      }
      const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
      return this.http
      .get<IRestaurant[]>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) + '/restaurants', { observe: 'response', params })
      .map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }

          return paginatedResult;
      });
    }
  getRestaurant(id): Observable<IRestaurant> {
      const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
      return this.http
        .get<IRestaurant>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) +  '/restaurants/' + id);
    }
  createRestaurant(restaurant: IRestaurant): Observable<IRestaurant> {
      const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
      return this.http.post<IRestaurant>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) +  '/restaurants/',
      restaurant, {headers: new HttpHeaders().set('Content-Type', 'application/json')});
    }
  updateRestaurant(restaurant: IRestaurant): Observable<void>  {
      const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
      return this.http.put<void>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) +  '/restaurants/' + restaurant.id,
      restaurant, {headers: new HttpHeaders().set('Content-Type', 'application/json')})

  }
  deleteRestaurant(id: number): Observable<void> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http.delete<void>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) +  '/restaurants/' + id, {});
  }
  getOpenHours(page?, itemsPerPage?): Observable<any>  {
    const paginatedResult: PaginatedResult<IOpenHour[]> = new PaginatedResult<IOpenHour[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
    .get<IOpenHour[]>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) + '/openhours', { observe: 'response', params })
    .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
    });
  }
  getOpenHour(id): Observable<IOpenHour> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
      .get<IOpenHour>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) +  '/openhours/' + id);
  }
  createOpenHour(openHour: IOpenHour): Observable<IOpenHour> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http.post<IOpenHour>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) +  '/openhours/',
      openHour, {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }
  updateOpenHour(openHour: IOpenHour): Observable<void>  {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http.put<void>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) +  '/openhours/' + openHour.id,
        openHour, {headers: new HttpHeaders().set('Content-Type', 'application/json')})
  }
  deleteOpenHour(id: number): Observable<void> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http.delete<void>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) +  '/openhours/' + id, {});
  }
}
