import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import * as Raven from 'raven-js';
import { HttpClientModule } from '@angular/common/http';
Raven
  .config('https://0c4d488092c94f5c8f2fb50130556abf@sentry.io/1230570')
  .install();


// Import EPOS module
import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { LoginModule } from './login/login.module';
import { DashboardModule } from './dashboard/dashboard.module';

// EPOS Components
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    LoginModule,
    DashboardModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
  ],
 providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
