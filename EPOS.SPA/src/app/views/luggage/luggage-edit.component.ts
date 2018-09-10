import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChildren, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';

import { ILuggage } from '../../_models/luggage';
import { GenericValidator } from '../../_shared/generic-validator';
import { KeepingService } from '../../_Services/keeping.service';
import { AuthService } from '../../_Services/auth.service';
import { AlertifyService } from '../../_Services/alertify.service';
import { NumberValidators } from '../../_Shared/number.validator';

@Component({
  selector: 'app-luggage-edit',
  templateUrl: './luggage-edit.component.html',
  styleUrls: ['./luggage-edit.component.scss']
})
export class LuggageEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Edit Luggage Pickup';
  errorMessage: string;
  mainForm: FormGroup;
  statusList = [{value: 'Pending', display: 'Pending'}, {value: 'Processing', display: 'Processing'},
     {value: 'Complete', display: 'Complete'}, {value: 'Cancelled', display: 'Cancelled'}];
  openTimes: any[];

  luggage: ILuggage = {
    id: 0,
    noOfLuggage: 0,
    guestName: '',
    email: '',
    phone: '',
    resDate: '',
    roomNumber: '',
    resTime: '',
    bookStatus: '',
    request: '',
    response: '',
    createdOn: null,
    updatedOn: null,
    updatedBy: ''
  };

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private sub: Subscription;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private keepingService: KeepingService,
    private authService: AuthService,
    private alertify: AlertifyService) {

      this.validationMessages = {
        noOfLuggage: {
            required: 'Please enter the number of luggage.',
            range: 'Number of luggage must be between 1 and 100.'
        }
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
    }

  ngOnInit() {
    this.mainForm = this.fb.group({
      noOfLuggage: [0, [Validators.required, NumberValidators.range(0, 100)]],
      resTime: '',
      bookStatus: '',
      response: '',
      });

      this.sub = this.route.params.subscribe(p => {
        this.luggage.id = +p['id'] || 0;
      });

      if (this.luggage.id) {
        this.keepingService.getLuggage(this.luggage.id).subscribe(data => {
          this.openTimes = data.openTimes;
          this.onLuggageRetrieved(data.luggageToReturn);
        },
        (error: any) => {
          this.alertify.error(error, 5)
          this.router.navigate(['/be/luggages']);
          }
        );
      }
  }
  onLuggageRetrieved(luggage: any): void {
    if (this.mainForm) {
        this.mainForm.reset();
    }
    this.initDataModel(luggage);

    this.pageTitle = `Edit Luggage Pickup: ${this.luggage.guestName} - (${this.luggage.roomNumber})`;

    // Update the data on the form
    this.mainForm.patchValue({
      noOfLuggage: this.luggage.noOfLuggage,
      resTime: this.luggage.resTime,
      bookStatus: this.luggage.bookStatus,
      response: this.luggage.response

    });
  }
  private initDataModel(reservationFromDB: ILuggage) {
    this.luggage = reservationFromDB;
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
      noOfLuggage: this.luggage.noOfLuggage,
      resTime: this.luggage.resTime,
      bookStatus: this.luggage.bookStatus,
      response: this.luggage.response
    });
  }
  saveLuggage(action?: string): void {
    if (this.mainForm.dirty && this.mainForm.valid) {
        // Copy the form values over the product object values
    this.luggage.updatedOn = new Date();
    this.luggage.updatedBy = this.authService.decodedToken.unique_name;


    const e = Object.assign({}, this.luggage, this.mainForm.value);

        this.initDataModel(e);

        this.keepingService.updateLuggage(e)
        .subscribe(
            () => {
              this.alertify.success('Saved successfully', 5);
              if (action !== 'stay') {
                  this.router.navigate(['/be/luggages']);
              }
              this.saveAndContinue();
            },
          (error: any) => this.alertify.error(error, 5)
        );
     } else {
      if (action !== 'stay') {
          this.router.navigate(['/be/luggages']);
      }
     }
  }
  deleteLuggage() {
     this.alertify.confirm(this.luggage.guestName, 'Are you sure you want to delete this luggage pickup?', () => {
      this.keepingService.setLuggageAsDelete(this.luggage.id).subscribe(() => {
        this.alertify.success('Luggage pickup request has been deleted.', 5);
        this.router.navigate(['/be/luggages']);
      });
    });
    }
}
