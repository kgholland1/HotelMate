import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as Raven from 'raven-js';
import { HttpClientModule } from '@angular/common/http';
Raven
  .config('https://0c4d488092c94f5c8f2fb50130556abf@sentry.io/1230570')
  .install();

// Import containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent,
  FeLayoutComponent
} from './containers';

const APP_CONTAINERS = [
  FullLayoutComponent,
  SimpleLayoutComponent,
  FeLayoutComponent
]

// Import components
import {
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
} from './components';

const APP_COMPONENTS = [
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
]

// Import directives
import {
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './directives';

const APP_DIRECTIVES = [
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
]

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AlertModule } from 'ngx-bootstrap/alert';
import { JwtModule } from '@auth0/angular-jwt';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { UiSwitchModule } from 'ngx-ui-switch';
import { QuillModule } from 'ngx-quill'
import { FileUploadModule } from 'ng2-file-upload';
import { NgxGalleryModule } from 'ngx-gallery';

// EPOS Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ExtraComponent } from './views/menu/extra.component';
import { ExtraEditComponent } from './views/menu/extra-edit.component';
import { DialogComponent } from './views/dialog/dialog.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

// EPOS Services
import { AuthService } from './_Services/auth.service';
import { ErrorInterceptorProvider } from './_Shared/error.interceptor';
import { AlertifyService } from './_Services/alertify.service';
import { GlobalErrorHandler } from './_Shared/globalError';
import { GuestService } from './_Services/guest.service';
import { HasClaimDirective } from './_directives/has-claim.directive';
import { HotelService } from './_Services/hotel.service';
import { ExtraListResolver } from './_resolvers/extra-list.resolver';
import { SystemService } from './_Services/system.service';
import { TouristListResolver } from './_resolvers/tourist-list.resolver';
import { TouristEditResolver } from './_resolvers/tourist-edit.resolver';
import { RoomListResolver } from './_resolvers/room-list.resolver';
import { ProfileEditResolver } from './_resolvers/profile-edit.resolver';
import { CategoryListResolver } from './_resolvers/category-list.resolver';
import { GuestListResolver } from './_resolvers/guest-list.resolver';
import { ReservationListResolver } from './_resolvers/reservation-list.resolver';
import { KeepingService } from './_Services/keeping.service';
import { LuggageListResolver } from './_resolvers/luggage-list.resolver';
import { WakeupListResolver } from './_resolvers/wakeup-list.resolver';
import { RestaurantListResolver } from './_resolvers/restaurant-list.resolver';
import { OpenHourListResolver } from './_resolvers/openHour-list.resolver';

import { AuthGuard } from './_guards/auth.guard';
import { MenuService } from './_Services/menu.service';
import { HttpInterceptorProvider } from './_Shared/http.interceptor';
import { CanDeactivateGuard } from './_guards/can-deactivate-guard.service';
import { DialogService } from './_Services/dialog.service';

import { RoomComponent } from './views/hotel/room.component';
import { SignHotelComponent } from './views/hotel/sign-hotel.component';
import { EditHotelComponent } from './views/hotel/edit-hotel.component';
import { HotelEditResolver } from './_resolvers/hotel-edit.resolver';
import { EditPhotoComponent } from './views/edit-photo/edit-photo.component';
import { HotelDetailComponent } from './views/hotel/hotel-detail.component';
import { EscapeHtmlPipe } from './_pipes/keep-html.pipe';
import { RoomEditComponent } from './views/hotel/room-edit.component';
import { TouristListComponent } from './views/tourist/tourist-list.component';
import { TouristViewComponent } from './views/tourist/tourist-view.component';
import { TouristEditComponent } from './views/tourist/tourist-edit.component';
import { ProfileDetailComponent } from './views/register/profile-detail.component';
import { ProfileEditComponent } from './views/register/profile-edit.component';
import { PasswordChangeComponent } from './views/register/password-change.component';
import { UserListComponent } from './views/register/user-list.component';
import { UserListResolver } from './_resolvers/user-list.esolver';
import { UserEditComponent } from './views/register/user-edit.component';
import { PaymentListComponent } from './views/system/payment-list.component';
import { PaymentListResolver } from './_resolvers/payment-list.resolver';
import { PaymentEditComponent } from './views/system/payment-edit.component';
import { CategoryListComponent } from './views/menu/category-list.component';
import { TruncatePipe } from './_pipes/truncate.pipe';
import { CategoryEditComponent } from './views/menu/category-edit.component';
import { MenuListComponent } from './views/menu/menu-list.component';
import { MenuListResolver } from './_resolvers/menu-list.resolver';
import { MenuEditComponent } from './views/menu/menu-edit.component';
import { GuestListComponent } from './views/guest/guest-list.component';
import { GuestViewComponent } from './views/guest/guest-view.component';
import { NoteModalComponent } from './views/guest/note-modal.component';
import { ReservationListComponent } from './views/reservation/reservation-list.component';
import { ReservationEditComponent } from './views/reservation/reservation-edit.component';
import { TaxiListResolver } from './_resolvers/taxi-list.resolver';
import { TaxiListComponent } from './views/taxi/taxi-list.component';
import { TaxiEditComponent } from './views/taxi/taxi-edit.component';
import { LuggageListComponent } from './views/luggage/luggage-list.component';
import { LuggageEditComponent } from './views/luggage/luggage-edit.component';
import { WakeupListComponent } from './views/wake/wakeup-list.component';
import { WakeEditComponent } from './views/wake/wake-edit.component';
import { RestaurantListComponent } from './views/system/restaurant-list.component';
import { RestaurantEditComponent } from './views/system/restaurant-edit.component';
import { OpenHourListComponent } from './views/system/open-hour-list.component';
import { OpenHourEditComponent } from './views/system/open-hour-edit.component';




export function getAccessToken(): string {
  return localStorage.getItem('token');
}

export const jwtConfig = {
  tokenGetter: getAccessToken,
  whiteListedDomains: ['localhost:5000']
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    QuillModule,
    FileUploadModule,
    NgxGalleryModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    UiSwitchModule.forRoot({
      size: 'medium',
      color: '#ffc107',
      switchColor: '#36a9e1',
      defaultBgColor: '#f0f2f7',
      defaultBoColor : '#9da0a8',
    }),
    ChartsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: jwtConfig
    })
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES,
    DashboardComponent,
    DialogComponent,
    EditHotelComponent,
    EditPhotoComponent,
    EscapeHtmlPipe,
    ExtraComponent,
    ExtraEditComponent,
    HasClaimDirective,
    HotelDetailComponent,
    LoginComponent,
    PaymentListComponent,
    ProfileDetailComponent,
    ProfileEditComponent,
    RegisterComponent,
    RoomComponent,
    RoomEditComponent,
    SignHotelComponent,
    TouristListComponent,
    TouristViewComponent,
    TouristEditComponent,
    TruncatePipe,
    PasswordChangeComponent,
    UserListComponent,
    UserEditComponent,
    PaymentEditComponent,
    CategoryListComponent,
    CategoryEditComponent,
    MenuListComponent,
    MenuEditComponent,
    GuestListComponent,
    GuestViewComponent,
    NoteModalComponent,
    ReservationListComponent,
    ReservationEditComponent,
    TaxiListComponent,
    TaxiEditComponent,
    LuggageListComponent,
    LuggageEditComponent,
    WakeupListComponent,
    WakeEditComponent,
    RestaurantListComponent,
    RestaurantEditComponent,
    OpenHourListComponent,
    OpenHourEditComponent,
  ],
  entryComponents: [DialogComponent, NoteModalComponent],
  providers: [
    AlertifyService,
    AuthGuard,
    AuthService,
    CanDeactivateGuard,
    CategoryListResolver,
    DialogService,
    ErrorInterceptorProvider,
    ExtraListResolver,
    GuestService,
    HotelService,
    HotelEditResolver,
    HttpInterceptorProvider,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    MenuService,
    MenuListResolver,
    PaymentListResolver,
    ProfileEditResolver,
    RoomListResolver,
    SystemService,
    GuestListResolver,
    TouristListResolver,
    TouristEditResolver,
    UserListResolver,
    ReservationListResolver,
    KeepingService,
    TaxiListResolver,
    LuggageListResolver,
    WakeupListResolver,
    RestaurantListResolver,
    OpenHourListResolver
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
