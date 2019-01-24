
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { FullLayoutComponent } from '../shared/containers';
import { AuthGuard } from '../core/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Staff', 'Supervisor', 'Manager', 'Admin']},
    children: [
      { path: '', component: DashboardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }


