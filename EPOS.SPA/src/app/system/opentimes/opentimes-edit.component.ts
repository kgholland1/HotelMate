import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';

import { GenericValidator } from './../../shared/generic-validator';
import { MessageModalComponent } from './../../shared/message-modal.component';
import { AlertifyService } from './../../core/alertify.service';
import { SystemService } from './../system.service';
import { NumberValidators } from './../../shared/number.validator';

import { IOpenHour } from './../../_models/OpenHour';

@Component({
  templateUrl: './opentimes-edit.component.html',
  styleUrls: ['./opentimes-edit.component.scss']
})
export class OpentimesEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Open Hours Edit';
  errorMessage: string;
  mainForm: FormGroup;
  bsModalRef: BsModalRef;
  spinnerprocessing = false;

  serviceList = [{value: 'Taxi', display: 'Taxi'}, {value: 'Luggage', display: 'Luggage'}, {value: 'Reservation', display: 'Reservation'}];

  openHour: IOpenHour = {
    id: 0,
    type: '',
    typeName: '',
    restaurant: '',
    start: '',
    end: '',
    interval: 5
  };

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private sub: Subscription;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private systemService: SystemService,
    private modalService: BsModalService,
    private alertify: AlertifyService) {

      this.validationMessages = {
        type: {
            required: 'Please select a service name.'
         },
         typeName: {
          required: 'Please enter the service type.'
         },
         start: {
          required: 'Please enter the start time.'
        },
        end: {
          required: 'Please enter the end time.'
        },
        interval: {
          required: 'Please enter the interval.',
          range: 'Interval  must be between 5 (lowest) and 60.00 (highest)'
        }
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
     }

  ngOnInit() {
    this.mainForm = this.fb.group({
      type:  ['', Validators.required],
      typeName:  ['', Validators.required],
      restaurant: '',
      start:  ['', Validators.required],
      end:  ['', Validators.required],
      interval:  [5, [Validators.required, NumberValidators.range(5, 60)]]
      });

  // Read the product Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id =  +params.get('id') || 0;
          this.getOpenHour(id);
      }
    );
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
  getOpenHour(id: number): void {
    if (id > 0) {
        this.spinnerState(true);
        this.systemService.getOpenHour(id)
        .pipe(finalize(() => this.spinnerState(false)))
        .subscribe(
            (openHour: IOpenHour) => this.onOpenHourRetrieved(openHour),
            (error: any) => this.alertify.error(error, 5)
        );
    } else {
        this.pageTitle = 'Add Open Hours';
    }
  }
  onOpenHourRetrieved(openHour: IOpenHour): void {
    if (this.mainForm) {
        this.mainForm.reset();
    }
    this.initDataModel(openHour);

    this.pageTitle = `Edit Open Hours: ${this.openHour.type} - ${this.openHour.typeName}`;

    // Update the data on the form
    this.mainForm.patchValue({
      type: this.openHour.type,
      typeName: this.openHour.typeName,
      restaurant: this.openHour.restaurant,
      start: this.openHour.start,
      end: this.openHour.end,
      interval: this.openHour.interval
    });
  }

  private initDataModel(openHourFromDB: IOpenHour) {
    this.openHour = openHourFromDB;
  }
  saveOpenHour(): void {
    if (this.mainForm.dirty && this.mainForm.valid) {
        // Copy the form values over the product object values
      const e = Object.assign({}, this.openHour, this.mainForm.value);

      if (this.openHour.id === 0) {
        this.spinnerState(true);
          this.systemService.createOpenHour(e)
          .pipe(finalize(() => this.spinnerState(false)))
          .subscribe(
              (data) => {
                this.mainForm.reset();
                this.alertify.success('Saved successfully', 5);
                this.router.navigate(['/config/system/opentimes']);
              },
            (error: any) => this.alertify.error(error, 5)
          )
      } else {
          this.initDataModel(e);
          this.spinnerState(true);
          this.systemService.updateOpenHour(e)
          .pipe(finalize(() => this.spinnerState(false)))
          .subscribe(
              () => {
                this.mainForm.reset();
                this.alertify.success('Saved successfully', 5);
                this.router.navigate(['/config/system/opentimes']);
              },
            (error: any) => this.alertify.error(error, 5)
          );
      }
     } else {
      this.router.navigate(['/config/system/opentimes']);
     }
  }
  deleteOpenHours() {

    const initialState = {
      title : this.openHour.type,
      message: 'Are you sure you want to delete this open hours'
    };

    this.bsModalRef = this.modalService.show(MessageModalComponent, {initialState});
    this.bsModalRef.content.msgResponse.subscribe((value) => {
      if (value) {
        this.systemService.deleteOpenHour(this.openHour.id).subscribe(() => {
            this.alertify.success('Open hours has been deleted.', 5);
            if (this.mainForm) {
                this.mainForm.reset();
            }
            this.router.navigate(['/config/system/opentimes']);
        }, error => {
            this.alertify.error('Failed to delete open hours.', 5)
        });
      }
    });
  }

  private spinnerState(state: boolean) {
    this.spinnerprocessing = state;
  }
}
