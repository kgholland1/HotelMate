import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';

import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { AlertifyService } from './alertify.service';
import { AuthService } from './auth.service';
import { INotificationCount } from './../_models/notificationCount';


@Injectable({
  providedIn: 'root'
})
export class HubService {
  private _hubConnection: HubConnection | undefined;
  baseUrl = environment.apiUrl;

  initCount: INotificationCount = {
    totalNotifications: 0,
    roomOrders: 0,
    reservations: 0,
    houseKeeping: 0,
    taxis: 0,
    luggages: 0,
    wakeup: 0,
    spa: 0
  };
  notifyCount = new BehaviorSubject<INotificationCount>(this.initCount);
  currentNotificationCount = this.notifyCount.asObservable();

  constructor(private http: HttpClient,
    private alertify: AlertifyService,
    private authService: AuthService) {}

  public startConnection: any = () => {
    this._hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5000/notifications')
    .configureLogging(signalR.LogLevel.Information)
    .build();

    this._hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => {
        console.log('Error while starting connection: ' + err)
        console.log('Error while establishing connection, retrying...' + err);
        setTimeout(this.startConnection(), 5000);
      });
  }

  public addListener = () => {
    this._hubConnection.on('NewRequest', (messageReceived: any) => {
      console.log(messageReceived);

      const hotelId = this.authService.currentUser.hotelId;

      if (hotelId === messageReceived.hotelId) {
        this.populateCounts(messageReceived);
        this.changeNotificationCount(this.initCount);
        this.alertify.success(messageReceived.message, 5);
      }
    });
  }
  changeNotificationCount(newCount: INotificationCount) {
    this.notifyCount.next(newCount);
  }
  private populateCounts(messageReceived: any) {

    this.initCount.roomOrders = messageReceived.notificationCounters.orderCount;
    this.initCount.reservations = messageReceived.notificationCounters.reservationCount;
    this.initCount.houseKeeping = messageReceived.notificationCounters.houseKeepingCount;
    this.initCount.taxis = messageReceived.notificationCounters.taxiCount;
    this.initCount.luggages = messageReceived.notificationCounters.luggageCount;
    this.initCount.wakeup = messageReceived.notificationCounters.wakeupCount;
    this.initCount.spa = messageReceived.notificationCounters.spaCount;

    // add all notifications
    this.initCount.totalNotifications = (this.initCount.roomOrders + this.initCount.reservations +
      this.initCount.houseKeeping + this.initCount.taxis + this.initCount.luggages
      + this.initCount.wakeup + this.initCount.spa)
  }

  NotificationCounters(): Observable<INotificationCount> {
    const hotelId = this.authService.currentUser.hotelId;
    return this.http
      .get<any>(this.baseUrl + 'hotels/notification/' + hotelId)
      .pipe(
        map(response => {
          this.initCount.roomOrders = response.orderCount;
          this.initCount.reservations = response.reservationCount;
          this.initCount.houseKeeping = response.houseKeepingCount;
          this.initCount.taxis = response.taxiCount;
          this.initCount.luggages = response.luggageCount;
          this.initCount.wakeup = response.wakeupCount;
          this.initCount.spa = response.spaCount;
          this.initCount.totalNotifications = (this.initCount.roomOrders + this.initCount.reservations +
            this.initCount.houseKeeping + this.initCount.taxis + this.initCount.luggages
            + this.initCount.wakeup + this.initCount.spa)

          return this.initCount;
        })
    );
  }
}
