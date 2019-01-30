import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from './../../core/alertify.service';
import { HotelService } from './../hotel.service';
import { Pagination, PaginatedResult } from './../../_models/pagination';
import { ITourist } from './../../_models/tourist';

@Component({
  templateUrl: './torist-list.component.html',
  styleUrls: ['./torist-list.component.scss']
})
export class ToristListComponent implements OnInit {
  tourists: ITourist[];
  tourParams: any = {};
  pagination: Pagination;
  pagesDisplay: string;
  entryList = [{value: 10, display: '10'}, {value: 15, display: '15'}, {value: 25, display: '25'}, {value: 50, display: '50'}];
  spinnerprocessing = false;

  constructor(private touristService: HotelService,
    private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.tourists = data['tourist'].result;
      this.pagination = data['tourist'].pagination;
      })

      this.displayPageAction();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadtourists();
  }

  loadtourists() {
    this.spinnerState(true);
    this.touristService.getTourists(this.pagination.currentPage, this.pagination.itemsPerPage)
    .pipe(finalize(() => this.spinnerState(false)))
    .subscribe((res: PaginatedResult<ITourist[]>) => {
      this.tourists = res.result;
      this.pagination = res.pagination;
      this.displayPageAction();
    }, error => {
      this.alertify.error(error, 5);
    });
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
