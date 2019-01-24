import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControlName, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';

import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { IRegister } from 'app/_models/register';
import { AuthService } from './../core/auth.service';
import { AlertifyService } from './../core/alertify.service';
import { GenericValidator } from './../shared/generic-validator';


function match(c: AbstractControl): {[key: string]: boolean} | null {
  const passwordControl = c.get('password');
  const confirmControl = c.get('confirmPassword');

  if (passwordControl.pristine || confirmControl.pristine) {
    return null;
  }

  if (passwordControl.value === confirmControl.value) {
      return null;
  }
  return { 'match': true };
}


@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errorMessage: string;
  registerForm: FormGroup;
  // user: IRegister;
  passwordMessage: string;

  user: IRegister = {
    email: '',
    fullName: '',
    password: '',
    hotelcode: '',
    phoneNumber: '',
    department: '',
    position: ''
  };


  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  private validateMessages = {
    match: 'The confirmation does not match the password.'
  };

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertify: AlertifyService ) {

      this.validationMessages = {
        hotelcode: {
          required: 'Please enter your Hotel code.'
       },
       fullName: {
        required: 'Please enter your name.'
      },
        email: {
            required: 'Please enter your email address.',
            pattern: 'Please enter a valid email address.'

        },
        password: {
            required: 'Please enter your password.',
            minlength: 'Password must be at least four characters.',
            maxlength: 'Password cannot exceed 20 characters.'
       },
       confirmPassword: {
        required: 'Please enter your confirm password.',
        match: 'The confirmation does not match the new password.'
        }
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
     }

  ngOnInit() {
    this.registerForm = this.fb.group({
      hotelcode: ['', Validators.required],
      fullName: ['', Validators.required],
      phoneNumber: '',
      department: '',
      position: '',
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
        confirmPassword: ['', Validators.required]
     }, {validator: match}),
    });

    const confirmPasswordControl = this.registerForm.get('passwordGroup');
    confirmPasswordControl.valueChanges.pipe(
      debounceTime(1000)
      ).subscribe(value => this.setMessage(confirmPasswordControl));
  }


ngAfterViewInit(): void {

    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    merge(this.registerForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
      ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.registerForm);
    });

  }

  setMessage(c: AbstractControl): void {
    this.passwordMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
        this.passwordMessage = Object.keys(c.errors).map(key =>
             this.validateMessages[key]).join(' ');
    }
  }

  Register(): void {
    if (this.registerForm.dirty && this.registerForm.valid) {
        // Copy the form values over the product object values
      const register = Object.assign({}, this.registerForm.value);
      register.password = this.registerForm.get('passwordGroup.password').value;

      if (register.phoneNumber === '') {
        register.phoneNumber = null;
      }

      this.authService.register(register)
      .subscribe(
          () => {
            this.alertify.success('Registration successful', 5);
            this.router.navigate(['/login']);
          },
          (error: any) => this.alertify.error(error, 5)
        );
    }
  }
}
