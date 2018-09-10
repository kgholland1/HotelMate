import { PaginatedResult } from '../../_models/pagination';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IPayment } from '../../_models/payment';
import { Pagination } from '../../_models/pagination';
import { SystemService } from '../../_Services/system.service';
import { AlertifyService } from '../../_Services/alertify.service';

@Component({
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  payments: IPayment[];
  tourParams: any = {};
  pagination: Pagination;
  pagesDisplay: string;
  currencyUsed = 'GBP';
  entryList = [{value: 10, display: '10'}, {value: 15, display: '15'}, {value: 25, display: '25'}, {value: 50, display: '50'}];

  constructor(private paymentService: SystemService,
    private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
    this.payments = data['payment'].result;
    this.pagination = data['payment'].pagination;
    })

    this.displayPageAction();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadpayments();
  }

  loadpayments() {
    this.paymentService.getPayments(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe((res: PaginatedResult<IPayment[]>) => {
        this.payments = res.result;
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
