import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_Services/auth.service';
import { AlertifyService } from '../../_Services/alertify.service';

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
