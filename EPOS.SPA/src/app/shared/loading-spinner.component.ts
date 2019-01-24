import {Component, Input} from '@angular/core'

@Component({
  selector: 'app-loading-spinner',
  template: '<span *ngIf="loading" class="fa fa-spinner spinner"></span>',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  @Input() loading: boolean
}
