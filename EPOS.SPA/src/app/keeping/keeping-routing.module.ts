import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../core/auth.guard';
import { CanDeactivateGuard } from './../core/can-deactivate.guard';
import { FullLayoutComponent } from './../shared/containers/full-layout/full-layout.component';

import { TaxiListResolver } from './taxi/taxi.resolver';

import { TaxiListComponent } from './taxi/taxi-list.component';



const routes: Routes = [
  {
    path: 'taxis',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Staff', 'Supervisor', 'Manager', 'Admin']},
    children: [
       { path: '', component: TaxiListComponent,  resolve: {taxi: TaxiListResolver}},
      // { path: ':id/edit', component: ReservationEditComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeepingRoutingModule { }
