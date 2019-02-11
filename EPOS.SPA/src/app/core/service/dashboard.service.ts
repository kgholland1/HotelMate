import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { AuthService } from './../auth.service';

import { IDashboardSummary } from 'app/_models/summary';
import { IDashboardGraph } from './../../_models/summary';
import { IRoomOrder } from './../../_models/roomOrder';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getDashboardSummary(): Observable<any> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http
      .get<IDashboardSummary>(this.baseUrl + 'hotels/' + hotelId + '/dashboard/summary');
  }

  getOrderGraph(): Observable<any> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http
      .get<IDashboardGraph>(this.baseUrl + 'hotels/' + hotelId + '/dashboard/orderGraph');
  }

  getRoomOrderLatest(): Observable<any> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http
      .get<IRoomOrder>(this.baseUrl + 'hotels/' + hotelId + '/dashboard/orderLatest');
  }
}
