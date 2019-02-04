import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../core/auth.guard';
import { CanDeactivateGuard } from './../core/can-deactivate.guard';
import { FullLayoutComponent } from './../shared/containers/full-layout/full-layout.component';

import { ReservationListResolver } from './reservation/reservation.resolver';

import { ReservationListComponent } from './reservation/reservation-list.component';
import { ReservationEditComponent } from './reservation/reservation-edit.component';

const routes: Routes = [
  {
    path: 'reservations',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Staff', 'Supervisor', 'Manager', 'Admin']},
    children: [
      { path: '', component: ReservationListComponent,  resolve: {reservation: ReservationListResolver}},
      { path: ':id/edit', component: ReservationEditComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule { }
