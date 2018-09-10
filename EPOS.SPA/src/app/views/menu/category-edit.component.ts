
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ICategory } from '../../_models/Category';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChildren, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { GenericValidator } from '../../_shared/generic-validator';
import { MenuService } from '../../_Services/menu.service';
import { AlertifyService } from '../../_Services/alertify.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

@Component({
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Category Edit';
  errorMessage: string;
  mainForm: FormGroup;

  catHeaders: any[];
  category: ICategory = {
    id: 0,
    headerName: '',
    catName: '',
    description: ''
  };
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private sub: Subscription;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: MenuService,
    private alertify: AlertifyService) {

      this.validationMessages = {
        headerName: {
            required: 'Please select a category header.'
         },
         catName: {
          required: 'Please enter a category name.'
       }
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
     }

  ngOnInit() {
    this.mainForm = this.fb.group({
      headerName:  ['', Validators.required],
      catName:  ['', Validators.required],
      description: ''
      });

      this.sub = this.route.params.subscribe(p => {
        this.category.id = +p['id'] || 0;
      });

      const sources = [
        this.categoryService.getCatHeaders(),

      ];

      if (this.category.id) {
        sources.push(this.categoryService.getCategory(this.category.id));
      } else {
        this.pageTitle = 'Add Category';
    }

    Observable.forkJoin(sources).subscribe(data => {
      this.catHeaders = data[0];

    if (this.category.id) {
      this.onPaymentRetrieved(data[1]);
    }

    },
    (error: any) => this.alertify.error(error, 5));
  }

  onPaymentRetrieved(category: ICategory): void {
    if (this.mainForm) {
        this.mainForm.reset();
    }
    this.initDataModel(category);

    this.pageTitle = `Edit Category: ${this.category.catName}`;

    // Update the data on the form
    this.mainForm.patchValue({
      headerName: this.category.headerName,
      catName: this.category.catName,
      description: this.category.description
    });
  }
  private initDataModel(categoryFromDB: ICategory) {
    this.category = categoryFromDB;
  }
  private saveAndContinue() {
    if (this.mainForm) {
        this.mainForm.reset();
    }

    this.mainForm.patchValue({
      headerName: this.category.headerName,
      catName: this.category.catName,
      description: this.category.description
    });
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

  saveCategory(action?: string): void {
    if (this.mainForm.dirty && this.mainForm.valid) {
        // Copy the form values over the product object values
      const e = Object.assign({}, this.category, this.mainForm.value);

      if (this.category.id === 0) {
          this.categoryService.createCategory(e)
          .subscribe(
              (data) => {
              this.initDataModel(data);
                this.alertify.success('Saved successfully', 5);
                if (action !== 'stay') {
                    this.router.navigate(['/be/categories']);
                }
                this.saveAndContinue();
              },
            (error: any) => this.alertify.error(error, 5)
          )
      } else {
          this.initDataModel(e);

          this.categoryService.updateCategory(e)
          .subscribe(
              () => {
                this.alertify.success('Saved successfully', 5);
                if (action !== 'stay') {
                    this.router.navigate(['/be/categories']);
                }
                this.saveAndContinue();
              },
            (error: any) => this.alertify.error(error, 5)
          );
      }
     } else {
      if (action !== 'stay') {
          this.router.navigate(['/be/categories']);
      }
     }
  }
  deleteCategory() {
    this.alertify.confirm(this.category.catName, 'Are you sure you want to delete this category?', () => {
      this.categoryService.deleteCategory(this.category.id).subscribe(() => {
        this.alertify.success('Category has been deleted.', 5);
        this.router.navigate(['/be/categories']);
      }/* , error => {
        this.alertify.error(error, 5)
      } */);
    });
  }
}
