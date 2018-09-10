import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IBooking } from '../../_models/booking';
import { GuestService } from '../../_Services/guest.service';
import { AlertifyService } from '../../_Services/alertify.service';
import 'rxjs/add/observable/forkJoin';
import { INote } from '../../_models/note';
import { NoteModalComponent } from './note-modal.component';

@Component({
  templateUrl: './guest-view.component.html',
  styleUrls: ['./guest-view.component.scss']
})
export class GuestViewComponent implements OnInit, OnDestroy {

  booking: IBooking = {
    id: 0,
    guestName: '',
    email: '',
    phone: '',
    checkIn: null,
    roomNumber: '',
    checkOut: null,
    checkOutBy: '',
    updatedOn: null,
    updatedBy: ''
  };

  notes: INote[] = [];
  newNote: INote = {
    id: 0,
    notes: '',
    createdOn: null,
    createdBy: '',
    bookingId: 0
  };
  bsModalRef: BsModalRef;
  private sub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private guestService: GuestService,
    private alertify: AlertifyService, private modalService: BsModalService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(p => {
      this.booking.id = +p['id'] || 0;
    });


    if (this.booking.id) {
      const sources = [
        this.guestService.getBooking(this.booking.id),
        this.guestService.getNotes(this.booking.id)
      ];

      Observable.forkJoin(sources).subscribe(data => {
        this.booking = data[0];
        this.notes = data[1];
      },
      (error: any) => {
        this.alertify.error(error, 5)
        this.router.navigate(['/be/guests']);
        }
      );
    }

  }
  ngOnDestroy(): void {
     this.sub.unsubscribe();
  }
  addNote() {
    const initialState = {
      guestname: this.booking.guestName,
      bookingId: this.booking.id
    };
    this.bsModalRef = this.modalService.show(NoteModalComponent, {initialState});
    this.bsModalRef.content.newMessage.subscribe((value) =>  {
      this.newNote.notes = value;
      this.newNote.bookingId = this.booking.id;
      this.guestService.createNote(this.newNote)
      .subscribe(
          (res: INote) => {
            this.notes.push(res);
            this.alertify.success('Note added successfully', 5);

          },
        (error: any) => this.alertify.error(error, 5)
      );
    });
  }
  deleteGuest() {
    this.alertify.confirm(this.booking.guestName, 'Are you sure you want to delete this guest?', () => {
      this.guestService.setBookingAsDelete(this.booking.id).subscribe(() => {
        this.alertify.success('Guest has been deleted.', 5);
        this.router.navigate(['/be/guests']);
      });
    });
  }
}
