import { Component, Input } from '@angular/core';

import {
  MatDatetimepickerComponent,
  MatDatetimepickerContentComponent,
} from './datetimepicker';

@Component({
  selector: 'mat-datetimepicker-actions',
  templateUrl: 'datetimepicker-actions.component.html',
  styleUrls: ['datetimepicker-actions.component.scss'],
})
export class MatDatetimepickerActionsComponent<D> {
  @Input() protected confirmButtonLabel = 'Confirm';
  @Input() protected cancelButtonLabel = 'Cancel';

  private datetimepicker: MatDatetimepickerContentComponent<D>;

  public fromTemplateWithDatetimepicker(
    matDatetimepickerActions: MatDatetimepickerActionsComponent<D>,
    datetimepickerContent: MatDatetimepickerContentComponent<D>
  ) {
    this.confirmButtonLabel = matDatetimepickerActions.confirmButtonLabel;
    this.cancelButtonLabel = matDatetimepickerActions.cancelButtonLabel;
    this.datetimepicker = datetimepickerContent;
    datetimepickerContent._calendar._activeDate;
  }

  protected handleCancelButton(event): void {
    event.preventDefault();
    this.closeDatetimepicker();
  }

  protected handleConfirmButton(event): void {
    event.preventDefault();
    this.datetimepicker.datetimepicker._select(
      this.datetimepicker._calendar._activeDate
    );
    this.closeDatetimepicker();
  }

  private closeDatetimepicker() {
    this.datetimepicker.datetimepicker.close();
  }
}
