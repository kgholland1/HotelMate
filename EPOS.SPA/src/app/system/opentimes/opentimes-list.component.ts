import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AlertifyService } from './../../core/alertify.service';
import { SystemService } from './../system.service';
import { Pagination, PaginatedResult } from './../../_models/pagination';

import { IOpenHour } from './../../_models/OpenHour';

@Component({
  templateUrl: './opentimes-list.component.html',
  styleUrls: ['./opentimes-list.component.scss']
})
export class OpentimesListComponent implements OnInit {
  openHours: IOpenHour[];
  pagination: Pagination;
  pagesDisplay: string;
  spinnerprocessing = false;

  entryList = [{value: 10, display: '10'}, {value: 15, display: '15'}, {value: 25, display: '25'}, {value: 50, display: '50'}];

  constructor(private openHourService: SystemService,
    private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.openHours = data['opentimes'].result;
      this.pagination = data['opentimes'].pagination;
      })

      this.displayPageAction();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadopenHours();
  }
  loadopenHours() {
    this.spinnerState(true);
    this.openHourService.getOpenHours(this.pagination.currentPage, this.pagination.itemsPerPage)
    .pipe(finalize(() => this.spinnerState(false)))
    .subscribe((res: PaginatedResult<IOpenHour[]>) => {
      this.openHours = res.result;
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
