import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ILuggageList } from '../../_models/luggage';
import { Pagination, PaginatedResult } from '../../_models/pagination';
import { KeepingService } from '../../_Services/keeping.service';
import { AlertifyService } from '../../_Services/alertify.service';
import * as m from 'moment';

@Component({
  selector: 'app-luggage-list',
  templateUrl: './luggage-list.component.html',
  styleUrls: ['./luggage-list.component.scss']
})
export class LuggageListComponent implements OnInit {

  luggages: ILuggageList[];
  luggageParams: any = {};
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
      this.luggages = data['luggage'].result;
      this.pagination = data['luggage'].pagination;

      this.luggageParams.status = 'Pending,Processing';
      this.luggageParams.orderBy = 'Created';

      this.displayPageAction();
    })
  }
  loadLuggages() {
    this.keepingService.getLuggages(this.pagination.currentPage, this.pagination.itemsPerPage, this.luggageParams)
      .subscribe((res: PaginatedResult<ILuggageList[]>) => {
        this.luggages = res.result;
        this.pagination = res.pagination;
        this.displayPageAction();
      }, error => {
        this.alertify.error(error, 5);
      });
  }
  private Reset() {
    this.luggageParams = {};
    this.luggageParams.orderBy = 'Created';
  }
  SearchBooking() {
    this.Reset();

    const fullnameControl = this.searchForm.get('fullname');
    if (fullnameControl.value.length > 0) {
      this.luggageParams.fullname = fullnameControl.value;
    }
    const emailControl = this.searchForm.get('email');
    if (emailControl.value.length > 0) {
      this.luggageParams.email = emailControl.value;
    }
    const phoneControl = this.searchForm.get('phone');
    if (phoneControl.value.length > 0) {
      this.luggageParams.phone = phoneControl.value;
    }
    const roomNumberControl = this.searchForm.get('roomNumber');
    if (roomNumberControl.value.length > 0) {
      this.luggageParams.roomNumber = roomNumberControl.value;
    }
    const bookingdateControl = this.searchForm.get('bookingdate');
    if (bookingdateControl.value != null ) {
      this.luggageParams.bookingDate = m(bookingdateControl.value).format('DD/MM/YYYY');
    }
    const showAllControl = this.searchForm.get('showAll');
    if (showAllControl.value) {
      this.luggageParams.all = showAllControl.value;
    }

    this.pagination.currentPage = 1;

    if (Object.keys(this.luggageParams).length > 1) {
      this.loadLuggages();
    }

  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadLuggages();
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
