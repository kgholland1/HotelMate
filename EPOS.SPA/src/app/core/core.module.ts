import { NgModule, Optional, SkipSelf, ErrorHandler  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import 3rd party components
import { JwtModule } from '@auth0/angular-jwt';

import { throwIfAlreadyLoaded } from './module-import-check';
import { ErrorInterceptorProvider } from './error.interceptor';
import { GlobalErrorHandler } from './globalError';
import { DialogComponent } from './dialog/dialog.component';


export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/api/auth']
      }
    }),
  ],
  declarations: [
    DialogComponent
  ],
  entryComponents: [DialogComponent],
  providers: [
    ErrorInterceptorProvider,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
  exports: [

    JwtModule
  ],
})
export class CoreModule {  constructor(
  @Optional()
  @SkipSelf()
  parentModule: CoreModule
) {
  throwIfAlreadyLoaded(parentModule, 'CoreModule');
} }
