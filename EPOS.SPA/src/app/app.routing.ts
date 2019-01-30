import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';
import { PreloadSelectedModulesList } from './core/preload-strategy';

// Define the paths to the lazily loaded modules
const lazyPaths = {
  user: 'app/user/user.module#UserModule',
  menu: 'app/menu/menu.module#MenuModule',
  hotel: 'app/hotel/hotel.module#HotelModule',
};
export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'user',
    loadChildren: lazyPaths.user,
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
