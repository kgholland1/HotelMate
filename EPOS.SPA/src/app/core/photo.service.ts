import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';
import { environment } from 'environments/environment';
import { IPhoto } from './../_models/photo';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  setMainPhoto(id: number, photo: IPhoto) {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http
      .post(this.baseUrl + 'hotels/' + hotelId + '/photos/' + id  + '/setMain', photo);
  }

  deletePhoto(id: number) {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http
      .delete(this.baseUrl + 'hotels/' + hotelId + '/photos/' + id, {});
  }
}
