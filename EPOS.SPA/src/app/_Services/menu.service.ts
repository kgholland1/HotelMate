import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PaginatedResult } from '../_models/pagination';
import { IExtra } from '../_models/extra';
import { ICategory } from '../_models/Category';
import { AuthService } from './auth.service';
import { IKeyValuePair } from '../_models/KeyValuePair';
import { IMenu, IMenuSave, IListMenu } from '../_models/menu';
import { IPhoto } from '../_models/photo';
// import { map, tap, catchError } from 'rxjs/operators';

@Injectable()
export class MenuService {
    baseUrl = environment.apiUrl;
constructor(private http: HttpClient, private authService: AuthService) { }

    getExtras(page?, itemsPerPage?, extraParams?: any): Observable<any>  {
        const paginatedResult: PaginatedResult<IExtra[]> = new PaginatedResult<IExtra[]>();
        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
        params = params.append('pageNumber', page);
        params = params.append('pageSize', itemsPerPage);
        }

        if (extraParams != null) {
            params = params.append('orderBy', extraParams.orderBy);
        }

        return this.http
        .get<IExtra[]>(this.baseUrl + 'extras', { observe: 'response', params })
        .map(response => {
            paginatedResult.result = response.body;
            if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
            }

            return paginatedResult;
        });
    }
    getExtra(id): Observable<IExtra> {
        return this.http
          .get<IExtra>(this.baseUrl + 'extras/' + id);
      }
    createExtra(extra: IExtra): Observable<IExtra> {
        return this.http.post<IExtra>(this.baseUrl + 'extras', extra, {headers: new HttpHeaders()
            .set('Content-Type', 'application/json')});
    }
    updateExtra(extra: IExtra): Observable<void>  {

        return this.http.put<void>(this.baseUrl + 'extras/' + extra.id, extra, {headers: new HttpHeaders()
            .set('Content-Type', 'application/json')})

      }
    deleteExtra(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + 'extras/' + id, {});
    }
    getCategories(page?, itemsPerPage?, categoryParams?: any): Observable<any>  {
        const paginatedResult: PaginatedResult<ICategory[]> = new PaginatedResult<ICategory[]>();
        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
        params = params.append('pageNumber', page);
        params = params.append('pageSize', itemsPerPage);
        }

        if (categoryParams != null) {
            params = params.append('orderBy', categoryParams.orderBy);
        }

        return this.http
        .get<ICategory[]>(this.baseUrl + 'category', { observe: 'response', params })
        .map(response => {
            paginatedResult.result = response.body;
            if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
            }

            return paginatedResult;
        });
    }
    getCatHeaders(): Observable<any> {
        return this.http
          .get<any>(this.baseUrl + 'catHeaders/');
      }
    getCategory(id): Observable<any> {
        return this.http
          .get<any>(this.baseUrl + 'category/' + id);
      }
    createCategory(category: ICategory): Observable<ICategory> {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    return this.http.post<ICategory>(this.baseUrl + 'category/' + (+hotelClaim.claimValue),
        category, {headers: new HttpHeaders().set('Content-Type', 'application/json')});
    }
    updateCategory(category: ICategory): Observable<void>  {
        return this.http.put<void>(this.baseUrl + 'category/'  + category.id,
        category, {headers: new HttpHeaders().set('Content-Type', 'application/json')})
      }
    deleteCategory(id: number): Observable<void> {
        return this.http.delete<void>(this.baseUrl + 'category/' + id, {});
    }
    getCatKeyValuePair(): Observable<any> {
        const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
        return this.http
          .get<any>(this.baseUrl + 'category/' + (+hotelClaim.claimValue) + '/KeyValue');
    }
    getExtraKeyValuePair(): Observable<any> {
        const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
        return this.http
          .get<any>(this.baseUrl + 'extras/' + (+hotelClaim.claimValue) + '/KeyValue');
    }

    getMenus(page?, itemsPerPage?, menuParams?: any): Observable<any>  {
        const paginatedResult: PaginatedResult<IListMenu[]> = new PaginatedResult<IListMenu[]>();
        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
        params = params.append('pageNumber', page);
        params = params.append('pageSize', itemsPerPage);
        }

        if (menuParams != null) {
            params = params.append('orderBy', menuParams.orderBy);
            params = params.append('categoryId', menuParams.categoryId);
        }

        return this.http
        .get<IListMenu[]>(this.baseUrl + 'menu', { observe: 'response', params })
        .map(response => {
            paginatedResult.result = response.body;
            if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
            }

            return paginatedResult;
        });
    }
    getMenu(id): Observable<IMenu> {
        return this.http
          .get<IMenu>(this.baseUrl + 'menu/' + id);
      }
    getMenuPhotos(id): Observable<IPhoto[]> {
        const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
        return this.http
          .get<IPhoto[]>(this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) + '/photos/' + id + '/Dish');
      }
    createMenu(menu: IMenuSave): Observable<IMenu> {
        const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
        return this.http.post<IMenu>(this.baseUrl + 'menu/' + (+hotelClaim.claimValue),
            menu, {headers: new HttpHeaders().set('Content-Type', 'application/json')});
    }
    updateMenu(menu: IMenuSave): Observable<void>  {
        return this.http.put<void>(this.baseUrl + 'menu/'  + menu.id,
        menu, {headers: new HttpHeaders().set('Content-Type', 'application/json')})
      }
    deleteMenu(id: number): Observable<void> {
        return this.http.delete<void>(this.baseUrl + 'menu/' + id, {});
    }

}
