import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../core/auth.guard';
import { CanDeactivateGuard } from './../core/can-deactivate.guard';

import { HotelEditResolver } from './hotel-edit.resolver';
import { RoomListResolver } from './room-list/room-list.resolver';
import { TouristListResolver } from './tourist/tourist-list.resolver';
import { TouristEditResolver } from './tourist/tourist-edit.resolver';

import { FullLayoutComponent } from './../shared/containers/full-layout/full-layout.component';
import { HotelDetailComponent } from './hotel-detail.component';
import { HotelEditComponent } from './hotel-edit.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomEditComponent } from './room-edit/room-edit.component';
import { ToristListComponent } from './tourist/torist-list.component';
import { TouristViewComponent } from './tourist/tourist-view.component';
import { TouristEditComponent } from './tourist/tourist-edit.component';

const routes: Routes = [
    {
      path: '',
      component: FullLayoutComponent,
      canActivate: [AuthGuard],
      data: {roles: ['Admin']},
      children: [
        { path: 'detail', component: HotelDetailComponent, resolve: {hotel: HotelEditResolver} },
        { path: 'edit', component: HotelEditComponent, resolve: {hotel: HotelEditResolver} }
      ]
    },
    {
      path: 'rooms',
      component: FullLayoutComponent,
      canActivate: [AuthGuard],
      data: {roles: ['Admin']},
      children: [
        { path: '', component: RoomListComponent, resolve: {room: RoomListResolver} },
        { path: ':id/edit', component: RoomEditComponent, canDeactivate: [CanDeactivateGuard]  }
      ]
    },
    {
      path: 'tourists',
      component: FullLayoutComponent,
      canActivate: [AuthGuard],
      data: {roles: ['Admin']},
      children: [
        { path: '', component: ToristListComponent, resolve: {tourist: TouristListResolver} },
        { path: ':id/view', component: TouristViewComponent, resolve: {tourist: TouristEditResolver} },
        { path: ':id/edit', component: TouristEditComponent, canDeactivate: [CanDeactivateGuard] }
      ]
    }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelRoutingModule { }
