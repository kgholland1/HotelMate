import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
      intercept(
        req: HttpRequest<any>,
        next: HttpHandler
      ): Observable<HttpEvent<any>> {
        return next.handle(req).catch(error => {
          if (error instanceof HttpErrorResponse) {
            const applicationError = error.headers.get('Application-Error');
            if (applicationError) {
             return ErrorObservable.create(applicationError);
            }
//            console.log('http error' + ' ' + JSON.stringify(error))

            const devServerErr = JSON.stringify(error);
            const serverError = error.error;
            let modelStateErrors = '';
            if (serverError && typeof serverError === 'object') {
              for (const key in serverError) {
                if (serverError[key]) {
                  modelStateErrors += serverError[key] + '\n';
                }
              }
            }
 //           return ErrorObservable.create(modelStateErrors || serverError || 'Server error');
            return ErrorObservable.create(modelStateErrors || serverError || devServerErr);          }
        });
      }
    }


export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};
