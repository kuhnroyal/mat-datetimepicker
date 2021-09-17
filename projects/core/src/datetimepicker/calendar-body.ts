import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatDatetimepickerCalendarCell } from './calendar-cell';

/**
 * An internal component used to display calendar data in a table.
 * @docs-private
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[mat-datetimepicker-calendar-body]',
  templateUrl: 'calendar-body.html',
  styleUrls: ['calendar-body.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatDatetimepickerCalendarBodyComponent {
  @HostBinding('class')
  classes = 'mat-datetimepicker-calendar-body';

  /** The label for the table. (e.g. "Jan 2017"). */
  @Input() label: string;

  /** The cells to display in the table. */
  @Input() rows: MatDatetimepickerCalendarCell[][];

  /** The value in the table that corresponds to today. */
  @Input() todayValue: number | null;

  /** The value in the table that is currently selected. */
  @Input() selectedValue: number | null;

  /** The minimum number of free cells needed to fit the label in the first row. */
  @Input() labelMinRequiredCells: number;

  /** The number of columns in the table. */
  @Input() numCols = 7;

  /** Whether to allow selection of disabled cells. */
  @Input() allowDisabledSelection = false;

  /** The cell number of the active cell in the table. */
  @Input() activeCell = 0;

  /** Emits when a new value is selected. */
  @Output() selectedValueChange = new EventEmitter<number>();

  /** The number of blank cells to put at the beginning for the first row. */
  get _firstRowOffset(): number {
    return this.rows && this.rows.length && this.rows[0].length
      ? this.numCols - this.rows[0].length
      : 0;
  }

  _cellClicked(cell: MatDatetimepickerCalendarCell): void {
    if (!this.allowDisabledSelection && !cell.enabled) {
      return;
    }
    this.selectedValueChange.emit(cell.value);
  }

  _isActiveCell(rowIndex: number, colIndex: number): boolean {
    let cellNumber = rowIndex * this.numCols + colIndex;

    // Account for the fact that the first row may not have as many cells.
    if (rowIndex) {
      cellNumber -= this._firstRowOffset;
    }

    return cellNumber === this.activeCell;
  }
}
