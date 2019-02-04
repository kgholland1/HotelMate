import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';

import { GenericValidator } from './../../shared/generic-validator';
import { MessageModalComponent } from './../../shared/message-modal.component';
import { AlertifyService } from './../../core/alertify.service';
import { SystemService } from './../system.service';
import { NumberValidators } from './../../shared/number.validator';

import { IPayment } from './../../_models/payment';

@Component({
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.scss']
})
export class PaymentEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle  = 'Payment Edit';
  errorMessage: string;
  mainForm: FormGroup;
  bsModalRef: BsModalRef;
  spinnerprocessing = false;

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
    private modalService: BsModalService,
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
    this.sub = this.route.paramMap.subscribe(
      params => {
          const id =  +params.get('id') || 0;
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
          .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    merge(this.mainForm.valueChanges, ...controlBlurs).pipe(
        debounceTime(800)
        ).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.mainForm);
    });
  }

  getPayment(id: number): void {
      if (id > 0) {
        this.spinnerState(true);
        this.systemService.getPayment(id)
        .pipe(finalize(() => this.spinnerState(false)))
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
        this.spinnerState(true);
          this.systemService.createPayment(e)
          .pipe(finalize(() => this.spinnerState(false)))
          .subscribe(
              (data) => {
              this.initDataModel(data);
                this.alertify.success('Saved successfully', 5);
                if (action !== 'stay') {
                    this.router.navigate(['/config/system/payments']);
                }
                this.saveAndContinue();
              },
            (error: any) => this.alertify.error(error, 5)
          )
      } else {
          this.initDataModel(e);
          this.spinnerState(true);
          this.systemService.updatePayment(e)
          .pipe(finalize(() => this.spinnerState(false)))
          .subscribe(
              () => {
                this.alertify.success('Saved successfully', 5);
                if (action !== 'stay') {
                    this.router.navigate(['/config/system/payments']);
                }
                this.saveAndContinue();
              },
            (error: any) => this.alertify.error(error, 5)
          );
      }
     } else {
      if (action !== 'stay') {
          this.router.navigate(['/config/system/payments']);
      }
     }
  }
  deletePayment() {
    const initialState = {
      title : this.payment.paymentName,
      message: 'Are you sure you want to delete this payment method'
    };

    this.bsModalRef = this.modalService.show(MessageModalComponent, {initialState});
    this.bsModalRef.content.msgResponse.subscribe((value) => {
      if (value) {
        this.systemService.deletePayment(this.payment.id).subscribe(() => {
              this.alertify.success('Payment method has been deleted.', 5);
              if (this.mainForm) {
                  this.mainForm.reset();
              }
              this.router.navigate(['/config/system/payments']);
          }, error => {
              this.alertify.error('Failed to delete payment method.', 5)
          });
      }
    });
  }

  private spinnerState(state: boolean) {
    this.spinnerprocessing = state;
  }
}

