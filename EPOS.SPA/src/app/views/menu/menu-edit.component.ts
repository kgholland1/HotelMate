import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IMenuSave, IMenu } from '../../_models/menu';
import { FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChildren, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { IKeyValuePair } from '../../_models/KeyValuePair';
import { GenericValidator } from '../../_shared/generic-validator';
import { MenuService } from '../../_Services/menu.service';
import { AlertifyService } from '../../_Services/alertify.service';
import { IPhoto } from '../../_models/photo';
import * as _ from 'underscore';
import { NumberValidators } from '../../_Shared/number.validator';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.scss']
})
export class MenuEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Menu Edit';
  errorMessage: string;
  mainForm: FormGroup;
  categories: IKeyValuePair[] = [];
  extras: IKeyValuePair[] = [];
  photos: IPhoto[] = [];
  allergyList = [{value: 0, display: 'None'}, {value: 1, display: 'Pepper'}, {value: 2, display: 'Vegetarian'},
    {value: 3, display: 'Nuts'}, {value: 4, display: 'PepperVegetarian'}, {value: 5, display: 'PepperNuts'},
    {value: 6, display: 'VegetarianNuts'}, {value: 7, display: 'PepperVegetarianNuts'}];

  menu: IMenuSave = {
    id: 0,
    categoryId: 0,
    menuCode: '',
    menuSortNumber: 0,
    menuName: '',
    menuSubName: '',
    shortDesc: '',
    menuDesc: '',
    unitPrice: 0,
    menuImageType: 0,
    showExtras: false,
    menuExtras: []
  };
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private sub: Subscription;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
    private alertify: AlertifyService) {

      this.validationMessages = {
        categoryId: {
            required: 'Please select a category.'
         },
         unitPrice: {
          required: 'Please enter a unit price.',
          range: 'Unit Price must be between 0.00 (lowest) and 500.00 (highest).'
         },
         menuName: {
          required: 'Please enter a menu name.'
       }
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
     }

     ngOnInit() {
      this.mainForm = this.fb.group({
        categoryId:  ['', Validators.required],
        menuCode: '',
        menuSortNumber: 0,
        menuName:  ['', Validators.required],
        menuSubName: '',
        shortDesc: '',
        menuDesc: '',
        unitPrice: [0, [Validators.required, NumberValidators.range(0, 500)]],
        menuImageType: 0,
        showExtras: false,
        });

        this.sub = this.route.params.subscribe(p => {
          this.menu.id = +p['id'] || 0;
        });

        const sources = [
          this.menuService.getCatKeyValuePair(),
          this.menuService.getExtraKeyValuePair(),
        ];

        if (this.menu.id) {
          sources.push(this.menuService.getMenu(this.menu.id));
          sources.push(this.menuService.getMenuPhotos(this.menu.id));
        } else {
          this.pageTitle = 'Add Menu';
        }

      Observable.forkJoin(sources).subscribe(data => {
        this.categories = data[0];
        this.extras = data[1];

      if (this.menu.id) {
        this.onMenuRetrieved(data[2]);
        this.photos = data[3];
      }
      console.log(JSON.stringify(this.menu))
      },
      (error: any) => this.alertify.error(error, 5));
    }
    onMenuRetrieved(menu: IMenu): void {
      if (this.mainForm) {
          this.mainForm.reset();
      }
      this.initDataModel(menu, true);

      this.pageTitle = `Edit Menu: ${this.menu.menuName} ${this.menu.menuSubName}`;

      // Update the data on the form
      this.mainForm.patchValue({
        categoryId: this.menu.categoryId,
        menuCode: this.menu.menuCode,
        menuSortNumber: this.menu.menuSortNumber,
        menuName: this.menu.menuName,
        menuSubName: this.menu.menuSubName,
        shortDesc: this.menu.shortDesc,
        menuDesc: this.menu.menuDesc,
        unitPrice: this.menu.unitPrice,
        menuImageType: this.menu.menuImageType,
        showExtras: this.menu.showExtras
      });

      this.mainForm.controls['menuDesc'].markAsPristine()
    }
    private initDataModel(m: IMenu, init: boolean) {
      this.menu.id = m.id;
      this.menu.categoryId = m.categoryId;
      this.menu.menuCode = m.menuCode;
      this.menu.menuSortNumber = m.menuSortNumber;
      this.menu.menuName = m.menuName;
      this.menu.menuSubName = m.menuSubName;
      this.menu.shortDesc = m.shortDesc;
      this.menu.menuDesc = m.menuDesc;
      this.menu.unitPrice = m.unitPrice;
      this.menu.menuImageType = m.menuImageType;
      this.menu.showExtras =  m.showExtras;
      if (init) {
        this.menu.menuExtras = _.pluck(m.menuExtras, 'id');
      }

    }
    onExtraToggle(extraId, $event) {
      if ($event.target.checked) {
        this.menu.menuExtras.push(extraId);
      } else {
        const index = this.menu.menuExtras.indexOf(extraId);
        this.menu.menuExtras.splice(index, 1);
      }
      this.mainForm.markAsDirty();
    }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
      // Watch for the blur event from any input element on the form.
      const controlBlurs: Observable<any>[] = this.formInputElements
          .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

      // Merge the blur event observable with the valueChanges observable
      Observable.merge(this.mainForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
          this.displayMessage = this.genericValidator.processMessages(this.mainForm);
      });
  }
  private saveAndContinue() {
    if (this.mainForm) {
        this.mainForm.reset();
    }

    this.mainForm.patchValue({
      categoryId: this.menu.categoryId,
      menuCode: this.menu.menuCode,
      menuSortNumber: this.menu.menuSortNumber,
      menuName: this.menu.menuName,
      menuSubName: this.menu.menuSubName,
      shortDesc: this.menu.shortDesc,
      menuDesc: this.menu.menuDesc,
      unitPrice: this.menu.unitPrice,
      menuImageType: this.menu.menuImageType,
      showExtras: this.menu.showExtras
    });

    this.mainForm.controls['menuDesc'].markAsPristine()

  }
  saveMenu(action?: string): void {
     if (this.mainForm.dirty && this.mainForm.valid) {
        // Copy the form values over the product object values
      const e = Object.assign({}, this.menu, this.mainForm.value);

      if (this.menu.id === 0) {
          this.menuService.createMenu(e)
          .subscribe(
              (data) => {
              this.initDataModel(data, true);
                this.alertify.success('Saved successfully', 5);
                if (action !== 'stay') {
                    this.router.navigate(['/be/menus']);
                }
                this.saveAndContinue();
              },
            (error: any) => this.alertify.error(error, 5)
          )
      } else {

          this.initDataModel(e, false);
        console.log(JSON.stringify(e));
          this.menuService.updateMenu(e)
          .subscribe(
              () => {
                this.alertify.success('Saved successfully', 5);
                if (action !== 'stay') {
                    this.router.navigate(['/be/menus']);
                }
                this.saveAndContinue();
              },
            (error: any) => this.alertify.error(error, 5)
          );
      }
     } else {
      if (action !== 'stay') {
          this.router.navigate(['/be/menus']);
      }
     }
  }
  deleteMenu() {
    const menuHeader = this.menu.menuName + ' ' + this.menu.menuSubName;
    this.alertify.confirm(menuHeader, 'Are you sure you want to delete this menu?', () => {
      this.menuService.deleteMenu(this.menu.id).subscribe(() => {
        this.alertify.success('Menu has been deleted.', 5);
        this.router.navigate(['/be/menus']);
      }, error => {
        this.alertify.error('Failed to delete menu', 5)
      });
    });
  }
}
