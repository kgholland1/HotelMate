import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { IProfile } from '../_models/profile';
import { IUser, ISystemUser } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUser(id): Observable<IProfile> {
    return this.http
      .get<IProfile>(this.baseUrl + 'user/'  + id);
  }
  getSystemUser(id): Observable<IUser> {
    return this.http
      .get<IUser>(this.baseUrl + 'user/'  + id + '/Systemuser');
  }
  getSystemUsers() {
    return this.http.get(this.baseUrl + 'user/Users');
  }
updateProfile(profile: IProfile): Observable<void>  {

  return this.http.put<void>(this.baseUrl + 'user/profile', profile, {headers: new HttpHeaders()
      .set('Content-Type', 'application/json')})

}
changePassword(profile: any): Observable<void>  {

  return this.http.post<void>(this.baseUrl + 'user/changepassword', profile, {headers: new HttpHeaders()
      .set('Content-Type', 'application/json')})

}
updateUser(user: any): Observable<void>  {

  return this.http.put<void>(this.baseUrl + 'user/users/' +  user.Id, user, {headers: new HttpHeaders()
      .set('Content-Type', 'application/json')})

}
updateUserRoles(user: ISystemUser, roles: {}) {
  return this.http.post(this.baseUrl + 'user/editRoles/' + user.email, roles);
}
deleteUser(user: ISystemUser) {
  return this.http.delete(this.baseUrl + 'user/users/' + user.email, {});
  }
}
