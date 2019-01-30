import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';

import { HotelService } from './hotel.service';
import { AlertifyService } from './../core/alertify.service';
import { GenericValidator } from './../shared/generic-validator';
import { IHotel } from './../_models/hotel';

@Component({
  templateUrl: './hotel-edit.component.html',
  styleUrls: ['./hotel-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HotelEditComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errorMessage: string;
  mainForm: FormGroup;
  spinnerprocessing = false;

  hotel: IHotel = {
    id: 0,
    hotelName: '',
    hotelCode: '',
    introduction: '',
    history: '',
    address1: '',
    address2: '',
    town: '',
    county: '',
    country: '',
    postCode: '',
    phone: '',
    email: '',
    website: '',
    UpdatedOn: '',
    UpdatedBy: ''
  };

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private alertify: AlertifyService ) {

      this.validationMessages = {
        hotelname: {
          required: 'Please enter your Hotel name'
        },
        email: {
        required: 'Please enter your email address.',
        pattern: 'Please enter a valid email address.'
        }
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
    }

    ngOnInit() {
      this.mainForm = this.fb.group({
        hotelcode: [{value: '', disabled: true}],
        hotelname: ['', Validators.required],
        introduction: '',
        history: '',
        address1: '',
        address2: '',
        town: '',
        county: '',
        country: '',
        postCode: '',
        phone: '',
        email: ['', [Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
        website: ''
      });

      this.route.data.subscribe(data => {

        this.initDataModel(data['hotel']);

      });

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

    private initDataModel(hotelFromSource: IHotel) {
      this.hotel = hotelFromSource;
      this.mainForm.patchValue({
        hotelcode: this.hotel.hotelCode,
        hotelname: this.hotel.hotelName,
        introduction: this.hotel.introduction,
        history: this.hotel.history,
        address1: this.hotel.address1,
        address2: this.hotel.address2,
        town: this.hotel.town,
        county: this.hotel.county,
        country: this.hotel.country,
        postCode: this.hotel.postCode,
        phone: this.hotel.phone,
        email: this.hotel.email,
        website: this.hotel.website,
      });
        this.mainForm.controls['history'].markAsPristine()
    }

    SaveChanges(): void {

     if (this.mainForm.dirty && this.mainForm.valid) {

      const e = Object.assign({}, this.hotel, this.mainForm.value);

      this.spinnerState(true);
      this.hotelService.updateHotel(e)
      .pipe(finalize(() => this.spinnerState(false)))
      .subscribe(
          (data) => {
            this.alertify.success('Saved successfully', 5);
            if (this.mainForm) {
              this.mainForm.reset();
          }
          this.initDataModel(e);

          },
        (error: any) => this.alertify.error(error, 5)
      )
     } else {
      this.alertify.message('No data was changed on the form, hence the details will not be updated.', 5);
     }

    }
    private spinnerState(state: boolean) {
      this.spinnerprocessing = state;
    }
}
