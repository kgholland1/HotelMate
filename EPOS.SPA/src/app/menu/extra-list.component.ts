import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { finalize } from 'rxjs/operators';

import { MenuService } from './menu.service';
import { IExtra } from './../_models/extra';
import { AlertifyService } from './../core/alertify.service';
import { Pagination, PaginatedResult } from './../_models/pagination';

@Component({
  templateUrl: './extra-list.component.html',
  styleUrls: ['./extra-list.component.scss']
})
export class ExtraListComponent implements OnInit {
  extras: IExtra[];
  extraParams: any = {};
  pagination: Pagination;
  entryList = [{value: 10, display: '10'}, {value: 15, display: '15'}, {value: 25, display: '25'}, {value: 50, display: '50'}];
  pagesDisplay: string;
  currencyUsed = 'GBP';
  spinnerprocessing = false;

  constructor(private extraService: MenuService,
    private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
    this.extras = data['extra'].result;
    this.pagination = data['extra'].pagination;
    })

    this.extraParams.orderBy = 'ExtraName';

    this.displayPageAction();
  }

  loadExtras() {
    this.spinnerState(true);
    this.extraService.getExtras(this.pagination.currentPage, this.pagination.itemsPerPage, this.extraParams)
      .pipe(finalize(() => this.spinnerState(false)))
      .subscribe((res: PaginatedResult<IExtra[]>) => {
        this.extras = res.result;
        this.pagination = res.pagination;
        this.displayPageAction();
      }, error => {
        this.alertify.error(error, 5);
      });
  }

  private spinnerState(state: boolean) {
    this.spinnerprocessing = state;
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadExtras();
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
