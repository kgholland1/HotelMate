import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

import { finalize } from 'rxjs/operators';

import * as m from 'moment';
import { AlertifyService } from './../../core/alertify.service';

import { RestaurantService } from './../../core/service/restaurant.service';
import { Pagination, PaginatedResult } from './../../_models/pagination';
import { IReservationList } from './../../_models/reservation';

@Component({
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {

  reservations: IReservationList[];
  reservationParams: any = {};
  pagination: Pagination;
  entryList = [{value: 10, display: '10'}, {value: 15, display: '15'}, {value: 25, display: '25'}, {value: 50, display: '50'}];
  pagesDisplay: string;
  searchForm: FormGroup;
  spinnerprocessing = false;

  constructor(private restaurantService: RestaurantService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      reservationdate: null,
      fullname: '',
      email: '',
      phone: '',
      showAll: false,
      roomNumber: ''
    });

    this.route.data.subscribe(data => {
      this.reservations = data['reservation'].result;
      this.pagination = data['reservation'].pagination;

      this.reservationParams.isNew = true;
      this.reservationParams.orderBy = 'Created';

      this.displayPageAction();
    })
  }
  loadReservations() {
    this.restaurantService.reservationParams.orderBy = this.reservationParams.orderBy;
    this.spinnerState(true);
    this.restaurantService.getReservations(this.pagination.currentPage, this.pagination.itemsPerPage)
    .pipe(finalize(() => this.spinnerState(false)))
    .subscribe((res: PaginatedResult<IReservationList[]>) => {
      this.reservations = res.result;
      this.pagination = res.pagination;
      this.displayPageAction();
    }, error => {
      this.alertify.error(error, 5);
    });
  }
  private Reset() {
    this.reservationParams = {};
    this.reservationParams.orderBy = 'Created';
  }
  SearchReservation() {
    this.Reset();

    const fullnameControl = this.searchForm.get('fullname');
    if (fullnameControl.value.length > 0) {
      this.reservationParams.fullname = fullnameControl.value;
    }
    const emailControl = this.searchForm.get('email');
    if (emailControl.value.length > 0) {
      this.reservationParams.email = emailControl.value;
    }
    const phoneControl = this.searchForm.get('phone');
    if (phoneControl.value.length > 0) {
      this.reservationParams.phone = phoneControl.value;
    }
    const roomNumberControl = this.searchForm.get('roomNumber');
    if (roomNumberControl.value.length > 0) {
      this.reservationParams.roomNumber = roomNumberControl.value;
    }
    const reservationdateControl = this.searchForm.get('reservationdate');
    if (reservationdateControl.value != null ) {
      this.reservationParams.reservationDate = m(reservationdateControl.value).format('DD/MM/YYYY');
    }
    const showAllControl = this.searchForm.get('showAll');
    if (showAllControl.value) {
      this.reservationParams.all = showAllControl.value;
    }

    this.pagination.currentPage = 1;

    if (Object.keys(this.reservationParams).length > 1) {
      this.restaurantService.reservationParams = this.reservationParams;
      this.loadReservations();
    }

  }
  loadSorting() {
    this.pagination.currentPage = 1;
    this.loadReservations();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadReservations();
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
