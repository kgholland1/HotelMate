import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { BsModalService } from 'ngx-bootstrap';
import { DialogComponent } from '../views/dialog/dialog.component';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export interface FormComponent {
    mainForm: FormGroup;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<FormComponent> {

    constructor(private modalService: BsModalService) {}

    canDeactivate(component: FormComponent) {

    if (component.mainForm.dirty) {
        const subject = new Subject<boolean>();

        const modal = this.modalService.show(DialogComponent, {'class': 'modal-dialog-primary'});
        modal.content.subject = subject;

        return subject.asObservable();
    }

    return true;

    }

}
