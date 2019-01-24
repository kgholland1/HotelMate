import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss']
})
export class MessageModalComponent implements OnInit {

  @Output() msgResponse = new EventEmitter<boolean>();

  title: string;
  message: string;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }

  updateResponse(option: boolean) {
    this.msgResponse.emit(option);
    this.bsModalRef.hide();
  }
}
