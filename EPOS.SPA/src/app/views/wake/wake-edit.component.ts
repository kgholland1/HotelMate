import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChildren, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { IWakeup } from '../../_models/wakeup';
import { GenericValidator } from '../../_shared/generic-validator';
import { KeepingService } from '../../_Services/keeping.service';
import { AuthService } from '../../_Services/auth.service';
import { AlertifyService } from '../../_Services/alertify.service';

@Component({
  selector: 'app-wake-edit',
  templateUrl: './wake-edit.component.html',
  styleUrls: ['./wake-edit.component.scss']
})
export class WakeEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Wakeup Calls';
  errorMessage: string;
  mainForm: FormGroup;
  statusList = [{value: 'Pending', display: 'Pending'}, {value: 'Processing', display: 'Processing'},
     {value: 'Complete', display: 'Complete'}, {value: 'Cancelled', display: 'Cancelled'}];

  wake: IWakeup = {
    id: 0,
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

      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
    }

  ngOnInit() {
    this.mainForm = this.fb.group({
      resTime: '',
      bookStatus: '',
      response: '',
      });

      this.sub = this.route.params.subscribe(p => {
        this.wake.id = +p['id'] || 0;
      });

      if (this.wake.id) {
        this.keepingService.getWake(this.wake.id).subscribe(
        (wake: IWakeup) => this.onWakeupRetrieved(wake),
        (error: any) => {
          this.alertify.error(error, 5)
          this.router.navigate(['/be/wakes']);
          }
        );
      }
  }
  onWakeupRetrieved(taxi: any): void {
    if (this.mainForm) {
        this.mainForm.reset();
    }
    this.initDataModel(taxi);

    this.pageTitle = `Edit Wakeup call: ${this.wake.guestName} - (${this.wake.roomNumber})`;

    // Update the data on the form
    this.mainForm.patchValue({
      resTime: this.wake.resTime,
      bookStatus: this.wake.bookStatus,
      response: this.wake.response

    });
  }
  private initDataModel(wakeFromDB: IWakeup) {
    this.wake = wakeFromDB;
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
      resTime: this.wake.resTime,
      bookStatus: this.wake.bookStatus,
      response: this.wake.response
    });
  }
  saveWake(action?: string): void {
    if (this.mainForm.dirty && this.mainForm.valid) {
        // Copy the form values over the product object values
    this.wake.updatedOn = new Date();
    this.wake.updatedBy = this.authService.decodedToken.unique_name;


    const e = Object.assign({}, this.wake, this.mainForm.value);

        this.initDataModel(e);

        this.keepingService.updateWakeup(e)
        .subscribe(
            () => {
              this.alertify.success('Saved successfully', 5);
              if (action !== 'stay') {
                  this.router.navigate(['/be/wakes']);
              }
              this.saveAndContinue();
            },
          (error: any) => this.alertify.error(error, 5)
        );
     } else {
      if (action !== 'stay') {
          this.router.navigate(['/be/wakes']);
      }
     }
  }

  deleteWakeup() {
  this.alertify.confirm(this.wake.guestName, 'Are you sure you want to delete this wakeup call request?', () => {
    this.keepingService.setWakeUpAsDelete(this.wake.id).subscribe(() => {
      this.alertify.success('Wakeup request has been deleted.', 5);
      this.router.navigate(['/be/wakes']);
    });
  });
  }
}
