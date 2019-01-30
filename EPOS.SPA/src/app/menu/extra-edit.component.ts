import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router  } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';

import { MessageModalComponent } from './../shared/message-modal.component';
import { GenericValidator } from './../shared/generic-validator';
import { MenuService } from './menu.service';
import { AlertifyService } from './../core/alertify.service';
import { NumberValidators } from './../shared/number.validator';
import { IExtra } from './../_models/extra';

@Component({
  templateUrl: './extra-edit.component.html',
  styleUrls: ['./extra-edit.component.scss']
})
export class ExtraEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  bsModalRef: BsModalRef;

  pageTitle  = 'Option and Extra Edit';
  errorMessage: string;
  spinnerprocessing = false;
  mainForm: FormGroup;
  extraTypeList = [{value: 'Option', display: 'Option'}, {value: 'Extra', display: 'Extra'}, {value: 'Size', display: 'Size'}];
  currencyUsed = 'GBP';

  extra: IExtra = {
    id: 0,
    extraName: '',
    unitPrice: 0,
    extraType: 'Option'
  };
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private extraService: MenuService,
    private alertify: AlertifyService) {

      this.validationMessages = {
        extraName: {
            required: 'Please enter extra name.'
         },
         unitPrice: {
            required: 'Please enter a unit price.',
            range: 'Unit Price must be between 0.00 (lowest) and 50.00 (highest).'
        },
        extraType: {
            required: 'Please select a type.'
         },
      };

      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
    }

    ngOnInit() {
        this.mainForm = this.fb.group({
        extraName:  ['', Validators.required],
        unitPrice: ['', [Validators.required, NumberValidators.range(0, 50)]],
        extraType: ['', Validators.required]
        });

    // Read the product Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
          const id = +params.get('id');
          this.getExtra(id);
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

    getExtra(id: number): void {
        if (id > 0) {
          this.spinnerState(true);
            this.extraService.getExtra(id)
            .pipe(finalize(() => this.spinnerState(false)))
            .subscribe(
                (extra: IExtra) => {
                    this.onProductRetrieved(extra);
                },
                (error: any) => {
                    this.alertify.error(error, 5)
                    this.router.navigate(['/config/menu/extras']);
                }
            );
        } else {
            this.pageTitle = 'Add Option or Extra';
        }
    }

    private spinnerState(state: boolean) {
      this.spinnerprocessing = state;
    }

    onProductRetrieved(extra: IExtra): void {
        if (this.mainForm) {
            this.mainForm.reset();
        }
        this.initDataModel(extra);

        this.pageTitle = `Edit Option/Extra: ${this.extra.extraName}`;

        // Update the data on the form
        this.mainForm.patchValue({
        extraName: this.extra.extraName,
        extraType: this.extra.extraType,
        unitPrice: this.extra.unitPrice
        });
    }

    private initDataModel(extraFromDB: IExtra) {
        this.extra = extraFromDB;
    }

    private saveAndContinue() {
        if (this.mainForm) {
            this.mainForm.reset();
        }

        this.mainForm.patchValue({
        extraName: this.extra.extraName,
        extraType: this.extra.extraType,
        unitPrice: this.extra.unitPrice
        });
    }

saveExtra(action?: string): void {
  if (this.mainForm.dirty && this.mainForm.valid) {
      // Copy the form values over the product object values
    // const e = Object.assign({}, this.extra, this.mainForm.value);
    const e = { ...this.extra, ...this.mainForm.value };
    console.log(JSON.stringify(e));

    if (this.extra.id === 0) {
        this.spinnerState(true);
        this.extraService.createExtra(e)
        .pipe(finalize(() => this.spinnerState(false)))
        .subscribe(
            (data) => {
            this.initDataModel(data);
              this.alertify.success('Saved successfully', 5);
              if (action !== 'stay') {
                  this.router.navigate(['/config/menu/extras']);
              }
              this.saveAndContinue();
            },
          (error: any) => this.alertify.error(error, 5)
        )
    } else {
        this.initDataModel(e);
        this.spinnerState(true);
        this.extraService.updateExtra(e)
        .pipe(finalize(() => this.spinnerState(false)))
        .subscribe(
            () => {
              this.alertify.success('Saved successfully', 5);
              if (action !== 'stay') {
                  this.router.navigate(['/config/menu/extras']);
              }
              this.saveAndContinue();
            },
          (error: any) => this.alertify.error(error, 5)
        );
    }
   } else {
    if (action !== 'stay') {
        this.router.navigate(['/config/menu/extras']);
    }
   }
}
deleteExtra() {
/*     this.alertify.confirm(this.extra.extraName, 'Are you sure you want to delete this option?', () => {
      this.extraService.deleteExtra(this.extra.id).subscribe(() => {
        this.alertify.success('Option has been deleted.', 5);
        if (this.mainForm) {
            this.mainForm.reset();
        }
        this.router.navigate(['/menu/extras']);
      }, error => {
        this.alertify.error('Failed to delete option', 5)
      });
    }); */

    const initialState = {
        title : this.extra.extraName,
        message: 'Are you sure you want to delete this option'
      };
      this.bsModalRef = this.modalService.show(MessageModalComponent, {initialState});
      this.bsModalRef.content.msgResponse.subscribe((value) => {
        if (value) {
            this.extraService.deleteExtra(this.extra.id).subscribe(() => {
                this.alertify.success('Option has been deleted.', 5);
                if (this.mainForm) {
                    this.mainForm.reset();
                }
                this.router.navigate(['config/menu/extras']);
            }, error => {
                this.alertify.error('Failed to delete option', 5)
            });
        }
    });
  }
}
