import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AlertifyService } from './../../core/alertify.service';
import { HotelService } from './../hotel.service';
import { Pagination, PaginatedResult } from './../../_models/pagination';
import { IRoom } from './../../_models/room';

@Component({
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {
  rooms: IRoom[];
  roomParams: any = {};
  pagination: Pagination;
  pagesDisplay: string;
  entryList = [{value: 10, display: '10'}, {value: 15, display: '15'}, {value: 25, display: '25'}, {value: 50, display: '50'}];
  spinnerprocessing = false;

  constructor(private roomService: HotelService,
    private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
    this.rooms = data['room'].result;
    this.pagination = data['room'].pagination;
    })

    this.displayPageAction();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadRooms();
  }

  loadRooms() {
    this.spinnerState(true);
    this.roomService.getRooms(this.pagination.currentPage, this.pagination.itemsPerPage)
    .pipe(finalize(() => this.spinnerState(false)))
    .subscribe((res: PaginatedResult<IRoom[]>) => {
      this.rooms = res.result;
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
