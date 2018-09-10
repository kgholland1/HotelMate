import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IWakeupList } from '../../_models/wakeup';
import { Pagination, PaginatedResult } from '../../_models/pagination';
import { KeepingService } from '../../_Services/keeping.service';
import { AlertifyService } from '../../_Services/alertify.service';
import * as m from 'moment';

@Component({
  selector: 'app-wakeup-list',
  templateUrl: './wakeup-list.component.html',
  styleUrls: ['./wakeup-list.component.scss']
})
export class WakeupListComponent implements OnInit {
  wakes: IWakeupList[];
  wakeParams: any = {};
  pagination: Pagination;
  entryList = [{value: 10, display: '10'}, {value: 15, display: '15'}, {value: 25, display: '25'}, {value: 50, display: '50'}];
  pagesDisplay: string;
  searchForm: FormGroup;

  constructor(private keepingService: KeepingService,
    private alertify: AlertifyService, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

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
      this.wakes = data['wake'].result;
      this.pagination = data['wake'].pagination;

      this.wakeParams.status = 'Pending,Processing';
      this.wakeParams.orderBy = 'Created';

      this.displayPageAction();
    })
  }
  loadWakes() {
    this.keepingService.getWakeups(this.pagination.currentPage, this.pagination.itemsPerPage, this.wakeParams)
      .subscribe((res: PaginatedResult<IWakeupList[]>) => {
        this.wakes = res.result;
        this.pagination = res.pagination;
        this.displayPageAction();
      }, error => {
        this.alertify.error(error, 5);
      });
  }
  private Reset() {
    this.wakeParams = {};
    this.wakeParams.orderBy = 'Created';
  }
  SearchBooking() {
    this.Reset();

    const fullnameControl = this.searchForm.get('fullname');
    if (fullnameControl.value.length > 0) {
      this.wakeParams.fullname = fullnameControl.value;
    }
    const emailControl = this.searchForm.get('email');
    if (emailControl.value.length > 0) {
      this.wakeParams.email = emailControl.value;
    }
    const phoneControl = this.searchForm.get('phone');
    if (phoneControl.value.length > 0) {
      this.wakeParams.phone = phoneControl.value;
    }
    const roomNumberControl = this.searchForm.get('roomNumber');
    if (roomNumberControl.value.length > 0) {
      this.wakeParams.roomNumber = roomNumberControl.value;
    }
    const bookingdateControl = this.searchForm.get('bookingdate');
    if (bookingdateControl.value != null ) {
      this.wakeParams.bookingDate = m(bookingdateControl.value).format('DD/MM/YYYY');
    }
    const showAllControl = this.searchForm.get('showAll');
    if (showAllControl.value) {
      this.wakeParams.all = showAllControl.value;
    }

    this.pagination.currentPage = 1;

    if (Object.keys(this.wakeParams).length > 1) {
      this.loadWakes();
    }

  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadWakes();
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
}
