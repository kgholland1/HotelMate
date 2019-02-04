import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AlertifyService } from './../../core/alertify.service';
import { SystemService } from './../system.service';
import { Pagination, PaginatedResult } from './../../_models/pagination';

import { IRestaurant } from './../../_models/restaurant';

@Component({
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  restaurants: IRestaurant[];
  pagination: Pagination;
  pagesDisplay: string;
  spinnerprocessing = false;

  entryList = [{value: 10, display: '10'}, {value: 15, display: '15'}, {value: 25, display: '25'}, {value: 50, display: '50'}];

  constructor(private restaurantService: SystemService,
    private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.restaurants = data['restaurant'].result;
      this.pagination = data['restaurant'].pagination;
      })

      this.displayPageAction();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadrestaurants();
  }
  loadrestaurants() {
    this.spinnerState(true);
    this.restaurantService.getRestaurants(this.pagination.currentPage, this.pagination.itemsPerPage)
    .pipe(finalize(() => this.spinnerState(false)))
    .subscribe((res: PaginatedResult<IRestaurant[]>) => {
      this.restaurants = res.result;
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
