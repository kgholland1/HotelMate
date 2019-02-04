import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';

import { GenericValidator } from './../../shared/generic-validator';
import { MessageModalComponent } from './../../shared/message-modal.component';
import { AlertifyService } from './../../core/alertify.service';
import { SystemService } from './../system.service';

import { IRestaurant } from './../../_models/restaurant';

@Component({
  templateUrl: './restaurant-edit.component.html',
  styleUrls: ['./restaurant-edit.component.scss']
})
export class RestaurantEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Restaurant Edit';
  errorMessage: string;
  mainForm: FormGroup;
  bsModalRef: BsModalRef;
  spinnerprocessing = false;

  restaurant: IRestaurant = {
    id: 0,
    restaurantName: ''
  };

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private sub: Subscription;
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private systemService: SystemService,
    private modalService: BsModalService,
    private alertify: AlertifyService) {

      this.validationMessages = {
        restaurantName: {
            required: 'Please enter restaurant name.'
         }
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
     }

  ngOnInit() {
    this.mainForm = this.fb.group({
      restaurantName:  ['', Validators.required]
      });

  // Read the product Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id =  +params.get('id') || 0;
          this.getRestaurant(id);
      }
    );
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

getRestaurant(id: number): void {
    if (id > 0) {
      this.spinnerState(true);
        this.systemService.getRestaurant(id)
        .pipe(finalize(() => this.spinnerState(false)))
        .subscribe(
            (restaurant: IRestaurant) => this.onRestaurantRetrieved(restaurant),
            (error: any) => this.alertify.error(error, 5)
        );
    } else {
        this.pageTitle = 'Add Restaurant';
    }
  }
  onRestaurantRetrieved(restaurant: IRestaurant): void {
    if (this.mainForm) {
        this.mainForm.reset();
    }
    this.initDataModel(restaurant);

    this.pageTitle = `Edit Restaurant: ${this.restaurant.restaurantName}`;

    // Update the data on the form
    this.mainForm.patchValue({
      restaurantName: this.restaurant.restaurantName
    });
  }

  private initDataModel(restaurantFromDB: IRestaurant) {
    this.restaurant = restaurantFromDB;
  }
  private saveAndContinue() {
    if (this.mainForm) {
        this.mainForm.reset();
    }

    this.mainForm.patchValue({
      restaurantName: this.restaurant.restaurantName
    });
  }
  saveRestaurant(): void {
    if (this.mainForm.dirty && this.mainForm.valid) {
        // Copy the form values over the product object values
      const e = Object.assign({}, this.restaurant, this.mainForm.value);

      if (this.restaurant.id === 0) {
          this.spinnerState(true);
          this.systemService.createRestaurant(e)
          .pipe(finalize(() => this.spinnerState(false)))
          .subscribe(
              (data) => {
                this.mainForm.reset();
                this.alertify.success('Saved successfully', 5);
                this.router.navigate(['/config/system/restaurants']);
              },
            (error: any) => this.alertify.error(error, 5)
          )
      } else {
        this.initDataModel(e);
        this.spinnerState(true);
        this.systemService.updateRestaurant(e)
        .pipe(finalize(() => this.spinnerState(false)))
          .subscribe(
              () => {
                this.mainForm.reset();
                this.alertify.success('Saved successfully', 5);
                this.router.navigate(['/config/system/restaurants']);
              },
            (error: any) => this.alertify.error(error, 5)
          );
      }
     } else {
      this.router.navigate(['/config/system/restaurants']);
     }
  }
  deleteRestaurant() {
    const initialState = {
      title : this.restaurant.restaurantName,
      message: 'Are you sure you want to delete this restaurant'
    };

    this.bsModalRef = this.modalService.show(MessageModalComponent, {initialState});
    this.bsModalRef.content.msgResponse.subscribe((value) => {
      if (value) {
        this.systemService.deleteRestaurant(this.restaurant.id).subscribe(() => {
              this.alertify.success('Restaurant has been deleted.', 5);
              if (this.mainForm) {
                  this.mainForm.reset();
              }
              this.router.navigate(['/config/system/restaurants']);
          }, error => {
              this.alertify.error('Failed to delete restaurant.', 5)
          });
      }
    });
  }

  private spinnerState(state: boolean) {
    this.spinnerprocessing = state;
  }
}
