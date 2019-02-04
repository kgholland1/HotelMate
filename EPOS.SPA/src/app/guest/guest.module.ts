
import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';

import { GuestRoutingModule } from './guest-routing.module';

import { GuestListResolver } from './guest-list.resolver';

import { GuestListComponent } from './current/guest-list.component';


@NgModule({
  imports: [
    SharedModule,
    GuestRoutingModule
  ],
  declarations: [
    GuestListComponent
  ],
  providers: [
    GuestListResolver
  ]
})
export class GuestModule { }
