import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { ISignHotel } from '../../_models/signHotel';
import { GenericValidator } from '../../_shared/generic-validator';
import { HotelService } from '../../_Services/hotel.service';
import { AlertifyService } from '../../_Services/alertify.service';

@Component({
  templateUrl: './sign-hotel.component.html',
  styleUrls: ['./sign-hotel.component.scss']
})
export class SignHotelComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Hotel Registration Form';
  errorMessage: string;
  mainForm: FormGroup;
  hotel: ISignHotel;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private alertify: AlertifyService ) {

      this.validationMessages = {
        hotelname: {
          required: 'Please enter your Hotel name'
        },
        email: {
        required: 'Please enter your email address.',
        pattern: 'Please enter a valid email address.'
        },
        username: {
            required: 'Please enter your name.'
         },
        useremail: {
            required: 'Please enter your email address.',
            pattern: 'Please enter a valid email address.'
        },
        userpassword: {
            required: 'Please enter your password.',
            minlength: 'Password must be at least four characters.',
            maxlength: 'Password cannot exceed 20 characters.'
       }
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
    }

  ngOnInit() {
    this.mainForm = this.fb.group({
      hotelname: ['', Validators.required],
      address1: '',
      address2: '',
      town: '',
      county: '',
      country: '',
      postCode: '',
      phone: '',
      email: ['', [Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
      website: '',
      username: ['', Validators.required],
      useremail: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
      userpassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
    });
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
  Register(): void {
    if (this.mainForm.dirty && this.mainForm.valid) {
        // Copy the form values over the product object values
      const newHotel = Object.assign({}, this.mainForm.value);
      console.log(newHotel);
      this.hotelService.createHotel(newHotel)
      .subscribe(
          () => {
            this.alertify.success('Please login and proceed with the configuration of the system.', 5);
            this.router.navigate(['/login']);
          },
          (error: any) => this.alertify.error(error, 5)
        );
    }
  }
}
