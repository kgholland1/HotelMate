import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { HotelRoutingModule } from './hotel-routing.module';

import { HotelService } from './hotel.service';
import { TouristEditResolver } from './tourist/tourist-edit.resolver';
import { TouristListResolver } from './tourist/tourist-list.resolver';
import { RoomListResolver } from './room-list/room-list.resolver';

import { HotelDetailComponent } from './hotel-detail.component';
import { HotelEditResolver } from './hotel-edit.resolver';
import { HotelEditComponent } from './hotel-edit.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomEditComponent } from './room-edit/room-edit.component';
import { ToristListComponent } from './tourist/torist-list.component';
import { TouristViewComponent } from './tourist/tourist-view.component';
import { TouristEditComponent } from './tourist/tourist-edit.component';



@NgModule({
  imports: [
    SharedModule,
    HotelRoutingModule
  ],
  declarations: [
    HotelDetailComponent,
    HotelEditComponent,
    RoomListComponent,
    RoomEditComponent,
    ToristListComponent,
    TouristViewComponent,
    TouristEditComponent
  ],
  providers: [
    HotelService,
    HotelEditResolver,
    RoomListResolver,
    TouristListResolver,
    TouristEditResolver
  ],
})
export class HotelModule { }
