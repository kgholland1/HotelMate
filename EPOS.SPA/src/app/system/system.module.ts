import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { SystemRoutingModule } from './system-routing.module';

import { SystemService } from './system.service';
import { PaymentListResolver } from './payment/payment-list.resolver';
import { RestaurantListResolver } from './restaurant/restaurant-list.resolver';
import { OpenHourListResolver } from './opentimes/opentimes-list.resolver';

import { PaymentListComponent } from './payment/payment-list.component';
import { PaymentEditComponent } from './payment/payment-edit.component';
import { RestaurantListComponent } from './restaurant/restaurant-list.component';
import { RestaurantEditComponent } from './restaurant/restaurant-edit.component';
import { OpentimesListComponent } from './opentimes/opentimes-list.component';
import { OpentimesEditComponent } from './opentimes/opentimes-edit.component';


@NgModule({
  imports: [
    SharedModule,
    SystemRoutingModule
  ],
  declarations: [
    PaymentListComponent,
    PaymentEditComponent,
    RestaurantListComponent,
    RestaurantEditComponent,
    OpentimesListComponent,
    OpentimesEditComponent
  ],
  providers: [
    SystemService,
    PaymentListResolver,
    RestaurantListResolver,
    OpenHourListResolver
  ],
})
export class SystemModule { }
