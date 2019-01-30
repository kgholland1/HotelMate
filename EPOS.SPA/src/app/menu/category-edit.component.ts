import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { Observable, Subscription, fromEvent, merge, forkJoin } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';

import { MessageModalComponent } from './../shared/message-modal.component';
import { GenericValidator } from './../shared/generic-validator';
import { MenuService } from './menu.service';
import { AlertifyService } from './../core/alertify.service';
import { ICategory } from './../_models/Category';


@Component({
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  bsModalRef: BsModalRef;

  pageTitle  = 'Category Edit';
  errorMessage: string;
  mainForm: FormGroup;
  spinnerprocessing = false;

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
    private modalService: BsModalService,
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

    this.sub = this.route.paramMap.subscribe(p => {
      this.category.id = +p.get('id') || 0;
    });

    const sources = [
      this.categoryService.getCatHeaders(),
    ];

    if (this.category.id) {
      sources.push(this.categoryService.getCategory(this.category.id));
    } else {
      this.pageTitle = 'Add Category';
    }

    this.spinnerState(true);
    forkJoin(sources)
    .pipe(finalize(() => this.spinnerState(false)))
    .subscribe(data => {
      this.catHeaders = data[0];

      if (this.category.id) {
        this.onPaymentRetrieved(data[1]);
      }
    },
    (error: any) => {
      this.alertify.error(error, 5)
      this.router.navigate(['/config/menu/categories']);
    });
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
          .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    merge(this.mainForm.valueChanges, ...controlBlurs).pipe(
        debounceTime(800)
        ).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.mainForm);
    });
  }

  saveCategory(action?: string): void {
    if (this.mainForm.dirty && this.mainForm.valid) {
        // Copy the form values over the product object values
      const e = Object.assign({}, this.category, this.mainForm.value);

      if (this.category.id === 0) {
          this.spinnerState(true);
          this.categoryService.createCategory(e)
          .pipe(finalize(() => this.spinnerState(false)))
          .subscribe(
              (data) => {
              this.initDataModel(data);
                this.alertify.success('Saved successfully', 5);
                if (action !== 'stay') {
                    this.router.navigate(['/config/menu/categories']);
                }
                this.saveAndContinue();
              },
            (error: any) => this.alertify.error(error, 5)
          )
      } else {
          this.initDataModel(e);
          this.spinnerState(true);
          this.categoryService.updateCategory(e)
          .pipe(finalize(() => this.spinnerState(false)))
          .subscribe(
              () => {
                this.alertify.success('Saved successfully', 5);
                if (action !== 'stay') {
                    this.router.navigate(['/config/menu/categories']);
                }
                this.saveAndContinue();
              },
            (error: any) => this.alertify.error(error, 5)
          );
      }
     } else {
      if (action !== 'stay') {
          this.router.navigate(['/config/menu/categories']);
      }
     }
  }
  deleteCategory() {
    const initialState = {
      title : this.category.catName,
      message: 'Are you sure you want to delete this category'
    };
    this.bsModalRef = this.modalService.show(MessageModalComponent, {initialState});
    this.bsModalRef.content.msgResponse.subscribe((value) => {
      if (value) {
          this.categoryService.deleteCategory(this.category.id).subscribe(() => {
              this.alertify.success('Category has been deleted.', 5);
              if (this.mainForm) {
                  this.mainForm.reset();
              }
              this.router.navigate(['/config/menu/categories']);
          }, error => {
              this.alertify.error('Failed to delete category', 5)
          });
      }
    });

  };

  private spinnerState(state: boolean) {
    this.spinnerprocessing = state;
  }
}
