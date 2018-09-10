import { NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-note-modal',
  templateUrl: './note-modal.component.html',
  styleUrls: ['./note-modal.component.scss']
})
export class NoteModalComponent implements OnInit {

  @Output() newMessage = new EventEmitter();
  message: string;
  guestname: string;
  bookingId: number;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }
  AddNote(noteForm: NgForm) {

    if (noteForm.valid) {

      this.newMessage.emit(this.message);

      this.bsModalRef.hide();
    }
  }
}
