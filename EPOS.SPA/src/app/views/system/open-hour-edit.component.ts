import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IOpenHour } from './../../_models/OpenHour';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChildren, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { GenericValidator } from '../../_shared/generic-validator';
import { SystemService } from '../../_Services/system.service';
import { AlertifyService } from '../../_Services/alertify.service';
import { NumberValidators } from '../../_Shared/number.validator';

@Component({
  selector: 'app-open-hour-edit',
  templateUrl: './open-hour-edit.component.html',
  styleUrls: ['./open-hour-edit.component.scss']
})
export class OpenHourEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Open Hours Edit';
  errorMessage: string;
  mainForm: FormGroup;
  serviceList = [{value: 'Taxi', display: 'Taxi'}, {value: 'Luggage', display: 'Luggage'}, {value: 'Reservation', display: 'Reservation'}];

  openHour: IOpenHour = {
    id: 0,
    type: '',
    typeName: '',
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
      start:  ['', Validators.required],
      end:  ['', Validators.required],
      interval:  [5, [Validators.required, NumberValidators.range(5, 60)]]
      });

  // Read the product Id from the route parameter
    this.sub = this.route.params.subscribe(
      params => {
          const id = +params['id'];
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
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.mainForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.mainForm);
    });
  }
  getOpenHour(id: number): void {
    if (id > 0) {
        this.systemService.getOpenHour(id)
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
          this.systemService.createOpenHour(e)
          .subscribe(
              (data) => {
                this.mainForm.reset();
                this.alertify.success('Saved successfully', 5);
                this.router.navigate(['/be/openHours']);
              },
            (error: any) => this.alertify.error(error, 5)
          )
      } else {
          this.systemService.updateOpenHour(e)
          .subscribe(
              () => {
                this.mainForm.reset();
                this.alertify.success('Saved successfully', 5);
                this.router.navigate(['/be/openHours']);
              },
            (error: any) => this.alertify.error(error, 5)
          );
      }
     } else {
      this.router.navigate(['/be/openHours']);
     }
  }
  deleteOpenHours() {
    this.alertify.confirm(this.openHour.type, 'Are you sure you want to delete this open hours?', () => {
      this.systemService.deleteOpenHour(this.openHour.id).subscribe(() => {
        this.alertify.success('Open Hours has been deleted.', 5);
        this.router.navigate(['/be/openHours']);
      }, error => {
        this.alertify.error('Failed to delete open Hours', 5)
      });
    });
  }
}
