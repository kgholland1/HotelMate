import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { IRoom } from '../../_models/room';
import { GenericValidator } from '../../_shared/generic-validator';
import { HotelService } from '../../_Services/hotel.service';
import { AlertifyService } from '../../_Services/alertify.service';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.scss']
})
export class RoomEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Room Edit';
  errorMessage: string;
  mainForm: FormGroup;

  room: IRoom = {
    id: 0,
    roomNo: '',
    floorNo: '',
    building: '',
    roomDesc: ''
  };

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private sub: Subscription;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private alertify: AlertifyService) {


      this.validationMessages = {
        roomNo: {
            required: 'Please enter the room Number.'
         }
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
     }

  ngOnInit() {
    this.mainForm = this.fb.group({
      roomNo:  ['', Validators.required],
      floorNo: '',
      building: '',
      roomDesc: ''
      });

  // Read the product Id from the route parameter
  this.sub = this.route.params.subscribe(
    params => {
        const id = +params['id'];
        this.getRoom(id);
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

getRoom(id: number): void {
    if (id > 0) {
        this.hotelService.getRoom(id)
        .subscribe(
            (extra: IRoom) => this.onProductRetrieved(extra),
            (error: any) => this.alertify.error(error, 5)
        );
    } else {
        this.pageTitle = 'Add Room';
    }
}
onProductRetrieved(room: IRoom): void {
  if (this.mainForm) {
      this.mainForm.reset();
  }
  this.initDataModel(room);

  this.pageTitle = `Edit Room: ${this.room.roomNo}`;

  // Update the data on the form
  this.mainForm.patchValue({
  roomNo: this.room.roomNo,
  floorNo: this.room.floorNo,
  building: this.room.building,
  roomDesc: this.room.roomDesc
  });
}


private initDataModel(extraFromDB: IRoom) {
  this.room = extraFromDB;
}

private saveAndContinue() {
  if (this.mainForm) {
      this.mainForm.reset();
  }

  this.mainForm.patchValue({
    roomNo: this.room.roomNo,
    floorNo: this.room.floorNo,
    building: this.room.building,
    roomDesc: this.room.roomDesc
  });
}

saveRoom(action?: string): void {
  if (this.mainForm.dirty && this.mainForm.valid) {
      // Copy the form values over the product object values
    const e = Object.assign({}, this.room, this.mainForm.value);

    if (this.room.id === 0) {
        this.hotelService.createRoom(e)
        .subscribe(
            (data) => {
            this.initDataModel(data);
              this.alertify.success('Saved successfully', 5);
              if (action !== 'stay') {
                  this.router.navigate(['/be/rooms']);
              }
              this.saveAndContinue();
            },
          (error: any) => this.alertify.error(error, 5)
        )
    } else {
        this.initDataModel(e);

        this.hotelService.updateRoom(e)
        .subscribe(
            () => {
              this.alertify.success('Saved successfully', 5);
              if (action !== 'stay') {
                  this.router.navigate(['/be/rooms']);
              }
              this.saveAndContinue();
            },
          (error: any) => this.alertify.error(error, 5)
        );
    }
   } else {
    if (action !== 'stay') {
        this.router.navigate(['/be/rooms']);
    }
   }
}
deleteRoom() {
  this.alertify.confirm('Room: ' + this.room.roomNo, 'Are you sure you want to delete this room?', () => {
    this.hotelService.deleteRoom(this.room.id).subscribe(() => {
      this.alertify.success('Room has been deleted.', 5);
      this.router.navigate(['/be/rooms']);
    }, error => {
      this.alertify.error('Failed to delete room', 5)
    });
  });
}

}
