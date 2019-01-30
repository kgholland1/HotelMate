import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';

import { MenuRoutingModule } from './menu-routing.module';
import { ExtraListComponent } from './extra-list.component';
import { MenuService } from './menu.service';
import { ExtraListResolver } from './extra-list.resolver';
import { ExtraEditComponent } from './extra-edit.component';
import { CategoryListComponent } from './category-list.component';
import { CategoryListResolver } from './category-list.resolver';
import { CategoryEditComponent } from './category-edit.component';
import { MenuListComponent } from './menu-list.component';
import { MenuListResolver } from './menu-list.resolver';
import { MenuEditComponent } from './menu-edit.component';

@NgModule({
  imports: [
    SharedModule,
    MenuRoutingModule
  ],
  declarations: [
    ExtraListComponent,
    ExtraEditComponent,
    CategoryListComponent,
    CategoryEditComponent,
    MenuListComponent,
    MenuEditComponent
  ],
  providers: [
    MenuService,
    ExtraListResolver,
    CategoryListResolver,
    MenuListResolver
  ],
})
export class MenuModule { }
