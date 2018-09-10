import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
// import { AlertifyService } from './alertify.service';

@Injectable()
export class DialogService {
    // constructor(private alertify: AlertifyService) {}

    confirm(message?: string): Observable<boolean> {

    // const result = !!(this.alertify.confirm('Unsaved Changes', 'Are you sure you want to continue? Any unsaved changes will be lost',
    //  () => { }));

    const confirmation =  confirm(message || 'Are you sure you want to continue? Any unsaved changes will be lost');

    return Observable.of(confirmation);
    };

}
