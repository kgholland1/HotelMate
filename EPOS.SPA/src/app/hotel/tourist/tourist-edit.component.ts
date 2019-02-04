import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';

import { GenericValidator } from './../../shared/generic-validator';
import { IPhoto } from './../../_models/photo';
import { ITourist } from './../../_models/tourist';

import { MessageModalComponent } from './../../shared/message-modal.component';
import { TouristPhoto } from './../../_models/touristPhoto';
import { AlertifyService } from './../../core/alertify.service';
import { HotelService } from './../hotel.service';

@Component({
  templateUrl: './tourist-edit.component.html',
  styleUrls: ['./tourist-edit.component.scss']
})
export class TouristEditComponent implements OnInit, AfterViewInit, OnDestroy  {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  bsModalRef: BsModalRef;
  pageTitle  = 'Tourist Guide Edit';
  errorMessage: string;
  spinnerprocessing = false;
  mainForm: FormGroup;
  toristTypeList = [{value: 'Bar', display: 'Bar'}, {value: 'Restaurant', display: 'Restaurant'},
    {value: 'Shopping', display: 'Shopping'}, {value: 'SiteSeeing', display: 'Site Seeing'},
    {value: 'Transportation', display: 'Transportation'}];

  tourist: ITourist = {
    id: 0,
    touristType: '',
    tourName: '',
    address: '',
    tourDesc: '',
    phone: '',
    email: '',
    website: '',
    direction: '',
    facebook: '',
    otMonday: '',
    otTuesday: '',
    otWednesday: '',
    otThursday: '',
    otFriday: '',
    otSaturday: '',
    otSunday: '',
    otMessage: ''
  };

  photos: IPhoto[] = [];

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private sub: Subscription;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private modalService: BsModalService,
    private alertify: AlertifyService) {


      this.validationMessages = {
        touristType: {
          required: 'Please select the type from the down-down box.'
       },
        tourName: {
            required: 'Please enter the name.'
         },
        email: {
        pattern: 'Please enter a valid email address.'
        },
        direction: {
            required: 'Please enter the direction.'
          },
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
     }

     ngOnInit() {
      this.mainForm = this.fb.group({
        touristType: ['', Validators.required],
        tourName: ['', Validators.required],
        address: '',
        tourDesc: '',
        phone: '',
        email: ['', [Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
        website: '',
        direction: ['', Validators.required],
        facebook: '',
        otMonday: '',
        otTuesday: '',
        otWednesday: '',
        otThursday: '',
        otFriday: '',
        otSaturday: '',
        otSunday: '',
        otMessage: ''
        });

    // Read the product Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
          const id = +params.get('id') || 0;
          this.getTourist(id);
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

getTourist(id: number): void {
  if (id > 0) {
    this.spinnerState(true);
    this.hotelService.getTourist(id)
    .pipe(finalize(() => this.spinnerState(false)))
    .subscribe(
        (touristPhoto: TouristPhoto) => {
          this.onTouristRetrieved(touristPhoto.touristToReturn);
          this.photos = touristPhoto.photoToReturn;
        },
        (error: any) => this.alertify.error(error, 5)
    );
  } else {
      this.pageTitle = 'Add Tourist Guide';
  }
}

onTouristRetrieved(tourist: ITourist): void {
  if (this.mainForm) {
      this.mainForm.reset();
  }
  this.initDataModel(tourist);

  this.pageTitle = `Edit Tourist Guide: ${this.tourist.tourName}`;

  // Update the data on the form
  this.mainForm.patchValue({
    touristType: this.tourist.touristType,
    tourName: this.tourist.tourName,
    address: this.tourist.address,
    tourDesc: this.tourist.tourDesc,
    phone: this.tourist.phone,
    email: this.tourist.email,
    website: this.tourist.website,
    direction: this.tourist.direction,
    facebook: this.tourist.facebook,
    otMonday: this.tourist.otMonday,
    otTuesday: this.tourist.otTuesday,
    otWednesday: this.tourist.otWednesday,
    otThursday: this.tourist.otThursday,
    otFriday: this.tourist.otFriday,
    otSaturday: this.tourist.otSaturday,
    otSunday: this.tourist.otSunday,
    otMessage: this.tourist.otMessage
  });

  this.mainForm.controls['tourDesc'].markAsPristine()
}

  private initDataModel(touristFromDB: ITourist) {
    this.tourist = touristFromDB;
  }
  private saveAndContinue() {
    if (this.mainForm) {
        this.mainForm.reset();
    }

    this.mainForm.patchValue({
      touristType: this.tourist.touristType,
      tourName: this.tourist.tourName,
      address: this.tourist.address,
      tourDesc: this.tourist.tourDesc,
      phone: this.tourist.phone,
      email: this.tourist.email,
      website: this.tourist.website,
      direction: this.tourist.direction,
      facebook: this.tourist.facebook,
      otMonday: this.tourist.otMonday,
      otTuesday: this.tourist.otTuesday,
      otWednesday: this.tourist.otWednesday,
      otThursday: this.tourist.otThursday,
      otFriday: this.tourist.otFriday,
      otSaturday: this.tourist.otSaturday,
      otSunday: this.tourist.otSunday,
      otMessage: this.tourist.otMessage
    });

    this.mainForm.controls['tourDesc'].markAsPristine()

  }

  saveTourist(action?: string): void {
    if (this.mainForm.dirty && this.mainForm.valid) {
        // Copy the form values over the product object values
      const e = Object.assign({}, this.tourist, this.mainForm.value);

      if (this.tourist.id === 0) {
        this.spinnerState(true);
        this.hotelService.createTourist(e)
        .pipe(finalize(() => this.spinnerState(false)))
        .subscribe(
            (data) => {
            this.initDataModel(data);
              this.alertify.success('Saved successfully', 5);
              if (action !== 'stay') {
                  this.router.navigate(['/hotel/tourists']);
              }
              this.saveAndContinue();
            },
          (error: any) => this.alertify.error(error, 5)
        )
      } else {
          this.initDataModel(e);
          this.spinnerState(true);
          this.hotelService.updateTourist(e)
          .pipe(finalize(() => this.spinnerState(false)))
          .subscribe(
              () => {
                this.alertify.success('Saved successfully', 5);
                if (action !== 'stay') {
                    this.router.navigate(['/hotel/tourists']);
                }
                this.saveAndContinue();
              },
            (error: any) => this.alertify.error(error, 5)
          );
      }
     } else {
      if (action !== 'stay') {
          this.router.navigate(['/hotel/tourists']);
      }
     }
  }
  deleteTourist() {
    const initialState = {
      title : 'Tourist Guide: ' + this.tourist.tourName,
      message: 'Are you sure you want to delete this tourist guide'
    };

    this.bsModalRef = this.modalService.show(MessageModalComponent, {initialState});
    this.bsModalRef.content.msgResponse.subscribe((value) => {
      if (value) {
        this.hotelService.deleteTourist(this.tourist.id).subscribe(() => {
              this.alertify.success('Tourist guide has been deleted.', 5);
              if (this.mainForm) {
                  this.mainForm.reset();
              }
              this.router.navigate(['/hotel/tourists']);
          }, error => {
              this.alertify.error('Failed to delete tourist guide.', 5)
          });
      }
    });
  }

  private spinnerState(state: boolean) {
    this.spinnerprocessing = state;
  }
}

