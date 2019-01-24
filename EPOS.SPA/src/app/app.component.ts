import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './core/auth.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private router: Router,
     private authService: AuthService,
    private jwtHelperService: JwtHelperService) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.decodedToken = this.jwtHelperService.decodeToken(token);
    }
    const user = localStorage.getItem('user');
    if (user) {
      this.authService.currentUser = JSON.parse(user)
    }
  }
}
