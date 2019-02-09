import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';
import { PreloadSelectedModulesList } from './core/preload-strategy';

// Define the paths to the lazily loaded modules
const lazyPaths = {
  user: 'app/user/user.module#UserModule',
  menu: 'app/menu/menu.module#MenuModule',
  hotel: 'app/hotel/hotel.module#HotelModule',
  system: 'app/system/system.module#SystemModule',
  guest: 'app/guest/guest.module#GuestModule',
  restaurant: 'app/restaurant/restaurant.module#RestaurantModule',
  housekeep: 'app/keeping/keeping.module#KeepingModule'
};
export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'user',
    loadChildren: lazyPaths.user,
    data: { preload: true },
  },
  {
  path: 'guests',
  loadChildren: lazyPaths.guest,
  data: { preload: true },
  },
  {
  path: 'restaurant',
  loadChildren: lazyPaths.restaurant,
  data: { preload: true },
  },
  {
    path: 'housekeep',
    loadChildren: lazyPaths.housekeep,
    data: { preload: true },
    },
  {
  path: 'config/menu',
  loadChildren: lazyPaths.menu,
  },
  {
  path: 'hotel',
  loadChildren: lazyPaths.hotel,
  },
  {
  path: 'config/system',
  loadChildren: lazyPaths.system,
  },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: PreloadSelectedModulesList
    }) ], // , { enableTracing: true, preloadingStrategy: PreloadSelectedModulesList }
  exports: [ RouterModule ],
  providers: [PreloadSelectedModulesList]
})
export class AppRoutingModule {}
