import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ITourist } from '../../_models/tourist';
import { Pagination, PaginatedResult } from '../../_models/pagination';
import { HotelService } from '../../_Services/hotel.service';
import { AlertifyService } from '../../_Services/alertify.service';


@Component({
  templateUrl: './tourist-list.component.html',
  styleUrls: ['./tourist-list.component.scss']
})
export class TouristListComponent implements OnInit {
  tourists: ITourist[];
  tourParams: any = {};
  pagination: Pagination;
  pagesDisplay: string;
  entryList = [{value: 10, display: '10'}, {value: 15, display: '15'}, {value: 25, display: '25'}, {value: 50, display: '50'}];

  constructor(private roomService: HotelService,
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
    this.roomService.getTourists(this.pagination.currentPage, this.pagination.itemsPerPage)
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
}
