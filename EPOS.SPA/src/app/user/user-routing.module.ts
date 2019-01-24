import { CanDeactivateGuard } from './../core/can-deactivate.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullLayoutComponent } from '../shared/containers';
import { AuthGuard } from '../core/auth.guard';
import { ProfileViewComponent } from './profile/profile-view.component';
import { ProfileResolver } from './profile/profile.resolver';
import { ProfileEditComponent } from './profile/profile-edit.component';
import { PasswordChangeComponent } from './profile/password-change.component';
import { UserListComponent } from './user-list.component';
import { UserListResolver } from './user-list.resolver';

const routes: Routes = [
  {
    path: 'profile',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Staff', 'Supervisor', 'Manager', 'Admin']},
    children: [
      { path: 'view', component: ProfileViewComponent, resolve: {profile: ProfileResolver}  },
      { path: 'edit', component: ProfileEditComponent, resolve: {profile: ProfileResolver}, canDeactivate: [CanDeactivateGuard] },
      { path: 'password', component: PasswordChangeComponent, canDeactivate: [CanDeactivateGuard]  },
    ]
  },
  {
    path: 'list',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Admin']},
    children: [
      { path: '', component: UserListComponent, resolve: {users: UserListResolver}  },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
