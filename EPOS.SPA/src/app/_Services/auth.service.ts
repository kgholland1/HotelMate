import { IRegister } from '../_models/register';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthUser } from '../_models/AuthUser';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserClaim } from '../_models/userClaim';
import { tap } from 'rxjs/operators';
import { IProfile } from '../_models/profile';
import { IUser } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
// import { map, tap, catchError } from 'rxjs/operators';

@Injectable()
export class AuthService {
    baseUrl = environment.apiUrl;
    userToken: any;
    decodedToken: any;
    userClaims: UserClaim[];

  constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) { }

  login(model: any) {
      return this.http.post<AuthUser>(this.baseUrl + 'auth/login', model,  {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')})
        .pipe(
          tap(authUser => {

            this.resetAuthObject();

            if (authUser) {
              localStorage.setItem('token', authUser.tokenString);
              this.decodedToken = this.jwtHelperService.decodeToken(authUser.tokenString);
              this.userToken = authUser.tokenString;

              this.userClaims = authUser.userClaims;
              localStorage.setItem('userclaims', JSON.stringify(this.userClaims));
            }
          }));
    }
    resetAuthObject(): void {
      this.userToken = '';
      this.userClaims = [];
      this.decodedToken = '';
      localStorage.removeItem('userclaims');
      localStorage.removeItem('token');
    }

    register(user: IRegister) {
      return this.http.post(this.baseUrl + 'auth/register', user, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')})
    }
  // register(user: IRegister) {
  //   return this.http.post(this.baseUrl + 'auth/register', user, {headers: new HttpHeaders()
  //     .set('Content-Type', 'application/json')})
  //     .pipe(
  //       catchError(err => this.handleError(err))
  //     );
    // }
    loggedIn() {
      const token = this.jwtHelperService.tokenGetter();

      if (!token) {
        return false;
      }

      return !this.jwtHelperService.isTokenExpired(token);
    }

    logout(): void {
      this.resetAuthObject();
    }
  // This method can be called a couple of different ways
  // *hasClaim="'claimType'"  // Assumes claimValue is true
  // *hasClaim="'claimType:value'"  // Compares claimValue to value
  // *hasClaim="['claimType1','claimType2:value','claimType3']"
    hasClaim(claimType: any, claimValue?: any) {
      let ret = false;

      // See if an array of values was passed in.
      if (typeof claimType === 'string') {
        ret = this.isClaimValid(claimType, claimValue);
      } else {
        const claims: string[] = claimType;
        if (claims) {
          for (let index = 0; index < claims.length; index++) {
            ret = this.isClaimValid(claims[index]);
            // If one is successful, then let them in
            if (ret) {
              break;
            }
          }
        }
      }

      return ret;
    }
    private isClaimValid(claimType: string, claimValue?: string): boolean {
      let ret = false;

      if (this.userClaims) {
        // See if the claim type has a value
        // *hasClaim="'claimType:value'"
        if (claimType.indexOf(':') >= 0) {
          const words: string[] = claimType.split(':');
          claimType = words[0].toLowerCase();
          claimValue = words[1];
        } else {
          claimType = claimType.toLowerCase();
          // Either get the claim value, or assume 'true'
          claimValue = claimValue ? claimValue : 'true';
        }
        // Attempt to find the claim
        ret = this.userClaims.find(c =>
          c.claimType.toLowerCase() === claimType &&
          c.claimValue === claimValue) != null;
      }

      return ret;
    }
    private handleError(error: any) {
      const applicationError = error.headers.get('Application-Error');
      if (applicationError) {
        return Observable.throw(applicationError);
      }

      const serverError = error.error;
      let modelStateErrors = '';
      if (serverError && typeof serverError === 'object') {
        for (const key in serverError) {
          if (serverError[key]) {
            modelStateErrors += serverError[key] + '\n';
          }
        }
      }

      return Observable.throw(
        modelStateErrors || 'Server error'
      );
    }
    getUser(id): Observable<IProfile> {
      return this.http
        .get<IProfile>(this.baseUrl + 'auth/'  + id);
    }
    getSystemUser(id): Observable<IUser> {
      return this.http
        .get<IUser>(this.baseUrl + 'auth/'  + id + '/Systemuser');
    }
    getUsers(page?, itemsPerPage?): Observable<any>  {
      const paginatedResult: PaginatedResult<IUser[]> = new PaginatedResult<IUser[]>();
      let params = new HttpParams();

      if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
      }

      return this.http
      .get<IUser[]>(this.baseUrl + 'auth/Users', { observe: 'response', params })
      .map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }

          return paginatedResult;
      });
  }
  updateProfile(profile: IProfile): Observable<void>  {

    return this.http.put<void>(this.baseUrl + 'auth/profile', profile, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')})

  }
  changePassword(profile: any): Observable<void>  {

    return this.http.post<void>(this.baseUrl + 'auth/changepassword', profile, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')})

  }
  updateUser(user: any): Observable<void>  {

    return this.http.put<void>(this.baseUrl + 'auth/users/' +  user.Id, user, {headers: new HttpHeaders()
        .set('Content-Type', 'application/json')})

  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + 'auth/users/' + id, {});
    }
}



