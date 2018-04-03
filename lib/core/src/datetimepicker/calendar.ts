/* tslint:disable */
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  ViewEncapsulation
} from "@angular/core";
import {
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW
} from "@angular/cdk/keycodes";
import {
  MatDatepickerIntl
} from "@angular/material";
import {
  MAT_DATETIME_FORMATS,
  MatDatetimeFormats
} from "../adapter/datetime-formats";
import {
  DatetimeAdapter
} from "../adapter/datetime-adapter";
import { first } from "rxjs/operators/first";
import { createMissingDateImplError } from "./datetimepicker-errors";
import { Subscription } from "rxjs/Subscription";
import { slideCalendar } from "./datetimepicker-animations";
import { MatDatetimepickerFilterType } from "./datetimepicker-filtertype";

/**
 * A calendar that is used as part of the datepicker.
 * @docs-private
 */
@Component({
  selector: "mat-datetimepicker-calendar",
  templateUrl: "calendar.html",
  styleUrls: ["calendar.scss"],
  host: {
    "[class.mat-datetimepicker-calendar]": "true",
    "tabindex": "0",
    "(keydown)": "_handleCalendarBodyKeydown($event)"
  },
  animations: [slideCalendar],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatDatetimepickerCalendar<D> implements AfterContentInit, OnDestroy {

  private _intlChanges: Subscription;

  @Output() _userSelection = new EventEmitter<void>();

  @Input() type: "date" | "time" | "month" | "datetime" = "date";

  /** A date representing the period (month or year) to start the calendar in. */
  @Input()
  get startAt(): D | null {
    return this._startAt;
  }

  set startAt(value: D | null) {
    this._startAt = this._adapter.getValidDateOrNull(value);
  }

  private _startAt: D | null;

  /** Whether the calendar should be started in month or year view. */
  @Input() startView: "clock" | "month" | "year" = "month";

  /** The currently selected date. */
  @Input()
  get selected(): D | null {
    return this._selected;
  }

  set selected(value: D | null) {
    this._selected = this._adapter.getValidDateOrNull(value);
  }

  private _selected: D | null;

  /** The minimum selectable date. */
  @Input()
  get minDate(): D | null {
    return this._minDate;
  }

  set minDate(value: D | null) {
    this._minDate = this._adapter.getValidDateOrNull(value);
  }

  private _minDate: D | null;

  /** The maximum selectable date. */
  @Input()
  get maxDate(): D | null {
    return this._maxDate;
  }

  set maxDate(value: D | null) {
    this._maxDate = this._adapter.getValidDateOrNull(value);
  }

  private _maxDate: D | null;

  @Input() timeInterval: number = 1;

  /** A function used to filter which dates are selectable. */
  @Input() dateFilter: (date: D, type: MatDatetimepickerFilterType) => boolean;

  /** Emits when the currently selected date changes. */
  @Output() selectedChange = new EventEmitter<D>();

  /** Date filter for the month and year views. */
  _dateFilterForViews = (date: D) => {
    return !!date &&
      (!this.dateFilter || this.dateFilter(date, MatDatetimepickerFilterType.DATE)) &&
      (!this.minDate || this._adapter.compareDate(date, this.minDate) >= 0) &&
      (!this.maxDate || this._adapter.compareDate(date, this.maxDate) <= 0);
  };

  /**
   * The current active date. This determines which time period is shown and which date is
   * highlighted when using keyboard navigation.
   */
  get _activeDate(): D {
    return this._clampedActiveDate;
  }

  set _activeDate(value: D) {
    let oldActiveDate = this._clampedActiveDate;
    this._clampedActiveDate = this._adapter.clampDate(value, this.minDate, this.maxDate);
    if (oldActiveDate && this._clampedActiveDate && this._currentView === "month" &&
      !this._adapter.sameMonthAndYear(oldActiveDate, this._clampedActiveDate)) {
      if (this._adapter.isInNextMonth(oldActiveDate, this._clampedActiveDate)) {
        this.calendarState("right");
      } else {
        this.calendarState("left");
      }
    }
  }

  private _clampedActiveDate: D;

  _userSelected(): void {
    this._userSelection.emit();
  }

  /** Whether the calendar is in month view. */
  _currentView: "clock" | "month" | "year" = "month";
  _clockView: "hour" | "minute" = "hour";

  /** The label for the current calendar view. */
  get _yearLabel(): string {
    return this._adapter.getYearName(this._activeDate);
  }

  get _monthYearLabel(): string {
    return this._currentView === "month" ? this._adapter.getMonthNames("long")[this._adapter.getMonth(this._activeDate)] :
      this._adapter.getYearName(this._activeDate);
  }

  get _dateLabel(): string {
    if (this.type === "month") {
      return this._adapter.getMonthNames("long")[this._adapter.getMonth(this._activeDate)];
    }
    const day = this._adapter.getDayOfWeekNames("short")[this._adapter.getDayOfWeek(this._activeDate)];
    const month = this._adapter.getMonthNames("short")[this._adapter.getMonth(this._activeDate)];
    const date = this._adapter.getDateNames()[this._adapter.getDate(this._activeDate) - 1];
    return `${day}, ${month} ${date}`;
  }

  get _hoursLabel(): string {
    return this._2digit(this._adapter.getHour(this._activeDate));
  }

  get _minutesLabel(): string {
    return this._2digit(this._adapter.getMinute(this._activeDate));
  }

  _calendarState: string;

  constructor(private _elementRef: ElementRef,
              private _intl: MatDatepickerIntl,
              private _ngZone: NgZone,
              @Optional() private _adapter: DatetimeAdapter<D>,
              @Optional() @Inject(MAT_DATETIME_FORMATS) private _dateFormats: MatDatetimeFormats,
              changeDetectorRef: ChangeDetectorRef) {
    if (!this._adapter) {
      throw createMissingDateImplError("DatetimeAdapter");
    }

    if (!this._dateFormats) {
      throw createMissingDateImplError("MAT_DATE_FORMATS");
    }

    this._intlChanges = _intl.changes.subscribe(() => changeDetectorRef.markForCheck());
  }

  ngAfterContentInit() {
    this._activeDate = this.startAt || this._adapter.today();
    this._focusActiveCell();
    if (this.type === "month") {
      this._currentView = "year";
    } else if (this.type === "time") {
      this._currentView = "clock";
    } else {
      this._currentView = this.startView || "month";
    }
  }

  ngOnDestroy() {
    this._intlChanges.unsubscribe();
  }

  /** Handles date selection in the month view. */
  _dateSelected(date: D): void {
    if (this.type == "date") {
      if (!this._adapter.sameDate(date, this.selected)) {
        this.selectedChange.emit(date);
      }
    } else {
      this._activeDate = date;
      this._currentView = "clock";
    }
  }

  /** Handles month selection in the year view. */
  _monthSelected(month: D): void {
    if (this.type == "month") {
      if (!this._adapter.sameMonthAndYear(month, this.selected)) {
        this.selectedChange.emit(this._adapter.getFirstDateOfMonth(month));
      }
    } else {
      this._activeDate = month;
      this._currentView = "month";
      this._clockView = "hour";
    }
  }

  _timeSelected(date: D): void {
    if (this._clockView !== "minute") {
      this._activeDate = date;
      this._clockView = "minute";
    } else {
      if (!this._adapter.sameDatetime(date, this.selected)) {
        this.selectedChange.emit(date);
      }
    }
  }

  _onActiveDateChange(date: D) {
    this._activeDate = date;
  }

  _yearClicked(): void {
    this._currentView = "year";
  }

  _dateClicked(): void {
    if (this.type !== 'month') {
      this._currentView = "month";
    }
  }

  _hoursClicked(): void {
    this._currentView = "clock";
    this._clockView = "hour";
  }

  _minutesClicked(): void {
    this._currentView = "clock";
    this._clockView = "minute";
  }

  /** Handles user clicks on the previous button. */
  _previousClicked(): void {
    this._activeDate = this._currentView === "month" ?
      this._adapter.addCalendarMonths(this._activeDate, -1) :
      this._adapter.addCalendarYears(this._activeDate, -1);
  }

  /** Handles user clicks on the next button. */
  _nextClicked(): void {
    this._activeDate = this._currentView === "month" ?
      this._adapter.addCalendarMonths(this._activeDate, 1) :
      this._adapter.addCalendarYears(this._activeDate, 1);
  }

  /** Whether the previous period button is enabled. */
  _previousEnabled(): boolean {
    if (!this.minDate) {
      return true;
    }
    return !this.minDate || !this._isSameView(this._activeDate, this.minDate);
  }

  /** Whether the next period button is enabled. */
  _nextEnabled(): boolean {
    return !this.maxDate || !this._isSameView(this._activeDate, this.maxDate);
  }

  /** Handles keydown events on the calendar body. */
  _handleCalendarBodyKeydown(event: KeyboardEvent): void {
    // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
    // disabled ones from being selected. This may not be ideal, we should look into whether
    // navigation should skip over disabled dates, and if so, how to implement that efficiently.
    if (this._currentView === "month") {
      this._handleCalendarBodyKeydownInMonthView(event);
    } else if (this._currentView === "year") {
      this._handleCalendarBodyKeydownInYearView(event);
    } else {
      this._handleCalendarBodyKeydownInClockView(event);
    }
  }

  _focusActiveCell() {
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.onStable.asObservable().pipe(first()).subscribe(() => {
        this._elementRef.nativeElement.focus();
      });
    });
  }

  /** Whether the two dates represent the same view in the current view mode (month or year). */
  private _isSameView(date1: D, date2: D): boolean {
    return this._currentView === "month" ?
      this._adapter.getYear(date1) == this._adapter.getYear(date2) &&
      this._adapter.getMonth(date1) == this._adapter.getMonth(date2) :
      this._adapter.getYear(date1) == this._adapter.getYear(date2);
  }

  /** Handles keydown events on the calendar body when calendar is in month view. */
  private _handleCalendarBodyKeydownInMonthView(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case LEFT_ARROW:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate, -1);
        break;
      case RIGHT_ARROW:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate, 1);
        break;
      case UP_ARROW:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate, -7);
        break;
      case DOWN_ARROW:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate, 7);
        break;
      case HOME:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate,
          1 - this._adapter.getDate(this._activeDate));
        break;
      case END:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate,
          (this._adapter.getNumDaysInMonth(this._activeDate) -
            this._adapter.getDate(this._activeDate)));
        break;
      case PAGE_UP:
        this._activeDate = event.altKey ?
          this._adapter.addCalendarYears(this._activeDate, -1) :
          this._adapter.addCalendarMonths(this._activeDate, -1);
        break;
      case PAGE_DOWN:
        this._activeDate = event.altKey ?
          this._adapter.addCalendarYears(this._activeDate, 1) :
          this._adapter.addCalendarMonths(this._activeDate, 1);
        break;
      case ENTER:
        if (this._dateFilterForViews(this._activeDate)) {
          this._dateSelected(this._activeDate);
          // Prevent unexpected default actions such as form submission.
          event.preventDefault();
        }
        return;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }

    // Prevent unexpected default actions such as form submission.
    event.preventDefault();
  }

  /** Handles keydown events on the calendar body when calendar is in year view. */
  private _handleCalendarBodyKeydownInYearView(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case LEFT_ARROW:
        this._activeDate = this._adapter.addCalendarMonths(this._activeDate, -1);
        break;
      case RIGHT_ARROW:
        this._activeDate = this._adapter.addCalendarMonths(this._activeDate, 1);
        break;
      case UP_ARROW:
        this._activeDate = this._prevMonthInSameCol(this._activeDate);
        break;
      case DOWN_ARROW:
        this._activeDate = this._nextMonthInSameCol(this._activeDate);
        break;
      case HOME:
        this._activeDate = this._adapter.addCalendarMonths(this._activeDate,
          -this._adapter.getMonth(this._activeDate));
        break;
      case END:
        this._activeDate = this._adapter.addCalendarMonths(this._activeDate,
          11 - this._adapter.getMonth(this._activeDate));
        break;
      case PAGE_UP:
        this._activeDate =
          this._adapter.addCalendarYears(this._activeDate, event.altKey ? -10 : -1);
        break;
      case PAGE_DOWN:
        this._activeDate =
          this._adapter.addCalendarYears(this._activeDate, event.altKey ? 10 : 1);
        break;
      case ENTER:
        this._monthSelected(this._activeDate);
        break;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }

    // Prevent unexpected default actions such as form submission.
    event.preventDefault();
  }

  /** Handles keydown events on the calendar body when calendar is in month view. */
  private _handleCalendarBodyKeydownInClockView(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case UP_ARROW:
        this._activeDate = this._clockView == "hour" ?
          this._adapter.addCalendarHours(this._activeDate, 1) :
          this._adapter.addCalendarMinutes(this._activeDate, 1);
        break;
      case DOWN_ARROW:
        this._activeDate = this._clockView == "hour" ?
          this._adapter.addCalendarHours(this._activeDate, -1) :
          this._adapter.addCalendarMinutes(this._activeDate, -1);
        break;
      case ENTER:
        this._timeSelected(this._activeDate);
        return;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }

    // Prevent unexpected default actions such as form submission.
    event.preventDefault();
  }

  /**
   * Determine the date for the month that comes before the given month in the same column in the
   * calendar table.
   */
  private _prevMonthInSameCol(date: D): D {
    // Determine how many months to jump forward given that there are 2 empty slots at the beginning
    // of each year.
    let increment = this._adapter.getMonth(date) <= 4 ? -5 :
      (this._adapter.getMonth(date) >= 7 ? -7 : -12);
    return this._adapter.addCalendarMonths(date, increment);
  }

  /**
   * Determine the date for the month that comes after the given month in the same column in the
   * calendar table.
   */
  private _nextMonthInSameCol(date: D): D {
    // Determine how many months to jump forward given that there are 2 empty slots at the beginning
    // of each year.
    let increment = this._adapter.getMonth(date) <= 4 ? 7 :
      (this._adapter.getMonth(date) >= 7 ? 5 : 12);
    return this._adapter.addCalendarMonths(date, increment);
  }

  private calendarState(direction: string): void {
    this._calendarState = direction;
  }

  _calendarStateDone() {
    this._calendarState = "";
  }

  private _2digit(n: number) {
    return ("00" + n).slice(-2);
  }
}
