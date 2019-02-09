import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import * as _ from 'underscore';

import { Observable, Subscription, fromEvent, merge, forkJoin } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';

import { MessageModalComponent } from './../shared/message-modal.component';
import { GenericValidator } from './../shared/generic-validator';
import { MenuService } from './menu.service';
import { AlertifyService } from './../core/alertify.service';
import { NumberValidators } from './../shared/number.validator';

import { IMenuSave, IMenu, IMenuExtra } from './../_models/menu';
import { IPhoto } from './../_models/photo';
import { IKeyValuePair } from './../_models/KeyValuePair';
import { IExtra } from './../_models/extra';

@Component({
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.scss']
})
export class MenuEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  bsModalRef: BsModalRef;

  pageTitle  = 'Menu Edit';
  errorMessage: string;
  mainForm: FormGroup;
  categories: IKeyValuePair[] = [];
  extras: IExtra[] = [];
  options: IExtra[] = [];
  sizes: IExtra[] = [];
  filtedExtras: IExtra[] = [];
  isDisabled = false;

  photos: IPhoto[] = [];
  allergyList = [{value: 0, display: 'None'}, {value: 1, display: 'Pepper'}, {value: 2, display: 'Vegetarian'},
    {value: 3, display: 'Nuts'}, {value: 4, display: 'PepperVegetarian'}, {value: 5, display: 'PepperNuts'},
    {value: 6, display: 'VegetarianNuts'}, {value: 7, display: 'PepperVegetarianNuts'}];

  spinnerprocessing = false;
  currencyUsed = 'GBP';
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
    menuExtrasKey: [],
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
    private modalService: BsModalService,
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

        this.sub = this.route.paramMap.subscribe(p => {
          this.menu.id = +p.get('id') || 0;
        });

        const sources = [
          this.menuService.getCatKeyValuePair(),
          this.menuService.getExtraForMenuSelection(),
        ];

        if (this.menu.id) {
          sources.push(this.menuService.getMenu(this.menu.id));
          sources.push(this.menuService.getMenuPhotos(this.menu.id));
        } else {
          this.pageTitle = 'Add Menu';
        }

      this.spinnerState(true);
      forkJoin(sources)
      .pipe(finalize(() => this.spinnerState(false)))
      .subscribe(data => {
        this.categories = data[0];
        this.extras = data[1];

        // filter the extras into types
        this.options = this.extras.filter(e => e.extraType === 'Option');
        this.sizes = this.extras.filter(e => e.extraType === 'Size');
        this.filtedExtras = this.extras.filter(e => e.extraType === 'Extra');

      if (this.menu.id) {
        this.onMenuRetrieved(data[2]);
        this.photos = data[3];
      }

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
        this.menu.menuExtrasKey = _.pluck(m.menuExtras, 'extraId');
      }
      this.menu.menuExtras = m.menuExtras;

    }
    onExtraToggle(extraId, $event) {

      const menuExtraToAdd: IMenuExtra = {
        extraId: 0,
        extraName: '',
        unitPrice: 0,
        extraType: ''
      };

      const item = this.extras.filter(e => e.id === extraId)[0];

      if (item !== undefined) {
        menuExtraToAdd.extraId = item.id;
        menuExtraToAdd.extraName = item.extraName;
        menuExtraToAdd.unitPrice = item.unitPrice;
        menuExtraToAdd.extraType = item.extraType;

        if ($event.target.checked) {
          this.menu.menuExtrasKey.push(extraId);
          this.menu.menuExtras.push(menuExtraToAdd);
        } else {
          const index = this.menu.menuExtrasKey.indexOf(extraId);
          this.menu.menuExtrasKey.splice(index, 1);
          this.menu.menuExtras = this.menu.menuExtras.filter(e => e.extraId !== extraId);
        }
      }

      this.mainForm.markAsDirty();
    }
    onExtraChange(extraId, $event) {

      const item = this.extras.filter(e => e.id === extraId)[0];

      if (item !== undefined) {
        item.unitPrice = $event.target.value;
      }


      console.log(JSON.stringify(item));
  }
  onPriceChange(extraId) {
    this.isDisabled = false;
    const item = this.menu.menuExtras.filter(e => e.extraId === extraId)[0];
    if (item === undefined) {
      return 0.00
    } else {
      this.isDisabled = true;
      return item.unitPrice;
    }
    console.log(extraId);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
      // Watch for the blur event from any input element on the form.
      const controlBlurs: Observable<any>[] = this.formInputElements
          .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    merge(this.mainForm.valueChanges, ...controlBlurs).pipe(
        debounceTime(800)
        ).subscribe(value => {
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

      console.log(JSON.stringify(e));

      if (this.menu.id === 0) {
        this.spinnerState(true);
        this.menuService.createMenu(e)
        .pipe(finalize(() => this.spinnerState(false)))
        .subscribe(
            (data) => {
            this.initDataModel(data, true);
              this.alertify.success('Saved successfully', 5);
              if (action !== 'stay') {
                  this.router.navigate(['/config/menu/menus']);
              }
              this.saveAndContinue();
            },
          (error: any) => this.alertify.error(error, 5)
        )
      } else {
        this.initDataModel(e, false);

        this.spinnerState(true);
          this.menuService.updateMenu(e)
          .pipe(finalize(() => this.spinnerState(false)))
          .subscribe(
              () => {
                this.alertify.success('Saved successfully', 5);
                if (action !== 'stay') {
                    this.router.navigate(['/config/menu/menus']);
                }
                this.saveAndContinue();
              },
            (error: any) => this.alertify.error(error, 5)
          );
      }
     } else {
      if (action !== 'stay') {
          this.router.navigate(['config/menu/menus']);
      }
     }
  }
  deleteMenu() {
    const initialState = {
      title : this.menu.menuName + ' ' + this.menu.menuSubName,
      message: 'Are you sure you want to delete this menu'
    };
    this.bsModalRef = this.modalService.show(MessageModalComponent, {initialState});
    this.bsModalRef.content.msgResponse.subscribe((value) => {
      if (value) {
        this.menuService.deleteMenu(this.menu.id).subscribe(() => {
              this.alertify.success('Menu has been deleted.', 5);
              if (this.mainForm) {
                  this.mainForm.reset();
              }
              this.router.navigate(['/config/menu/menus']);
          }, error => {
              this.alertify.error('Failed to delete menu', 5)
          });
      }
  });

  }
  private spinnerState(state: boolean) {
    this.spinnerprocessing = state;
  }
}
