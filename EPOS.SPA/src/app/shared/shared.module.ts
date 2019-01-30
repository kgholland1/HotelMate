import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EscapeHtmlPipe } from './keep-html.pipe';
import { TruncatePipe } from './truncate.pipe';
import { HasRoleDirective } from './directives/hasRole.directive';
import { LoadingSpinnerComponent } from './loading-spinner.component';


// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { UiSwitchModule } from 'ngx-ui-switch';
import { QuillModule } from 'ngx-quill'
import { FileUploadModule } from 'ng2-file-upload';
import { NgxGalleryModule } from 'ngx-gallery';

// Import containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent,
  FeLayoutComponent
} from '../shared/containers';

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
} from '../shared/components';

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
} from '../shared/directives';
import { MessageModalComponent } from './message-modal.component';
import { EditPhotoComponent } from './edit-photo/edit-photo.component';


const APP_DIRECTIVES = [
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule, // because we use <router-outlet> and routerLink
    FormsModule,
    ReactiveFormsModule,
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
  ],
  exports: [
    ...APP_CONTAINERS,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    FileUploadModule,
    NgxGalleryModule,
    BsDropdownModule,
    TabsModule,
    AlertModule,
    PaginationModule,
    ModalModule,
    ButtonsModule,
    BsDatepickerModule,
    UiSwitchModule,
    ChartsModule,
    HasRoleDirective,
    EscapeHtmlPipe,
    TruncatePipe,
    LoadingSpinnerComponent,
    MessageModalComponent,
    EditPhotoComponent
  ],
  entryComponents: [MessageModalComponent],
  declarations: [
    ...APP_CONTAINERS,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES,
    HasRoleDirective,
    EscapeHtmlPipe,
    TruncatePipe,
    LoadingSpinnerComponent,
    MessageModalComponent,
    EditPhotoComponent
  ]
})
export class SharedModule { }
