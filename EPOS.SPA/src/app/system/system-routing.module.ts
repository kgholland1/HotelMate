import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../core/auth.guard';
import { FullLayoutComponent } from './../shared/containers/full-layout/full-layout.component';
import { CanDeactivateGuard } from './../core/can-deactivate.guard';

import { PaymentListResolver } from './payment/payment-list.resolver';
import { RestaurantListResolver } from './restaurant/restaurant-list.resolver';
import { OpenHourListResolver } from './opentimes/opentimes-list.resolver';

import { PaymentListComponent } from './payment/payment-list.component';
import { PaymentEditComponent } from './payment/payment-edit.component';
import { RestaurantListComponent } from './restaurant/restaurant-list.component';
import { RestaurantEditComponent } from './restaurant/restaurant-edit.component';
import { OpentimesListComponent } from './opentimes/opentimes-list.component';
import { OpentimesEditComponent } from './opentimes/opentimes-edit.component';

const routes: Routes = [
  {
    path: 'payments',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Admin']},
    children: [
      { path: '', component: PaymentListComponent, resolve: {payment: PaymentListResolver}},
      { path: ':id/edit', component: PaymentEditComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  },
  {
    path: 'restaurants',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Admin']},
    children: [
      { path: '', component: RestaurantListComponent, resolve: {restaurant: RestaurantListResolver}},
      { path: ':id/edit', component: RestaurantEditComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  },
  {
    path: 'opentimes',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Admin']},
    children: [
      { path: '', component: OpentimesListComponent, resolve: {opentimes: OpenHourListResolver}},
      { path: ':id/edit', component: OpentimesEditComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
