import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../core/auth.guard';
import { FullLayoutComponent } from './../shared/containers/full-layout/full-layout.component';
import { ExtraListComponent } from './extra-list.component';
import { ExtraListResolver } from './extra-list.resolver';
import { CanDeactivateGuard } from './../core/can-deactivate.guard';
import { ExtraEditComponent } from './extra-edit.component';
import { CategoryListComponent } from './category-list.component';
import { CategoryListResolver } from './category-list.resolver';
import { CategoryEditComponent } from './category-edit.component';

const routes: Routes = [
  {
    path: 'extras',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Admin']},
    children: [
      { path: '', component: ExtraListComponent, resolve: {extra: ExtraListResolver} },
      { path: ':id/edit', component: ExtraEditComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  },
  {
    path: 'categories',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Admin']},
    children: [
      { path: '', component: CategoryListComponent, resolve: {category: CategoryListResolver} },
      { path: ':id/edit', component: CategoryEditComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
