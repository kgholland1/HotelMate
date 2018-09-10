import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControlName, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';

import { GenericValidator } from '../../_shared/generic-validator';
import { AuthService } from '../../_Services/auth.service';
import { AlertifyService } from '../../_Services/alertify.service';

function match(c: AbstractControl): {[key: string]: boolean} | null {
  const passwordControl = c.get('newPassword');
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
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  mainForm: FormGroup;
  profile: any = {};
  passwordMessage: string;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  private validateMessages = {
    match: 'The confirmation does not match the new password.'
};

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertify: AlertifyService ) {

      this.validationMessages = {
        currentPassword: {
          required: 'Please enter your current password.'
       },
        newPassword: {
            required: 'Please enter your new password.',
            minlength: 'Password must be at least four characters.',
            maxlength: 'Password cannot exceed 20 characters.'
         },
        confirmPassword: {
            required: 'Please enter your password.',
            match: 'The confirmation does not match the new password.'
       }
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
     }

  ngOnInit() {
    this.mainForm = this.fb.group({
      currentPassword: ['', Validators.required],
      passwordGroup: this.fb.group({
        newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
        confirmPassword: ['', Validators.required],
    }, {validator: match}),
    })

    const confirmPasswordControl = this.mainForm.get('passwordGroup');
    confirmPasswordControl.valueChanges.debounceTime(1000).subscribe(value =>
        this.setMessage(confirmPasswordControl));
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
setMessage(c: AbstractControl): void {
  this.passwordMessage = '';
  if ((c.touched || c.dirty) && c.errors) {
      this.passwordMessage = Object.keys(c.errors).map(key =>
           this.validateMessages[key]).join(' ');
  }

}
SaveChanges(): void {
  if (this.mainForm.dirty && this.mainForm.valid) {
      // Copy the form values over the product object values

    this.profile.currentPassword = this.mainForm.get('currentPassword').value;
    this.profile.newPassword = this.mainForm.get('passwordGroup.newPassword').value;

    // const profile = Object.assign({}, this.mainForm.value);
    console.log(this.profile);

    this.authService.changePassword(this.profile)
    .subscribe(
        () => {
          this.alertify.success('Password is changed successfully. Please login with your new password.', 5);
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        (error: any) => this.alertify.error(error, 5)
      );
    }
  }
}
