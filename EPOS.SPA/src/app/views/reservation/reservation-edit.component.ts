import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IReservation } from './../../_models/reservation';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { GenericValidator } from '../../_shared/generic-validator';
import { AlertifyService } from '../../_Services/alertify.service';
import { GuestService } from '../../_Services/guest.service';
import { NumberValidators } from '../../_Shared/number.validator';
import { AuthService } from '../../_Services/auth.service';

@Component({
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.scss']
})
export class ReservationEditComponent  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Edit Reservation';
  errorMessage: string;
  mainForm: FormGroup;
  approvalList = [{value: 'Yes', display: 'Yes'}, {value: 'No', display: 'No'}];
  openTimes: any[];


  reservation: IReservation = {
    id: 0,
    noOfPerson: 0,
    guestName: '',
    email: '',
    restaurantName: '',
    phone: '',
    resDate: '',
    roomNumber: '',
    resTime: '',
    typeName: '',
    resApproved: '',
    request: '',
    feedback: '',
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
    private guestService: GuestService,
    private authService: AuthService,
    private alertify: AlertifyService) {

      this.validationMessages = {
        noOfPerson: {
            required: 'Please enter the number of people.',
            range: 'Number of people must be between 1 and 50.'
        },
        resApproved: {
          required: 'Please select a response.'
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
      resApproved: ['', [Validators.required]],
      feedback: '',
      });

      this.sub = this.route.params.subscribe(p => {
        this.reservation.id = +p['id'] || 0;
      });

      if (this.reservation.id) {
        this.guestService.getReservation(this.reservation.id).subscribe(data => {
          this.openTimes = data.openTimes;
          this.onReservationRetrieved(data.reservationToReturn);
        },
        (error: any) => {
          this.alertify.error(error, 5)
          this.router.navigate(['/be/reservations']);
          }
        );
      }
    }
    onReservationRetrieved(reservation: any): void {
      if (this.mainForm) {
          this.mainForm.reset();
      }
      this.initDataModel(reservation);

      this.pageTitle = `Edit Reservation: ${this.reservation.guestName} - (${this.reservation.roomNumber})`;

      // Update the data on the form
      this.mainForm.patchValue({
        noOfPerson: this.reservation.noOfPerson,
        resTime: this.reservation.resTime,
        resApproved: this.reservation.resApproved,
        feedback: this.reservation.feedback

      });
    }
    private initDataModel(reservationFromDB: IReservation) {
      this.reservation = reservationFromDB;
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
        noOfPerson: this.reservation.noOfPerson,
        resTime: this.reservation.resTime,
        resApproved: this.reservation.resApproved,
        feedback: this.reservation.feedback
      });
    }
  saveReservation(action?: string): void {
      if (this.mainForm.dirty && this.mainForm.valid) {
          // Copy the form values over the product object values
      this.reservation.updatedOn = new Date();
      this.reservation.updatedBy = this.authService.decodedToken.unique_name;

      console.log(JSON.stringify(this.reservation));

        const e = Object.assign({}, this.reservation, this.mainForm.value);

            this.initDataModel(e);

            this.guestService.updateReservation(e)
            .subscribe(
                () => {
                  this.alertify.success('Saved successfully', 5);
                  if (action !== 'stay') {
                      this.router.navigate(['/be/reservations']);
                  }
                  this.saveAndContinue();
                },
              (error: any) => this.alertify.error(error, 5)
            );
       } else {
        if (action !== 'stay') {
            this.router.navigate(['/be/reservations']);
        }
       }
    }

  deleteReservation() {
    this.alertify.confirm(this.reservation.guestName, 'Are you sure you want to delete this reservation?', () => {
      this.guestService.setReservationAsDelete(this.reservation.id).subscribe(() => {
        this.alertify.success('Reservation has been deleted.', 5);
        this.router.navigate(['/be/reservations']);
      });
    });
  }
}
