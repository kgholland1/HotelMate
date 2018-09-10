import { Component, OnInit } from '@angular/core';
import { ICategory } from '../../_models/Category';
import { Pagination, PaginatedResult } from '../../_models/pagination';
import { MenuService } from '../../_Services/menu.service';
import { AlertifyService } from '../../_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';

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
    this.categoryService.getCategories(this.pagination.currentPage, this.pagination.itemsPerPage, this.categoryParams)
      .subscribe((res: PaginatedResult<ICategory[]>) => {
        this.categories = res.result;
        this.pagination = res.pagination;
        this.displayPageAction();
      }, error => {
        this.alertify.error(error, 5);
      });
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
}

