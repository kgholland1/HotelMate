import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

import { UserClaim } from './../_models/userClaim';
import { IUser } from './../_models/user';
import { IRegister } from '../_models/register';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl;
  decodedToken: any;
  currentUser: IUser;

  userClaims: UserClaim[];

constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) { }

login(model: any) {
    return this.http.post(this.baseUrl + 'auth/login', model)
      .pipe(
        map((response: any) => {

          this.resetAuthObject();
          const authUser = response;

          if (authUser) {
            localStorage.setItem('token', authUser.token);
            this.decodedToken = this.jwtHelperService.decodeToken(authUser.token);

            this.currentUser = authUser.user;
            localStorage.setItem('user', JSON.stringify(authUser.user));
          }
        }));
  }
  resetAuthObject(): void {
    this.decodedToken = '';
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  register(user: IRegister) {
    return this.http.post(this.baseUrl + 'auth/register', user, {headers: new HttpHeaders()
      .set('Content-Type', 'application/json')})
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelperService.isTokenExpired(token);
  }

  logout(): void {
    this.resetAuthObject();
  }

  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const userRoles = this.decodedToken.role as Array<string>;
    allowedRoles.forEach(element => {
      if (userRoles.includes(element)) {
        isMatch = true;
        return;
      }
    });
    return isMatch;
  }
}

