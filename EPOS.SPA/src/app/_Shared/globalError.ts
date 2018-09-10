import { ErrorHandler, Inject, NgZone, isDevMode } from '@angular/core';
import * as Raven from 'raven-js';

import { AlertifyService } from '../_Services/alertify.service';

export class GlobalErrorHandler implements ErrorHandler {
  constructor(private ngZone: NgZone, @Inject(AlertifyService) private alertify: AlertifyService) {
  }

  handleError(error: any): void {

    if (!isDevMode()) {
        Raven.captureException(error.originalError || error);
    }

    this.ngZone.run(() => {
      const message = error ? JSON.stringify(error) : 'An error occurred. Please try again.';
//     console.log('global error' + ' ' + JSON.stringify(error))
        this.alertify.error(message, 5);
      });
  }
}
