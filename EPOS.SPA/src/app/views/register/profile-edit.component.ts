import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { IProfile } from '../../_models/profile';
import { GenericValidator } from '../../_shared/generic-validator';
import { AlertifyService } from '../../_Services/alertify.service';
import { AuthService } from '../../_Services/auth.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errorMessage: string;
  mainForm: FormGroup;

  profile: IProfile = {
    id: 0,
    username: '',
    email: '',
    oldEmail: ''
  };

    // Use with the generic validation message class
    displayMessage: { [key: string]: string } = {};
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertify: AlertifyService ) {

      this.validationMessages = {
        username: {
          required: 'Please enter your username'
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
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]]
    });

    this.route.data.subscribe(data => {

      this.initDataModel(data['profile']);

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

  private initDataModel(profileFromSource: IProfile) {
    this.profile = profileFromSource;
    this.mainForm.patchValue({
      username: this.profile.username,
      email: this.profile.email
    });
  }

  SaveChanges(): void {

    if (this.mainForm.dirty && this.mainForm.valid) {

     const e = Object.assign({}, this.profile, this.mainForm.value);

     this.authService.updateProfile(e)
     .subscribe(
        (data) => {
          this.alertify.success('Saved successfully, please login with your new details', 5);
          this.authService.logout();
          this.router.navigate(['/login']);
         },
       (error: any) => this.alertify.error(error, 5)
     )
    } else {
     this.alertify.message('No data was changed on the form, hence the details not be updated.', 5);
    }

   }
}
