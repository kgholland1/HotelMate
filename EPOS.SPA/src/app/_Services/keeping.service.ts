import { IWakeup } from './../_models/wakeup';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthService } from './auth.service';
import { PaginatedResult } from '../_models/pagination';
import { ITaxiList, ITaxi } from '../_models/taxi';
import { TaxiTimes } from '../_models/taxiTimes';
import { ILuggageList, ILuggage } from '../_models/luggage';
import { LuggageTimes } from '../_models/luggageTimes';
import { IWakeupList } from '../_models/wakeup';

@Injectable()
export class KeepingService {

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) { }

  getTaxis(page?, itemsPerPage?, taxiParams?: any): Observable<any>  {
    const paginatedResult: PaginatedResult<ITaxiList[]> = new PaginatedResult<ITaxiList[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }

    if (taxiParams != null) {

      if (taxiParams.all) {
        params = params.append('All', taxiParams.all);
      } else {
        if (taxiParams.status && taxiParams.status.length > 0) {
          params = params.append('Status', taxiParams.status);
        }
        if (taxiParams.roomNumber && taxiParams.roomNumber.length > 0) {
          params = params.append('RoomNumber', taxiParams.roomNumber);
        }
        if (taxiParams.fullname && taxiParams.fullname.length > 0) {
          params = params.append('Fullname', taxiParams.fullname);
        }
        if (taxiParams.email && taxiParams.email.length > 0) {
          params = params.append('Email', taxiParams.email);
        }
        if (taxiParams.phone && taxiParams.phone.length > 0) {
          params = params.append('Phone', taxiParams.phone);
        }
        if (taxiParams.bookingDate) {
          params = params.append('BookingDate', taxiParams.bookingDate);
        }
      }

      params = params.append('OrderBy', taxiParams.orderBy);
    }
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
    .get<ITaxiList[]>(this.baseUrl + 'taxi/' + (+hotelClaim.claimValue) , { observe: 'response', params })
    .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
    });
  }
  getTaxi(Id): Observable<TaxiTimes> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
      .get<TaxiTimes>(this.baseUrl + 'taxi/' + (+hotelClaim.claimValue) + '/' + Id + '/taxi');
  }
  updateTaxi(taxi: ITaxi): Observable<void>  {

    return this.http.put<void>(this.baseUrl + 'taxi/' + taxi.id, taxi, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')})

  }
  setTaxiAsDelete(taxiId: number) {
    return this.http
      .post(this.baseUrl + 'taxi/'  + taxiId  + '/setDelete', {},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }
  getLuggages(page?, itemsPerPage?, luggageParams?: any): Observable<any>  {
    const paginatedResult: PaginatedResult<ILuggageList[]> = new PaginatedResult<ILuggageList[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }

    if (luggageParams != null) {

      if (luggageParams.all) {
        params = params.append('All', luggageParams.all);
      } else {
        if (luggageParams.status && luggageParams.status.length > 0) {
          params = params.append('Status', luggageParams.status);
        }
        if (luggageParams.roomNumber && luggageParams.roomNumber.length > 0) {
          params = params.append('RoomNumber', luggageParams.roomNumber);
        }
        if (luggageParams.fullname && luggageParams.fullname.length > 0) {
          params = params.append('Fullname', luggageParams.fullname);
        }
        if (luggageParams.email && luggageParams.email.length > 0) {
          params = params.append('Email', luggageParams.email);
        }
        if (luggageParams.phone && luggageParams.phone.length > 0) {
          params = params.append('Phone', luggageParams.phone);
        }
        if (luggageParams.bookingDate) {
          params = params.append('BookingDate', luggageParams.bookingDate);
        }
      }

      params = params.append('OrderBy', luggageParams.orderBy);
    }
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
    .get<ILuggageList[]>(this.baseUrl + 'luggage/' + (+hotelClaim.claimValue) , { observe: 'response', params })
    .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
    });
  }
  getLuggage(Id): Observable<LuggageTimes> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
      .get<LuggageTimes>(this.baseUrl + 'luggage/' + (+hotelClaim.claimValue) + '/' + Id + '/luggage');
  }
  updateLuggage(luggage: ILuggage): Observable<void>  {

    return this.http.put<void>(this.baseUrl + 'luggage/' + luggage.id, luggage, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')})

  }
  setLuggageAsDelete(luggageId: number) {
    return this.http
      .post(this.baseUrl + 'luggage/'  + luggageId  + '/setDelete', {},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }
  getWakeups(page?, itemsPerPage?, wakeParams?: any): Observable<any>  {
    const paginatedResult: PaginatedResult<IWakeupList[]> = new PaginatedResult<IWakeupList[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (wakeParams != null) {

      if (wakeParams.all) {
        params = params.append('All', wakeParams.all);
      } else {
        if (wakeParams.status && wakeParams.status.length > 0) {
          params = params.append('Status', wakeParams.status);
        }
        if (wakeParams.roomNumber && wakeParams.roomNumber.length > 0) {
          params = params.append('RoomNumber', wakeParams.roomNumber);
        }
        if (wakeParams.fullname && wakeParams.fullname.length > 0) {
          params = params.append('Fullname', wakeParams.fullname);
        }
        if (wakeParams.email && wakeParams.email.length > 0) {
          params = params.append('Email', wakeParams.email);
        }
        if (wakeParams.phone && wakeParams.phone.length > 0) {
          params = params.append('Phone', wakeParams.phone);
        }
        if (wakeParams.bookingDate) {
          params = params.append('BookingDate', wakeParams.bookingDate);
        }
      }

      params = params.append('OrderBy', wakeParams.orderBy);
    }
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
    .get<ILuggageList[]>(this.baseUrl + 'wake/' + (+hotelClaim.claimValue) , { observe: 'response', params })
    .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
    });
  }
  getWake(Id): Observable<IWakeup> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
      .get<IWakeup>(this.baseUrl + 'wake/' + (+hotelClaim.claimValue) + '/' + Id);
  }
  updateWakeup(wakeUp: IWakeup): Observable<void>  {

    return this.http.put<void>(this.baseUrl + 'wake/' + wakeUp.id, wakeUp, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')})

  }
  setWakeUpAsDelete(wakeId: number) {
    return this.http
      .post(this.baseUrl + 'wake/'  + wakeId  + '/setDelete', {},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }
}
