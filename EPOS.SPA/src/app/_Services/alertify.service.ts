import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable()
export class AlertifyService {
  constructor() {}

  confirm(title: string, message: string, okCallback: () => any) {
    alertify.confirm( message, function(e) {
      if (e) {
        okCallback();
      } else {

      }
    }).setHeader(title);
  }


  success(message: string, waitFor: number) {
  //  alertify.set('notifier', 'position', 'top-right');
    alertify.success(message, waitFor);
  }

  error(message: string, waitFor: number) {
  //  alertify.set('notifier', 'position', 'top-right');
    alertify.error(message, waitFor);
  }

  warning(message: string, waitFor: number) {
  //  alertify.set('notifier', 'position', 'top-right');
    alertify.warning(message, waitFor);
  }

  message(message: string, waitFor: number) {
  //  alertify.set('notifier', 'position', 'top-right');
    alertify.message(message, waitFor);
  }
}

