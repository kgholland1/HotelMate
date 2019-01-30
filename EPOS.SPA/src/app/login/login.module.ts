import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { SignHotelComponent } from './sign-hotel.component';

@NgModule({
  imports: [
    LoginRoutingModule,
    SharedModule
  ],
  declarations: [LoginComponent, RegisterComponent, SignHotelComponent]
})
export class LoginModule { }
