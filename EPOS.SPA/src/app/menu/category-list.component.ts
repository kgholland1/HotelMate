import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { finalize } from 'rxjs/operators';

import { MenuService } from './menu.service';
import { AlertifyService } from './../core/alertify.service';
import { Pagination, PaginatedResult } from './../_models/pagination';
import { ICategory } from './../_models/Category';

@Component({
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: ICategory[];
  categoryParams: any = {};
  pagination: Pagination;
  entryList = [{value: 10, display: '10'}, {value: 15, display: '15'}, {value: 25, display: '25'}, {value: 50, display: '50'}];
  pagesDisplay: string;
  spinnerprocessing = false;

  constructor(private categoryService: MenuService,
    private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.categories = data['category'].result;
      this.pagination = data['category'].pagination;

      this.categoryParams.orderBy = 'HeaderName';

      this.displayPageAction();
    })
  }

  loadCategories() {
    this.spinnerState(true);
    this.categoryService.getCategories(this.pagination.currentPage, this.pagination.itemsPerPage, this.categoryParams)
      .pipe(finalize(() => this.spinnerState(false)))
      .subscribe((res: PaginatedResult<ICategory[]>) => {
        this.categories = res.result;
        this.pagination = res.pagination;
        this.displayPageAction();
      }, error => {
        this.alertify.error(error, 5);
      });
  }
  loadSorting() {
    this.pagination.currentPage = 1;
    this.loadCategories();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadCategories();
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

