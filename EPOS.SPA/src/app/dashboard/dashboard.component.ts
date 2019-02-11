import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import {  finalize } from 'rxjs/operators';

import { AlertifyService } from './../core/alertify.service';
import { DashboardService } from './../core/service/dashboard.service';
import { IDashboardSummary, IDashboardGraph } from './../_models/summary';
import { IRoomOrder } from './../_models/roomOrder';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  roomOrders: IRoomOrder[];
  counterSummary: IDashboardSummary = {
    orders: 0,
    reservations: 0,
    bookings: 0,
    keepings: 0
  };

  orderGraph: IDashboardGraph = {
    selectedPeriod: '',
    dataLabels: [],
    dataCounters: []
  };

  public mainChartData: Array<any> = [{
    type: 'line',
    data: this.orderGraph.dataCounters,
    label: 'Guest'
  }, {
    data: this.orderGraph.dataCounters,
    label: 'Guest'
  }];
  public mainChartLabels: Array<any> = this.orderGraph.dataLabels;
  public mainChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        categoryPercentage: .5,
        barPercentage: 1,
        position: 'top',
        gridLines: {
          color: '#C7CBD5',
          zeroLineColor: '#C7CBD5',
          drawTicks: true,
          borderDash: [8, 5],
          offsetGridLines: false,
          tickMarkLength: 10,
          callback: function(value) {
            console.log(value)
            // return value.charAt(0) + value.charAt(1) + value.charAt(2);
          }
        },
        ticks: {
          callback: function(value) {
            return value.charAt(0) + value.charAt(1) + value.charAt(2);
          }
        }
      }],
      yAxes: [{
        display: false,
        gridLines: {
          drawBorder: false,
          drawOnChartArea: false,
          borderDash: [8, 5],
          offsetGridLines: false
        },
        ticks: {
          beginAtZero: true,
          max: 20,
          maxTicksLimit: 5,
        }
      }]
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [{
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    hoverBackgroundColor: 'transparent',
    hoverBorderColor: 'transparent',
  },
  {
    backgroundColor: '#C7CBD5',
    borderColor: '#C7CBD5',
    hoverBackgroundColor: '#36A9E1',
    hoverBorderColor: '#36A9E1'
  }];
  public mainChartLegend = false;
  public mainChartType = 'bar';
  spinnerprocessing = false;

  constructor(private dashboardService: DashboardService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    const sources = [
      this.dashboardService.getDashboardSummary(),
      this.dashboardService.getOrderGraph(),
      this.dashboardService.getRoomOrderLatest()
    ];
    this.spinnerState(true);
    forkJoin(sources)
    .pipe(finalize(() => this.spinnerState(false)))
    .subscribe(data => {
      this.counterSummary = data[0];
      this.orderGraph = data[1];
      this.roomOrders = data[2];

      this.mainChartLabels = this.orderGraph.dataLabels;
      this.mainChartData[0].data = this.orderGraph.dataCounters;
      this.mainChartData[1].data = this.orderGraph.dataCounters;
    },
    (error: any) => this.alertify.error(error, 5));
  }
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
  private spinnerState(state: boolean) {
    this.spinnerprocessing = state;
  }

  public orderStatus(currentStatus: string) {
    let status: string;

    switch (currentStatus) {
      case 'Pending': {
         status = 'badge-warning';
         break;
      }
      case 'Processing': {
        status = 'btn-primary';
        break;
     }
     case 'Complete': {
      status = 'badge-success';
      break;
     }
      default: {
        status = 'badge-danger';
         break;
      }
    }
    return status;
  }
}
