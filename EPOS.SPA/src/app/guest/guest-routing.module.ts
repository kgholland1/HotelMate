import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../core/auth.guard';
import { FullLayoutComponent } from './../shared/containers/full-layout/full-layout.component';

import { GuestListResolver } from './guest-list.resolver';

import { GuestListComponent } from './current/guest-list.component';

const routes: Routes = [
  {
    path: 'current',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Staff', 'Supervisor', 'Manager', 'Admin']},
    children: [
      { path: '', component: GuestListComponent,  resolve: {guest: GuestListResolver}},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoutingModule { }
