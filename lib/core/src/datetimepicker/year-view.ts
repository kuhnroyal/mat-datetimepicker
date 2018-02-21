/* tslint:disable */
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
  ViewEncapsulation
} from "@angular/core";
import { createMissingDateImplError } from "./datetimepicker-errors";
import { MatDatetimepickerCalendarCell } from "./calendar-body";
import { slideCalendar } from "./datetimepicker-animations";
import {
  MAT_DATETIME_FORMATS,
  MatDatetimeFormats
} from "../adapter/datetime-formats";
import {
  DatetimeAdapter
} from "../adapter/datetime-adapter";

/**
 * An internal component used to display a single year in the datepicker.
 * @docs-private
 */
@Component({
  selector: "mat-datetimepicker-year-view",
  templateUrl: "year-view.html",
  animations: [slideCalendar],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatDatetimepickerYearView<D> implements AfterContentInit {

  @Output() _userSelection = new EventEmitter<void>();

  @Input() type: "date" | "time" | "month" | "datetime" = "date";

  /** The date to display in this year view (everything other than the year is ignored). */
  @Input()
  get activeDate(): D {
    return this._activeDate;
  }

  set activeDate(value: D) {
    let oldActiveDate = this._activeDate;
    this._activeDate = value || this._adapter.today();
    if (oldActiveDate && this._activeDate &&
      !this._adapter.sameYear(oldActiveDate, this._activeDate)) {
      this._init();
      // if (oldActiveDate < this._activeDate) {
      //  this.calendarState('right');
      // } else {
      //  this.calendarState('left');
      // }
    }
  }

  private _activeDate: D;

  /** The currently selected date. */
  @Input()
  get selected(): D {
    return this._selected;
  }

  set selected(value: D) {
    this._selected = value;
    this._selectedMonth = this._getMonthInCurrentYear(this.selected);
  }

  private _selected: D;

  /** A function used to filter which dates are selectable. */
  @Input() dateFilter: (date: D) => boolean;

  /** Emits when a new month is selected. */
  @Output() selectedChange = new EventEmitter<D>();

  /** Grid of calendar cells representing the months of the year. */
  _months: MatDatetimepickerCalendarCell[][];

  /** The label for this year (e.g. "2017"). */
  _yearLabel: string;

  /** The month in this year that today falls on. Null if today is in a different year. */
  _todayMonth: number;

  /**
   * The month in this year that the selected Date falls on.
   * Null if the selected Date is in a different year.
   */
  _selectedMonth: number;

  _calendarState: string;

  constructor(@Optional() public _adapter: DatetimeAdapter<D>,
              @Optional() @Inject(MAT_DATETIME_FORMATS) private _dateFormats: MatDatetimeFormats) {
    if (!this._adapter) {
      throw createMissingDateImplError("DatetimeAdapter");
    }

    if (!this._dateFormats) {
      throw createMissingDateImplError("MAT_DATETIME_FORMATS");
    }

    this._activeDate = this._adapter.today();
  }

  ngAfterContentInit() {
    this._init();
  }

  /** Handles when a new month is selected. */
  _monthSelected(month: number) {
    const userSelected = this._adapter.createDatetime(
      this._adapter.getYear(this.activeDate), month,
      this._adapter.getDate(this.activeDate),
      this._adapter.getHour(this.activeDate),
      this._adapter.getMinute(this.activeDate));
    
    this.selectedChange.emit(userSelected);
    this.selected = userSelected;
    this._selectedMonth = month;
  }

  /** Initializes this month view. */
  private _init() {
    this._selectedMonth = this._getMonthInCurrentYear(this.selected);
    this._todayMonth = this._getMonthInCurrentYear(this._adapter.today());
    this._yearLabel = this._adapter.getYearName(this.activeDate);

    let monthNames = this._adapter.getMonthNames("short");
    // First row of months only contains 5 elements so we can fit the year label on the same row.
    this._months = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10, 11]].map(row => row.map(
      month => this._createCellForMonth(month, monthNames[month])));
  }

  /**
   * Gets the month in this year that the given Date falls on.
   * Returns null if the given Date is in another year.
   */
  private _getMonthInCurrentYear(date: D) {
    return this._adapter.sameYear(date, this.activeDate) ?
      this._adapter.getMonth(date) : null;
  }

  /** Creates an MdCalendarCell for the given month. */
  private _createCellForMonth(month: number, monthName: string) {
    let ariaLabel = this._adapter.format(
      this._adapter.createDatetime(this._adapter.getYear(this.activeDate), month, 1,
        this._adapter.getHour(this.activeDate),
        this._adapter.getMinute(this.activeDate)),
      this._dateFormats.display.monthYearA11yLabel);
    return new MatDatetimepickerCalendarCell(
      month, monthName.toLocaleUpperCase(), ariaLabel, this._isMonthEnabled(month));
  }

  /** Whether the given month is enabled. */
  private _isMonthEnabled(month: number) {
    if (!this.dateFilter) {
      return true;
    }

    let firstOfMonth = this._adapter.createDatetime(
      this._adapter.getYear(this.activeDate), month, 1,
      this._adapter.getHour(this.activeDate),
      this._adapter.getMinute(this.activeDate));

    // If any date in the month is enabled count the month as enabled.
    for (let date = firstOfMonth; this._adapter.getMonth(date) == month;
         date = this._adapter.addCalendarDays(date, 1)) {
      if (this.dateFilter(date)) {
        return true;
      }
    }

    return false;
  }

  // private calendarState(direction: string): void {
  //   this._calendarState = direction;
  // }

  _calendarStateDone() {
    this._calendarState = "";
  }
}
