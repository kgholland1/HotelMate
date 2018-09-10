import { ActivatedRoute } from '@angular/router';
import { IOpenHour } from './../../_models/OpenHour';
import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../../_models/pagination';
import { SystemService } from '../../_Services/system.service';
import { AlertifyService } from '../../_Services/alertify.service';

@Component({
  selector: 'app-open-hour-list',
  templateUrl: './open-hour-list.component.html',
  styleUrls: ['./open-hour-list.component.scss']
})
export class OpenHourListComponent implements OnInit {
  openHours: IOpenHour[];
  pagination: Pagination;
  pagesDisplay: string;

  entryList = [{value: 10, display: '10'}, {value: 15, display: '15'}, {value: 25, display: '25'}, {value: 50, display: '50'}];

  constructor(private openHourService: SystemService,
    private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.openHours = data['openHour'].result;
      this.pagination = data['openHour'].pagination;
      })

      this.displayPageAction();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadopenHours();
  }
  loadopenHours() {
    this.openHourService.getOpenHours(this.pagination.currentPage, this.pagination.itemsPerPage)
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
}
