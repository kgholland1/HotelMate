import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

import { finalize } from 'rxjs/operators';

import * as m from 'moment';
import { AlertifyService } from './../../core/alertify.service';

import { GuestService } from './../../core/service/guest.service';
import { Pagination, PaginatedResult } from './../../_models/pagination';
import { IBookingList } from './../../_models/booking';

@Component({
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.scss']
})
export class GuestListComponent implements OnInit {
  bookings: IBookingList[];
  bookingParams: any = {};
  pagination: Pagination;
  entryList = [{value: 10, display: '10'}, {value: 15, display: '15'}, {value: 25, display: '25'}, {value: 50, display: '50'}];
  pagesDisplay: string;
  searchForm: FormGroup;
  spinnerprocessing = false;

  constructor(private guestService: GuestService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      checkindate: null,
      fullname: '',
      email: '',
      showAll: false,
      roomNumber: ''
    });

    this.route.data.subscribe(data => {
    this.bookings = data['guest'].result;
    this.pagination = data['guest'].pagination;

    this.bookingParams.orderBy = 'CheckIn';

    this.displayPageAction();
    })
  }
  loadBookings() {
    this.guestService.bookingParams.orderBy = this.bookingParams.orderBy;
    this.spinnerState(true);
    this.guestService.getBookings(this.pagination.currentPage, this.pagination.itemsPerPage)
    .pipe(finalize(() => this.spinnerState(false)))
    .subscribe((res: PaginatedResult<IBookingList[]>) => {
      this.bookings = res.result;
      this.pagination = res.pagination;
      this.displayPageAction();
    }, error => {
      this.alertify.error(error, 5);
    });
  }
  private Reset() {
    this.bookingParams = {};
    this.bookingParams.orderBy = 'CheckIn';
  }

  SearchBooking() {
    this.Reset();

    const fullnameControl = this.searchForm.get('fullname');
    if (fullnameControl.value.length > 0) {
      this.bookingParams.fullname = fullnameControl.value;
    }
    const emailControl = this.searchForm.get('email');
    if (emailControl.value.length > 0) {
      this.bookingParams.email = emailControl.value;
    }
    const roomNumberControl = this.searchForm.get('roomNumber');
    if (roomNumberControl.value.length > 0) {
      this.bookingParams.roomNumber = roomNumberControl.value;
    }
    const checkindateControl = this.searchForm.get('checkindate');
    if (checkindateControl.value != null ) {
      this.bookingParams.checkInDate = m(checkindateControl.value).format('DD/MM/YYYY');
    }
    const showAllControl = this.searchForm.get('showAll');
    if (showAllControl.value) {
      this.bookingParams.all = showAllControl.value;
    }

    this.pagination.currentPage = 1;

    if (Object.keys(this.bookingParams).length > 1) {
      this.guestService.bookingParams = this.bookingParams;
      this.loadBookings();
    }

  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadBookings();
  }
  private displayPageAction() {
    const minPage = (this.pagination.currentPage === 1) ? 1 : (((this.pagination.currentPage - 1) * this.pagination.itemsPerPage) + 1)

    const maxPage = ((this.pagination.currentPage * this.pagination.itemsPerPage) > this.pagination.totalItems) ?
      this.pagination.totalItems : this.pagination.currentPage * this.pagination.itemsPerPage

      if (maxPage > 0) {
        this.pagesDisplay = minPage.toString() + ' - ' + maxPage.toString() + ' of ' +  this.pagination.totalItems  + ' items.';
      } else {
        this.pagesDisplay = 'No items to display.'
      }
  }
  private spinnerState(state: boolean) {
    this.spinnerprocessing = state;
  }
}

