import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';

// components
import { ProfileViewComponent } from './profile/profile-view.component';
import { ProfileResolver } from './profile/profile.resolver';
import { ProfileEditComponent } from './profile/profile-edit.component';
import { PasswordChangeComponent } from './profile/password-change.component';
import { UserListComponent } from './user-list.component';
import { UserListResolver } from './user-list.resolver';
import { RolesModalComponent } from './roles-modal.component';

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule
  ],
  providers: [ProfileResolver, UserListResolver],
  entryComponents: [RolesModalComponent],
  declarations: [
    ProfileViewComponent,
    ProfileEditComponent,
    PasswordChangeComponent,
    UserListComponent,
    RolesModalComponent
  ]
})
export class UserModule { }
