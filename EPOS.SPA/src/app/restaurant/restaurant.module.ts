import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';

import { RestaurantRoutingModule } from './restaurant-routing.module';

import { ReservationListResolver } from './reservation/reservation.resolver';

import { ReservationListComponent } from './reservation/reservation-list.component';
import { ReservationEditComponent } from './reservation/reservation-edit.component';

@NgModule({
  imports: [
    SharedModule,
    RestaurantRoutingModule
  ],
  declarations: [
    ReservationListComponent,
    ReservationEditComponent
  ],
  providers: [
    ReservationListResolver
  ]
})
export class RestaurantModule { }
