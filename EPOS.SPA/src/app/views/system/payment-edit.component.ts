import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { IPayment } from '../../_models/payment';
import { GenericValidator } from '../../_shared/generic-validator';
import { SystemService } from '../../_Services/system.service';
import { AlertifyService } from '../../_Services/alertify.service';
import { NumberValidators } from '../../_Shared/number.validator';

@Component({
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.scss']
})
export class PaymentEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Payment Edit';
  errorMessage: string;
  mainForm: FormGroup;

  payment: IPayment = {
    id: 0,
    paymentName: '',
    charge: 0
  };

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private sub: Subscription;
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private systemService: SystemService,
    private alertify: AlertifyService) {

      this.validationMessages = {
        paymentName: {
            required: 'Please enter payment method.'
         },
         charge: {
            required: 'Please enter a unit price.',
            range: 'Unit Price must be 0.00 or greater.'
        }
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
     }

  ngOnInit() {
    this.mainForm = this.fb.group({
      paymentName:  ['', Validators.required],
      charge: ['', [Validators.required, NumberValidators.range(0, 50)]]
      });

  // Read the product Id from the route parameter
    this.sub = this.route.params.subscribe(
      params => {
          const id = +params['id'];
          this.getPayment(id);
      }
    );
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
      // Watch for the blur event from any input element on the form.
      const controlBlurs: Observable<any>[] = this.formInputElements
          .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

      // Merge the blur event observable with the valueChanges observable
      Observable.merge(this.mainForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
          this.displayMessage = this.genericValidator.processMessages(this.mainForm);
      });
  }

  getPayment(id: number): void {
      if (id > 0) {
          this.systemService.getPayment(id)
          .subscribe(
              (payment: IPayment) => this.onPaymentRetrieved(payment),
              (error: any) => this.alertify.error(error, 5)
          );
      } else {
          this.pageTitle = 'Add Payment Method';
      }
  }
  onPaymentRetrieved(payment: IPayment): void {
    if (this.mainForm) {
        this.mainForm.reset();
    }
    this.initDataModel(payment);

    this.pageTitle = `Edit Payment: ${this.payment.paymentName}`;

    // Update the data on the form
    this.mainForm.patchValue({
    paymentName: this.payment.paymentName,
    charge: this.payment.charge
    });
  }

  private initDataModel(paymentFromDB: IPayment) {
    this.payment = paymentFromDB;
  }
  private saveAndContinue() {
    if (this.mainForm) {
        this.mainForm.reset();
    }

    this.mainForm.patchValue({
      paymentName: this.payment.paymentName,
      charge: this.payment.charge
    });
  }

  savePayment(action?: string): void {
    if (this.mainForm.dirty && this.mainForm.valid) {
        // Copy the form values over the product object values
      const e = Object.assign({}, this.payment, this.mainForm.value);

      if (this.payment.id === 0) {
          this.systemService.createPayment(e)
          .subscribe(
              (data) => {
              this.initDataModel(data);
                this.alertify.success('Saved successfully', 5);
                if (action !== 'stay') {
                    this.router.navigate(['/be/payments']);
                }
                this.saveAndContinue();
              },
            (error: any) => this.alertify.error(error, 5)
          )
      } else {
          this.initDataModel(e);

          this.systemService.updatePayment(e)
          .subscribe(
              () => {
                this.alertify.success('Saved successfully', 5);
                if (action !== 'stay') {
                    this.router.navigate(['/be/payments']);
                }
                this.saveAndContinue();
              },
            (error: any) => this.alertify.error(error, 5)
          );
      }
     } else {
      if (action !== 'stay') {
          this.router.navigate(['/be/payments']);
      }
     }
  }
  deletePayment() {
    this.alertify.confirm(this.payment.paymentName, 'Are you sure you want to delete this payment method?', () => {
      this.systemService.deletePayment(this.payment.id).subscribe(() => {
        this.alertify.success('Payment method has been deleted.', 5);
        this.router.navigate(['/be/payments']);
      }, error => {
        this.alertify.error('Failed to delete payment method', 5)
      });
    });
  }
}
