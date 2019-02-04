import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';

import { GenericValidator } from './../../shared/generic-validator';
import { MessageModalComponent } from './../../shared/message-modal.component';
import { AlertifyService } from './../../core/alertify.service';
import { NumberValidators } from './../../shared/number.validator';

import { AuthService } from './../../core/auth.service';
import { RestaurantService } from './../../core/service/restaurant.service';

import { IReservation } from './../../_models/reservation';

@Component({
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.scss']
})
export class ReservationEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Edit Reservation';
  errorMessage: string;
  mainForm: FormGroup;
  approvalList = [{value: 'Yes', display: 'Yes'}, {value: 'No', display: 'No'}];
  completeList = [{value: true, display: 'Yes'}, {value: false, display: 'No'}];
  openTimes: any[];
  bsModalRef: BsModalRef;
  spinnerprocessing = false;

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
    isCompleted: false,
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
    private restaurantService: RestaurantService,
    private modalService: BsModalService,
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
      isCompleted: false,
      feedback: '',
      });

      this.sub = this.route.paramMap.subscribe(p => {
        this.reservation.id = +p.get('id') || 0;
      });

      if (this.reservation.id) {
        this.spinnerState(true);
        this.restaurantService.getReservation(this.reservation.id)
        .pipe(finalize(() => this.spinnerState(false)))
        .subscribe(data => {
          this.openTimes = data.openTimes;
          this.onReservationRetrieved(data.reservationToReturn);
        },
        (error: any) => {
          this.alertify.error(error, 5)
          this.router.navigate(['/restaurant/reservations']);
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
        feedback: this.reservation.feedback,
        isCompleted: this.reservation.isCompleted

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
            .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

      // Merge the blur event observable with the valueChanges observable
      merge(this.mainForm.valueChanges, ...controlBlurs).pipe(
          debounceTime(800)
          ).subscribe(value => {
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
        feedback: this.reservation.feedback,
        isCompleted: this.reservation.isCompleted
      });
    }

  saveReservation(action?: string): void {
      if (this.mainForm.dirty && this.mainForm.valid) {

        this.reservation.updatedOn = new Date();
        this.reservation.updatedBy = this.authService.decodedToken.unique_name;

        console.log(JSON.stringify(this.reservation));

        const e = Object.assign({}, this.reservation, this.mainForm.value);

            this.initDataModel(e);

            this.spinnerState(true);
            this.restaurantService.updateReservation(e)
            .pipe(finalize(() => this.spinnerState(false)))
            .subscribe(
                () => {
                  this.alertify.success('Saved successfully', 5);
                  if (action !== 'stay') {
                      this.router.navigate(['/restaurant/reservations']);
                  }
                  this.saveAndContinue();
                },
              (error: any) => this.alertify.error(error, 5)
            );
       } else {
        if (action !== 'stay') {
            this.router.navigate(['/restaurant/reservations']);
        }
       }
    }

  deleteReservation() {
    const initialState = {
      title : this.reservation.guestName,
      message: 'Are you sure you want to delete this reservation'
    };

    this.bsModalRef = this.modalService.show(MessageModalComponent, {initialState});
    this.bsModalRef.content.msgResponse.subscribe((value) => {
      if (value) {
        this.restaurantService.setReservationAsDelete(this.reservation.id).subscribe(() => {
            this.alertify.success('Reservation has been deleted.', 5);
            if (this.mainForm) {
                this.mainForm.reset();
            }
            this.router.navigate(['/restaurant/reservations']);
        }, error => {
            this.alertify.error('Failed to delete reservation.', 5)
        });
      }
    });
  }
  private spinnerState(state: boolean) {
    this.spinnerprocessing = state;
  }
}
