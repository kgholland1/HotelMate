import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IRestaurant } from './../../_models/restaurant';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { GenericValidator } from '../../_shared/generic-validator';
import { SystemService } from '../../_Services/system.service';
import { AlertifyService } from '../../_Services/alertify.service';

@Component({
  selector: 'app-restaurant-edit',
  templateUrl: './restaurant-edit.component.html',
  styleUrls: ['./restaurant-edit.component.scss']
})
export class RestaurantEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Restaurant Edit';
  errorMessage: string;
  mainForm: FormGroup;

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
    this.sub = this.route.params.subscribe(
      params => {
          const id = +params['id'];
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
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.mainForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.mainForm);
    });
}

getRestaurant(id: number): void {
    if (id > 0) {
        this.systemService.getRestaurant(id)
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
          this.systemService.createRestaurant(e)
          .subscribe(
              (data) => {
                this.mainForm.reset();
                this.alertify.success('Saved successfully', 5);
                this.router.navigate(['/be/restaurants']);
              },
            (error: any) => this.alertify.error(error, 5)
          )
      } else {
          this.systemService.updateRestaurant(e)
          .subscribe(
              () => {
                this.mainForm.reset();
                this.alertify.success('Saved successfully', 5);
                this.router.navigate(['/be/restaurants']);
              },
            (error: any) => this.alertify.error(error, 5)
          );
      }
     } else {
      this.router.navigate(['/be/restaurants']);
     }
  }
  deleteRestaurant() {
    this.alertify.confirm(this.restaurant.restaurantName, 'Are you sure you want to delete this restaurant?', () => {
      this.systemService.deleteRestaurant(this.restaurant.id).subscribe(() => {
        this.alertify.success('Restaurant has been deleted.', 5);
        this.router.navigate(['/be/restaurants']);
      }, error => {
        this.alertify.error('Failed to delete restaurants', 5)
      });
    });
  }
}
