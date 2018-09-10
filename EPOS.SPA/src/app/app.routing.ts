import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// Import Containers
import {
  FullLayoutComponent
} from './containers';

// EPOS Components
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuard } from './_guards/auth.guard';
import { ExtraComponent } from './views/menu/extra.component';
import { ExtraListResolver } from './_resolvers/extra-list.resolver';
import { ExtraEditComponent } from './views/menu/extra-edit.component';
import { CanDeactivateGuard } from './_guards/can-deactivate-guard.service';
import { RoomComponent } from './views/hotel/room.component';
import { RoomListResolver } from './_resolvers/room-list.resolver';
import { SignHotelComponent } from './views/hotel/sign-hotel.component';
import { EditHotelComponent } from './views/hotel/edit-hotel.component';
import { HotelEditResolver } from './_resolvers/hotel-edit.resolver';
import { HotelDetailComponent } from './views/hotel/hotel-detail.component';
import { RoomEditComponent } from './views/hotel/room-edit.component';
import { TouristListComponent } from './views/tourist/tourist-list.component';
import { TouristListResolver } from './_resolvers/tourist-list.resolver';
import { TouristViewComponent } from './views/tourist/tourist-view.component';
import { TouristEditResolver } from './_resolvers/tourist-edit.resolver';
import { TouristEditComponent } from './views/tourist/tourist-edit.component';
import { ProfileDetailComponent } from './views/register/profile-detail.component';
import { ProfileEditComponent } from './views/register/profile-edit.component';
import { ProfileEditResolver } from './_resolvers/profile-edit.resolver';
import { PasswordChangeComponent } from './views/register/password-change.component';
import { UserListComponent } from './views/register/user-list.component';
import { UserListResolver } from './_resolvers/user-list.esolver';
import { UserEditComponent } from './views/register/user-edit.component';
import { PaymentListComponent } from './views/system/payment-list.component';
import { PaymentListResolver } from './_resolvers/payment-list.resolver';
import { PaymentEditComponent } from './views/system/payment-edit.component';
import { CategoryListResolver } from './_resolvers/category-list.resolver';
import { CategoryListComponent } from './views/menu/category-list.component';
import { CategoryEditComponent } from './views/menu/category-edit.component';
import { MenuListComponent } from './views/menu/menu-list.component';
import { MenuListResolver } from './_resolvers/menu-list.resolver';
import { MenuEditComponent } from './views/menu/menu-edit.component';
import { GuestListComponent } from './views/guest/guest-list.component';
import { GuestListResolver } from './_resolvers/guest-list.resolver';
import { GuestViewComponent } from './views/guest/guest-view.component';
import { ReservationListResolver } from './_resolvers/reservation-list.resolver';
import { ReservationListComponent } from './views/reservation/reservation-list.component';
import { ReservationEditComponent } from './views/reservation/reservation-edit.component';
import { TaxiListResolver } from './_resolvers/taxi-list.resolver';
import { TaxiListComponent } from './views/taxi/taxi-list.component';
import { TaxiEditComponent } from './views/taxi/taxi-edit.component';
import { LuggageListResolver } from './_resolvers/luggage-list.resolver';
import { LuggageListComponent } from './views/luggage/luggage-list.component';
import { LuggageEditComponent } from './views/luggage/luggage-edit.component';
import { WakeupListComponent } from './views/wake/wakeup-list.component';
import { WakeupListResolver } from './_resolvers/wakeup-list.resolver';
import { WakeEditComponent } from './views/wake/wake-edit.component';
import { RestaurantListResolver } from './_resolvers/restaurant-list.resolver';
import { RestaurantListComponent } from './views/system/restaurant-list.component';
import { RestaurantEditComponent } from './views/system/restaurant-edit.component';
import { OpenHourListResolver } from './_resolvers/openHour-list.resolver';
import { OpenHourListComponent } from './views/system/open-hour-list.component';
import { OpenHourEditComponent } from './views/system/open-hour-edit.component';

export const appRoutes: Routes = [
  { path: 'be', component: FullLayoutComponent,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { claimType: 'canAccessBackend' } },
          { path: 'extras', component: ExtraComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessBackend' }, resolve: {extra: ExtraListResolver}},
          { path: 'restaurants', component: RestaurantListComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessBackend' }, resolve: {restaurant: RestaurantListResolver}},
          { path: 'restaurants/:id/edit', component: RestaurantEditComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard],
            data: { claimType: 'canAccessBackend' }},
          { path: 'openHours', component: OpenHourListComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessBackend' }, resolve: {openHour: OpenHourListResolver}},
          { path: 'openHours/:id/edit', component: OpenHourEditComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard],
            data: { claimType: 'canAccessBackend' }},
          { path: 'extraEdit/:id', component: ExtraEditComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard],
            data: { claimType: 'canAccessBackend' } },
          { path: 'categories', component: CategoryListComponent, canActivate: [AuthGuard], data: { claimType: 'canAccessBackend' },
            resolve: {category: CategoryListResolver}},
          { path: 'categories/:id/edit', component: CategoryEditComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard],
            data: { claimType: 'canAccessBackend' }},
          { path: 'menus', component: MenuListComponent, canActivate: [AuthGuard], data: { claimType: 'canAccessBackend' },
            resolve: {menu: MenuListResolver}},
          { path: 'menus/:id/edit', component: MenuEditComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard],
            data: { claimType: 'canAccessBackend' }},
          { path: 'rooms', component: RoomComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessBackend' }, resolve: {room: RoomListResolver}},
          { path: 'rooms/:id/edit', component: RoomEditComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard],
            data: { claimType: 'canAccessBackend' } },
          { path: 'hotel', component: HotelDetailComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessBackend' }, resolve: {hotel: HotelEditResolver}},
          { path: 'hotel/Edit', component: EditHotelComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard],
            data: { claimType: 'canAccessBackend' }, resolve: {hotel: HotelEditResolver}},
          { path: 'tourists', component: TouristListComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessBackend' }, resolve: {tourist: TouristListResolver}},
          { path: 'tourists/:id/view', component: TouristViewComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessBackend' }, resolve: {tourist: TouristEditResolver} },
          { path: 'tourists/:id/edit', component: TouristEditComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard],
            data: { claimType: 'canAccessBackend' }},
          { path: 'profile/view', component: ProfileDetailComponent, canActivate: [AuthGuard], data: { claimType: 'canAccessBackend' },
          resolve: {profile: ProfileEditResolver} },
          { path: 'profile/edit', component: ProfileEditComponent, canActivate: [AuthGuard], data: { claimType: 'canAccessBackend' },
          resolve: {profile: ProfileEditResolver}, canDeactivate: [CanDeactivateGuard] },
          { path: 'password/change', component: PasswordChangeComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessBackend' } },
          { path: 'users', component: UserListComponent, canActivate: [AuthGuard], data: { claimType: 'canAccessSecurity' },
            resolve: {users: UserListResolver} },
          { path: 'users/:id/edit', component: UserEditComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessSecurity' }, canDeactivate: [CanDeactivateGuard]},
          { path: 'payments', component: PaymentListComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessBackend' }, resolve: {payment: PaymentListResolver}},
          { path: 'payments/:id/edit', component: PaymentEditComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard],
            data: { claimType: 'canAccessBackend' }},
          { path: 'guests', component: GuestListComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessBackend' }, resolve: {guest: GuestListResolver}},
          { path: 'guests/:id/view', component: GuestViewComponent, canActivate: [AuthGuard], data: { claimType: 'canAccessBackend'} },
          { path: 'reservations', component: ReservationListComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessBackend' }, resolve: {reservation: ReservationListResolver}},
          { path: 'reservations/:id/edit', component: ReservationEditComponent, canActivate: [AuthGuard],
            canDeactivate: [CanDeactivateGuard], data: { claimType: 'canAccessBackend' }},
          { path: 'taxis', component: TaxiListComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessBackend' }, resolve: {taxi: TaxiListResolver}},
          { path: 'taxis/:id/edit', component: TaxiEditComponent, canActivate: [AuthGuard],
            canDeactivate: [CanDeactivateGuard], data: { claimType: 'canAccessBackend' }},
          { path: 'luggages', component: LuggageListComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessBackend' }, resolve: {luggage: LuggageListResolver}},
          { path: 'luggages/:id/edit', component: LuggageEditComponent, canActivate: [AuthGuard],
            canDeactivate: [CanDeactivateGuard], data: { claimType: 'canAccessBackend' }},
          { path: 'wakes', component: WakeupListComponent, canActivate: [AuthGuard],
            data: { claimType: 'canAccessBackend' }, resolve: {wake: WakeupListResolver}},
          { path: 'wakes/:id/edit', component: WakeEditComponent, canActivate: [AuthGuard],
            canDeactivate: [CanDeactivateGuard], data: { claimType: 'canAccessBackend' }},
        ]
  },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'signup', component: SignHotelComponent },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
