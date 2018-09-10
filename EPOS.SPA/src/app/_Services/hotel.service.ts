import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { PaginatedResult } from '../_models/pagination';
import { IRoom } from '../_models/room';
import { ISignHotel } from '../_models/signHotel';
import { IHotel } from '../_models/hotel';
import { IPhoto } from '../_models/photo';
import { ITourist } from '../_models/tourist';
import { TouristPhoto } from '../_models/touristPhoto';

@Injectable()
export class HotelService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

getRooms(page?, itemsPerPage?): Observable<any>  {
    const paginatedResult: PaginatedResult<IRoom[]> = new PaginatedResult<IRoom[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }

    return this.http
    .get<IRoom[]>(this.baseUrl + 'room', { observe: 'response', params })
    .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
    });
}
getRoom(id): Observable<IRoom> {
    return this.http
      .get<IRoom>(this.baseUrl + 'room/' + id);
  }
createRoom(room: IRoom): Observable<IRoom> {
    return this.http.post<IRoom>(this.baseUrl + 'room', room, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')});
}
updateRoom(room: IRoom): Observable<void>  {

    return this.http.put<void>(this.baseUrl + 'room/' + room.id, room, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')})

  }
deleteRoom(id: number): Observable<void> {
return this.http.delete<void>(this.baseUrl + 'room/' + id, {});
}

getHotel(): Observable<IHotel> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
      .get<IHotel>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue));
  }
createHotel(hotel: ISignHotel): Observable<ISignHotel> {
    return this.http.post<ISignHotel>(this.baseUrl + 'hotels', hotel, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')});
}
updateHotel(hotel: IHotel): Observable<void>  {

    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http.put<void>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue), hotel, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')})

  }
  setMainPhoto(id: number, photo: IPhoto) {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
      .post(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) + '/photos/' + id  + '/setMain', photo,
      {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  deletePhoto(id: number) {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http
      .delete(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) + '/photos/' + id,
        {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }
  getTourists(page?, itemsPerPage?): Observable<any>  {
    const paginatedResult: PaginatedResult<ITourist[]> = new PaginatedResult<ITourist[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
    }

    return this.http
    .get<ITourist[]>(this.baseUrl + 'tourists', { observe: 'response', params })
    .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
    });
}
getTourist(id): Observable<TouristPhoto> {
    return this.http
      .get<TouristPhoto>(this.baseUrl + 'tourists/' + id);
  }

createTourist(tourist: ITourist): Observable<ITourist> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http.post<ITourist>(this.baseUrl + 'tourists/' + (+hotelClaim.claimValue), tourist, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')});
}
updateTourist(tourist: ITourist): Observable<void>  {

    return this.http.put<void>(this.baseUrl + 'tourists/' + tourist.id, tourist, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')})

}
deleteTourist(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + 'tourists/' + id, {});
    }
}
