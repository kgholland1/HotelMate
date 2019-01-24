import { AuthService } from './../../../core/auth.service';
import { AlertifyService } from './../../../core/alertify.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {

  constructor(private router: Router, public authService: AuthService,
    private alertify: AlertifyService ) { }

  logout() {
    this.authService.logout();
    this.alertify.message('logged out', 5);
    this.router.navigate(['/login']);
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  // delete later
  checkCode() {
    console.log('Notification dropdown')
  }
}
