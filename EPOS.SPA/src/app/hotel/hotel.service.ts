import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PaginatedResult } from './../_models/pagination';
import { environment } from 'environments/environment';

import { AuthService } from './../core/auth.service';
import { IHotel } from './../_models/hotel';
import { IRoom } from './../_models/room';
import { ITourist } from './../_models/tourist';
import { TouristPhoto } from './../_models/touristPhoto';

@Injectable()
export class HotelService {
  baseUrl = environment.apiUrl;


  constructor(private http: HttpClient, private authService: AuthService) {}

  getHotel(): Observable<IHotel> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.get<IHotel>(this.baseUrl + 'hotels/' + hotelId);
  }

  updateHotel(hotel: IHotel): Observable<void>  {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.put<void>(this.baseUrl + 'hotels/' + hotelId, hotel)
  }
  getRooms(page?, itemsPerPage?): Observable<any>  {
    const paginatedResult: PaginatedResult<IRoom[]> = new PaginatedResult<IRoom[]>();
    const hotelId = this.authService.currentUser.hotelId;
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }

    return this.http
    .get<IRoom[]>(this.baseUrl + 'hotels/' + hotelId + '/rooms/', { observe: 'response', params })
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
  getRoom(id): Observable<IRoom> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.get<IRoom>(this.baseUrl + 'hotels/' + hotelId + '/rooms/' + id);
  }
  createRoom(room: IRoom): Observable<IRoom> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.post<IRoom>(this.baseUrl + 'hotels/' + hotelId + '/rooms', room);
  }
  updateRoom(room: IRoom): Observable<void>  {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.put<void>(this.baseUrl + 'hotels/' + hotelId + '/rooms/' + room.id, room)
  }
  deleteRoom(id: number): Observable<void> {
  const hotelId = this.authService.currentUser.hotelId;
  return this.http.delete<void>(this.baseUrl + 'hotels/' + hotelId + '/rooms/' + id, {});
  }
  getTourists(page?, itemsPerPage?): Observable<any>  {
    const paginatedResult: PaginatedResult<ITourist[]> = new PaginatedResult<ITourist[]>();
    const hotelId = this.authService.currentUser.hotelId;
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }

    return this.http
    .get<ITourist[]>(this.baseUrl + 'hotels/' + hotelId + '/tourists', { observe: 'response', params })
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
  getTourist(id): Observable<TouristPhoto> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.get<TouristPhoto>(this.baseUrl + 'hotels/' + hotelId + '/tourists/' + id);
  }
  createTourist(tourist: ITourist): Observable<ITourist> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.post<ITourist>(this.baseUrl + 'hotels/' + hotelId + '/tourists', tourist);
  }
  updateTourist(tourist: ITourist): Observable<void>  {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.put<void>(this.baseUrl + 'hotels/' + hotelId + '/tourists/' + tourist.id, tourist)
  }
  deleteTourist(id: number): Observable<void> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http.delete<void>(this.baseUrl + 'hotels/' + hotelId + '/tourists/' + id, {});
  }
}
