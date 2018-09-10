import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy, ViewChildren } from '@angular/core';
import { ITaxi } from '../../_models/taxi';
import { GenericValidator } from '../../_shared/generic-validator';
import { AuthService } from '../../_Services/auth.service';
import { KeepingService } from '../../_Services/keeping.service';
import { AlertifyService } from '../../_Services/alertify.service';
import { NumberValidators } from '../../_Shared/number.validator';

@Component({
  templateUrl: './taxi-edit.component.html',
  styleUrls: ['./taxi-edit.component.scss']
})
export class TaxiEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Taxi/Private Chauffer';
  errorMessage: string;
  mainForm: FormGroup;
  statusList = [{value: 'Pending', display: 'Pending'}, {value: 'Processing', display: 'Processing'},
     {value: 'Complete', display: 'Complete'}, {value: 'Cancelled', display: 'Cancelled'}];

  openTimes: any[];
  taxi: ITaxi = {
    id: 0,
    noOfPerson: 0,
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
        noOfPerson: {
            required: 'Please enter the number of people.',
            range: 'Number of people must be between 1 and 50.'
        }
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
    }

  ngOnInit() {
    this.mainForm = this.fb.group({
      noOfPerson: [0, [Validators.required, NumberValidators.range(0, 50)]],
      resTime: '',
      bookStatus: '',
      response: '',
      });

      this.sub = this.route.params.subscribe(p => {
        this.taxi.id = +p['id'] || 0;
      });

      if (this.taxi.id) {
        this.keepingService.getTaxi(this.taxi.id).subscribe(data => {
          this.openTimes = data.openTimes;
          this.onTaxiRetrieved(data.taxiToReturn);
        },
        (error: any) => {
          this.alertify.error(error, 5)
          this.router.navigate(['/be/taxis']);
          }
        );
      }
  }
  onTaxiRetrieved(taxi: any): void {
    if (this.mainForm) {
        this.mainForm.reset();
    }
    this.initDataModel(taxi);

    this.pageTitle = `Edit Taxi and Pivate Chauffer: ${this.taxi.guestName} - (${this.taxi.roomNumber})`;

    // Update the data on the form
    this.mainForm.patchValue({
      noOfPerson: this.taxi.noOfPerson,
      resTime: this.taxi.resTime,
      bookStatus: this.taxi.bookStatus,
      response: this.taxi.response

    });
  }
  private initDataModel(taxiFromDB: ITaxi) {
    this.taxi = taxiFromDB;
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
    noOfPerson: this.taxi.noOfPerson,
    resTime: this.taxi.resTime,
    bookStatus: this.taxi.bookStatus,
    response: this.taxi.response
  });
}
saveTaxi(action?: string): void {
  if (this.mainForm.dirty && this.mainForm.valid) {
      // Copy the form values over the product object values
  this.taxi.updatedOn = new Date();
  this.taxi.updatedBy = this.authService.decodedToken.unique_name;


  const e = Object.assign({}, this.taxi, this.mainForm.value);

      this.initDataModel(e);

      this.keepingService.updateTaxi(e)
      .subscribe(
          () => {
            this.alertify.success('Saved successfully', 5);
            if (action !== 'stay') {
                this.router.navigate(['/be/taxis']);
            }
            this.saveAndContinue();
          },
        (error: any) => this.alertify.error(error, 5)
      );
   } else {
    if (action !== 'stay') {
        this.router.navigate(['/be/taxis']);
    }
   }
}

deleteTaxi() {
this.alertify.confirm(this.taxi.guestName, 'Are you sure you want to delete this taxi request?', () => {
  this.keepingService.setTaxiAsDelete(this.taxi.id).subscribe(() => {
    this.alertify.success('Taxi request has been deleted.', 5);
    this.router.navigate(['/be/taxis']);
  });
});
}
}
