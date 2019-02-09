import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../../core/auth.service';
import { AlertifyService } from './../../../core/alertify.service';

import { HubService } from './../../../core/hub.service';
import { INotificationCount } from './../../../_models/notificationCount';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent implements OnInit  {

  notificationCounter: INotificationCount;

  constructor(private router: Router,
    public authService: AuthService,
    private hubService: HubService,
    private alertify: AlertifyService ) { }

  ngOnInit() {
    this.refreshCounters();
    this.hubService.currentNotificationCount
      .subscribe(counter => this.notificationCounter = counter);
  }

  logout() {
    this.authService.logout();
    this.alertify.message('logged out', 5);
    this.router.navigate(['/login']);
  }

  loggedIn() {
    return this.authService.loggedIn();
  }
  totalReset() {
    this.hubService.initCount.totalNotifications = 0;
  }
  roomOrderReset() {
    this.router.navigate(['/dashboard']);
  }
  spaReset() {
    this.router.navigate(['/guests/current']);
  }
  reservationReset() {
    this.router.navigate(['/restaurant/reservations']);
  }
  houseKeepingReset() {
    this.router.navigate(['/restaurant/reservations']);
  }
  taxiReset() {
    this.router.navigate(['/restaurant/reservations']);
  }
  luggageReset() {
    this.router.navigate(['/restaurant/reservations']);
  }
  wakeupReset() {
    this.router.navigate(['/restaurant/reservations']);
  }
  refresh() {
    this.refreshCounters();
  }
  private refreshCounters() {
    this.hubService.NotificationCounters()
    .subscribe(
      (counter: INotificationCount) => {
        this.notificationCounter = counter;
      },
      (error: any) => {
          this.alertify.error(error, 5)
      }
    );
  }
}
