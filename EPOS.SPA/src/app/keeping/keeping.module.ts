
import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';

import { KeepingRoutingModule } from './keeping-routing.module';

import { TaxiListResolver } from './taxi/taxi.resolver';
import { TaxiListComponent } from './taxi/taxi-list.component';



@NgModule({
  imports: [
    SharedModule,
    KeepingRoutingModule
  ],
  declarations: [

  TaxiListComponent],
  providers: [
    TaxiListResolver
  ]
})
export class KeepingModule { }
