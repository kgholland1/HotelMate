
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import * as m from 'moment';
import { AlertifyService } from './../../core/alertify.service';
import { Pagination, PaginatedResult } from './../../_models/pagination';

import { HousekeepService } from './../../core/service/housekeep.service';
import { ITaxiList } from './../../_models/taxi';

@Component({
  templateUrl: './taxi-list.component.html',
  styleUrls: ['./taxi-list.component.scss']
})
export class TaxiListComponent implements OnInit {
  taxis: ITaxiList[];
  taxiParams: any = {};
  pagination: Pagination;
  entryList = [{value: 10, display: '10'}, {value: 15, display: '15'}, {value: 25, display: '25'}, {value: 50, display: '50'}];
  pagesDisplay: string;
  searchForm: FormGroup;
  spinnerprocessing = false;

  constructor(private housekeepService: HousekeepService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      bookingdate: null,
      fullname: '',
      email: '',
      phone: '',
      showAll: false,
      roomNumber: ''
    });

    this.route.data.subscribe(data => {
      this.taxis = data['taxi'].result;
      this.pagination = data['taxi'].pagination;

      this.taxiParams.status = 'Pending,Processing';
      this.taxiParams.orderBy = 'Created';

      this.displayPageAction();
    })
  }
  loadTaxis() {
    this.housekeepService.taxiParams.orderBy = this.taxiParams.orderBy;
    this.spinnerState(true);
    this.housekeepService.getTaxis(this.pagination.currentPage, this.pagination.itemsPerPage)
    .pipe(finalize(() => this.spinnerState(false)))
    .subscribe((res: PaginatedResult<ITaxiList[]>) => {
      this.taxis = res.result;
      this.pagination = res.pagination;
      this.displayPageAction();
    }, error => {
      this.alertify.error(error, 5);
    });
  }
  loadSorting() {
    this.pagination.currentPage = 1;
    this.loadTaxis();
  }
  private Reset() {
    this.taxiParams = {};
    this.taxiParams.orderBy = 'Created';
  }
  SearchBooking() {
    this.Reset();

    const fullnameControl = this.searchForm.get('fullname');
    if (fullnameControl.value.length > 0) {
      this.taxiParams.fullname = fullnameControl.value;
    }
    const emailControl = this.searchForm.get('email');
    if (emailControl.value.length > 0) {
      this.taxiParams.email = emailControl.value;
    }
    const phoneControl = this.searchForm.get('phone');
    if (phoneControl.value.length > 0) {
      this.taxiParams.phone = phoneControl.value;
    }
    const roomNumberControl = this.searchForm.get('roomNumber');
    if (roomNumberControl.value.length > 0) {
      this.taxiParams.roomNumber = roomNumberControl.value;
    }
    const bookingdateControl = this.searchForm.get('bookingdate');
    if (bookingdateControl.value != null ) {
      this.taxiParams.bookingDate = m(bookingdateControl.value).format('DD/MM/YYYY');
    }
    const showAllControl = this.searchForm.get('showAll');
    if (showAllControl.value) {
      this.taxiParams.all = showAllControl.value;
    }

    this.pagination.currentPage = 1;

    if (Object.keys(this.taxiParams).length > 1) {
      this.housekeepService.taxiParams = this.taxiParams;
      this.loadTaxis();
    }

  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadTaxis();
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
