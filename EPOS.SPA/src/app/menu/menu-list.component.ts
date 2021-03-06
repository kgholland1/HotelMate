import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { finalize } from 'rxjs/operators';

import { AlertifyService } from './../core/alertify.service';
import { MenuService } from './menu.service';
import { IKeyValuePair } from './../_models/KeyValuePair';
import { Pagination, PaginatedResult } from './../_models/pagination';
import { IListMenu } from './../_models/menu';


@Component({
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  menus: IListMenu[];
  menuParams: any = {};
  pagination: Pagination;
  entryList = [{value: 10, display: '10'}, {value: 15, display: '15'}, {value: 25, display: '25'}, {value: 50, display: '50'}];
  pagesDisplay: string;
  categories: IKeyValuePair[] = [];
  searchBy: string;
  spinnerprocessing = false;

  currencyUsed = 'GBP';

  constructor(private menuService: MenuService,
    private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.menuService.getCatKeyValuePair()
    .subscribe(
        (category: IKeyValuePair[]) => this.categories = category,
        (error: any) => this.alertify.error(error, 5)
    );

    this.route.data.subscribe(data => {
    this.menus = data['menu'].result;
    this.pagination = data['menu'].pagination;

    this.menuParams.categoryId = 0;
    this.menuParams.orderBy = 'Category';

    this.displayPageAction();
    })
  }

    loadMenus() {
      this.spinnerState(true);
      this.menuService.getMenus(this.pagination.currentPage, this.pagination.itemsPerPage, this.menuParams)
      .pipe(finalize(() => this.spinnerState(false)))
      .subscribe((res: PaginatedResult<IListMenu[]>) => {
        this.menus = res.result;
        this.pagination = res.pagination;
        this.displayPageAction();
        }, error => {
          this.alertify.error(error, 5);
        });
    }
    loadSorting() {
      this.pagination.currentPage = 1;
      this.loadMenus();
    }
    SearchMenu() {
    //  this.menuParams.categoryId = this.searchBy;
      this.pagination.currentPage = 1;
      this.loadMenus();
    }

    pageChanged(event: any): void {
      this.pagination.currentPage = event.page;
      this.loadMenus();
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
