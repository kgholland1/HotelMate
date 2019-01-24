import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable,  fromEvent, merge } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';

import { IProfile } from './../../_models/profile';
import { UserService } from '../user.service';
import { AlertifyService } from './../../core/alertify.service';
import { AuthService } from './../../core/auth.service';
import { GenericValidator } from './../../shared/generic-validator';

@Component({
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errorMessage: string;
  mainForm: FormGroup;
  spinnerprocessing = false;

  profile: IProfile = {
    id: 0,
    email: '',
    fullName: '',
    phoneNumber: '',
    department: '',
    position: ''
  };

    // Use with the generic validation message class
    displayMessage: { [key: string]: string } = {};
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService ) {

      this.validationMessages = {
        fullName: {
          required: 'Please enter your name'
        }
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);

     }

  ngOnInit() {
    this.mainForm = this.fb.group({
      fullName: ['', Validators.required],
      department: '',
      phoneNumber: '',
      position: ''
    });

    this.route.data.subscribe(data => {

      this.initDataModel(data['profile']);

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

  private initDataModel(profileFromSource: IProfile) {
    this.profile = profileFromSource;
    this.mainForm.patchValue({
      fullName: this.profile.fullName,
      department: this.profile.department,
      position: this.profile.position,
      phoneNumber: this.profile.phoneNumber
    });
  }

  SaveChanges(): void {

    if (this.mainForm.dirty && this.mainForm.valid) {

     const e = Object.assign({}, this.profile, this.mainForm.value);

     this.spinnerState(true);
     this.userService.updateProfile(e)
     .pipe(finalize(() => this.spinnerState(false)))
     .subscribe(
        () => {
          this.mainForm.reset();
          this.alertify.success('Saved successfully', 5);
          this.router.navigate(['/user/profile/view']);
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
