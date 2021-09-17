/* eslint max-classes-per-file: ["error", 4] */
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { DOWN_ARROW, ESCAPE } from '@angular/cdk/keycodes';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { MAT_DATEPICKER_SCROLL_STRATEGY } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { DatetimeAdapter, MAT_DATETIME_FORMATS, MatDatetimeFormats } from '../adapter';
import { MatDatetimepickerCalendarComponent } from './calendar';
import { createMissingDateImplError } from './datetimepicker-errors';
import { MatDatetimepickerFilterType } from './datetimepicker-filtertype';
import { MatDatetimepickerMode } from './datetimepicker-mode.type';
import { MatDatetimepickerType } from './datetimepicker.type';
import { ScrollStrategy } from '@angular/cdk/overlay/scroll';
import { MatDatetimeCalendarViewType } from './calendar-view.type';

/** Used to generate a unique ID for each datepicker instance. */
let datetimepickerUid = 0;

/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MatDatepickerInputEvent instead.
 */
export class MatDatetimepickerInputEvent<D> {
  /** The new value for the target datepicker input. */
  value: D | null;

  constructor(
    public target: MatDatetimepickerInputDirective<D>,
    public targetElement: HTMLElement,
  ) {
    this.value = this.target.value;
  }
}

/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
@Component({
  selector: 'mat-datetimepicker-content',
  templateUrl: 'datetimepicker-content.html',
  styleUrls: ['datetimepicker-content.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatDatetimepickerContentComponent<D> implements AfterContentInit {
  @HostBinding('class')
  classes = 'mat-datetimepicker-content';

  @ViewChild(MatDatetimepickerCalendarComponent, { static: true })
  _calendar: MatDatetimepickerCalendarComponent<D>;

  datetimepicker: MatDatetimepickerComponent<D>;

  @HostBinding('class.mat-datetimepicker-content-touch')
  get classMatDatetimepickerContentTouch() {
    return this.datetimepicker?.touchUi;
  }

  ngAfterContentInit() {
    this._calendar._focusActiveCell();
  }

  onSelectionChange(date: D) {
    this.datetimepicker._select(date);
    this.datetimepicker.close();
  }

  /**
   * Handles keydown event on datepicker content.
   * @param event The event.
   */
  @HostListener('document:keydown', ['$event'])
  _handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE) {
      this.datetimepicker.close();
      event.preventDefault();
      event.stopPropagation();
    }
  }
}

@Component({
  selector: 'mat-datetimepicker',
  exportAs: 'matDatetimepicker',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
})
export class MatDatetimepickerComponent<D> implements OnDestroy {
  /** Active multi year view when click on year. */
  @Input() multiYearSelector: boolean = false;
  /** if true change the clock to 12 hour format. */
  @Input() twelvehour: boolean = false;
  /** The view that the calendar should start in. */
  @Input() startView: MatDatetimeCalendarViewType = 'month';
  @Input() mode: MatDatetimepickerMode = 'auto';
  @Input() timeInterval: number = 1;
  @Input() ariaNextMonthLabel = 'Next month';
  @Input() ariaPrevMonthLabel = 'Previous month';
  @Input() ariaNextYearLabel = 'Next year';
  @Input() ariaPrevYearLabel = 'Previous year';
  /** Prevent user to select same date time */
  @Input() preventSameDateTimeSelection = false;
  /**
   * Emits new selected date when selected date changes.
   * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.
   */
  @Output() selectedChanged = new EventEmitter<D>();
  /** Classes to be passed to the date picker panel. Supports the same syntax as `ngClass`. */
  @Input() panelClass: string | string[];
  /** Emits when the datepicker has been opened. */
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('opened') openedStream: EventEmitter<void> = new EventEmitter<void>();
  /** Emits when the datepicker has been closed. */
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('closed') closedStream: EventEmitter<void> = new EventEmitter<void>();
  /** Emits when the view has been changed. */
  @Output() viewChanged: EventEmitter<MatDatetimeCalendarViewType> =
    new EventEmitter<MatDatetimeCalendarViewType>();
  /** Whether the calendar is open. */
  opened = false;
  /** The id for the datepicker calendar. */
  id = `mat-datetimepicker-${(datetimepickerUid += 1)}`;
  /** The input element this datepicker is associated with. */
  _datepickerInput: MatDatetimepickerInputDirective<D>;
  /** Emits when the datepicker is disabled. */
  _disabledChange = new Subject<boolean>();
  private _validSelected: D | null = null;
  /** A reference to the overlay when the calendar is opened as a popup. */
  private _popupRef: OverlayRef;
  /** A reference to the dialog when the calendar is opened as a dialog. */
  private _dialogRef: MatDialogRef<any> | null;
  /** A portal containing the calendar for this datepicker. */
  private _calendarPortal: ComponentPortal<MatDatetimepickerContentComponent<D>>;
  /** The element that was focused before the datepicker was opened. */
  private _focusedElementBeforeOpen: HTMLElement | null = null;
  private _inputSubscription = Subscription.EMPTY;

  constructor(
    private _dialog: MatDialog,
    private _overlay: Overlay,
    private _ngZone: NgZone,
    private _viewContainerRef: ViewContainerRef,
    @Inject(MAT_DATEPICKER_SCROLL_STRATEGY) private _scrollStrategy: ScrollStrategy,
    @Optional() private _dateAdapter: DatetimeAdapter<D>,
    @Optional() private _dir: Directionality,
    @Optional() @Inject(DOCUMENT) private _document: any,
  ) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
  }

  private _startAt: D | null;

  /** The date to open the calendar to initially. */
  @Input()
  get startAt(): D | null {
    // If an explicit startAt is set we start there, otherwise we start at whatever the currently
    // selected value is.
    return this._startAt || (this._datepickerInput ? this._datepickerInput.value : null);
  }

  set startAt(date: D | null) {
    this._startAt = this._dateAdapter.getValidDateOrNull(date);
  }

  private _openOnFocus: boolean;

  @Input()
  get openOnFocus(): boolean {
    return this._openOnFocus;
  }

  set openOnFocus(value: boolean) {
    this._openOnFocus = coerceBooleanProperty(value);
  }

  private _type: MatDatetimepickerType = 'date';

  @Input()
  get type() {
    return this._type;
  }

  set type(value: MatDatetimepickerType) {
    this._type = value || 'date';
  }

  private _touchUi = false;

  /**
   * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
   * than a popup and elements have more padding to allow for bigger touch targets.
   */
  @Input()
  get touchUi(): boolean {
    return this._touchUi;
  }

  set touchUi(value: boolean) {
    this._touchUi = coerceBooleanProperty(value);
  }

  private _disabled: boolean;

  /** Whether the datepicker pop-up should be disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined && this._datepickerInput
      ? this._datepickerInput.disabled
      : !!this._disabled;
  }

  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this._disabledChange.next(newValue);
    }
  }

  /** The currently selected date. */
  get _selected(): D | null {
    return this._validSelected;
  }

  set _selected(value: D | null) {
    this._validSelected = value;
  }

  /** The minimum selectable date. */
  get _minDate(): D | null {
    return this._datepickerInput && this._datepickerInput.min;
  }

  /** The maximum selectable date. */
  get _maxDate(): D | null {
    return this._datepickerInput && this._datepickerInput.max;
  }

  get _dateFilter(): (date: D | null, type: MatDatetimepickerFilterType) => boolean {
    return this._datepickerInput && this._datepickerInput._dateFilter;
  }

  _handleFocus() {
    if (!this.opened && this.openOnFocus) {
      this.open();
    }
  }

  _viewChanged(type: MatDatetimeCalendarViewType): void {
    this.viewChanged.emit(type);
  }

  ngOnDestroy() {
    this.close();
    this._inputSubscription.unsubscribe();
    this._disabledChange.complete();

    if (this._popupRef) {
      this._popupRef.dispose();
    }
  }

  /** Selects the given date */
  _select(date: D): void {
    const oldValue = this._selected;
    this._selected = date;
    if (!this._dateAdapter.sameDatetime(oldValue, this._selected)) {
      this.selectedChanged.emit(date);
    }
  }

  /**
   * Register an input with this datepicker.
   * @param input The datepicker input to register with this datepicker.
   */
  _registerInput(input: MatDatetimepickerInputDirective<D>): void {
    if (this._datepickerInput) {
      throw Error('A MatDatepicker can only be associated with a single input.');
    }
    this._datepickerInput = input;
    this._inputSubscription = this._datepickerInput._valueChange.subscribe((value: D | null) => {
      this._selected = value;
    });
  }

  /** Open the calendar. */
  open(): void {
    if (this.opened || this.disabled) {
      return;
    }
    if (!this._datepickerInput) {
      throw Error('Attempted to open an MatDatepicker with no associated input.');
    }
    if (this._document) {
      this._focusedElementBeforeOpen = this._document.activeElement;
    }

    if (this.touchUi) {
      this._openAsDialog();
    } else {
      this._openAsPopup();
    }

    this.opened = true;
    this.openedStream.emit();
  }

  /** Close the calendar. */
  close(): void {
    if (!this.opened) {
      return;
    }
    if (this._popupRef && this._popupRef.hasAttached()) {
      this._popupRef.detach();
    }
    if (this._dialogRef) {
      this._dialogRef.close();
      this._dialogRef = null;
    }
    if (this._calendarPortal && this._calendarPortal.isAttached) {
      this._calendarPortal.detach();
    }

    const completeClose = () => {
      // The `_opened` could've been reset already if
      // we got two events in quick succession.
      if (this.opened) {
        this.opened = false;
        this.closedStream.emit();
        this._focusedElementBeforeOpen = null;
      }
    };

    if (
      this._focusedElementBeforeOpen &&
      typeof this._focusedElementBeforeOpen.focus === 'function'
    ) {
      // Because IE moves focus asynchronously, we can't count on it being restored before we've
      // marked the datepicker as closed. If the event fires out of sequence and the element that
      // we're refocusing opens the datepicker on focus, the user could be stuck with not being
      // able to close the calendar at all. We work around it by making the logic, that marks
      // the datepicker as closed, async as well.
      this._focusedElementBeforeOpen.focus();
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }

  /** Open the calendar as a dialog. */
  private _openAsDialog(): void {
    this._dialogRef = this._dialog.open(MatDatetimepickerContentComponent, {
      direction: this._dir ? this._dir.value : 'ltr',
      viewContainerRef: this._viewContainerRef,
      panelClass: 'mat-datetimepicker-dialog',
    });
    this._dialogRef.afterClosed().subscribe(() => this.close());
    this._dialogRef.componentInstance.datetimepicker = this;
  }

  /** Open the calendar as a popup. */
  private _openAsPopup(): void {
    if (!this._calendarPortal) {
      this._calendarPortal = new ComponentPortal<MatDatetimepickerContentComponent<D>>(
        MatDatetimepickerContentComponent,
        this._viewContainerRef,
      );
    }

    if (!this._popupRef) {
      this._createPopup();
    }

    if (!this._popupRef.hasAttached()) {
      const componentRef: ComponentRef<MatDatetimepickerContentComponent<D>> =
        this._popupRef.attach(this._calendarPortal);
      componentRef.instance.datetimepicker = this;

      // Update the position once the calendar has rendered.
      this._ngZone.onStable
        .asObservable()
        .pipe(first())
        .subscribe(() => {
          this._popupRef.updatePosition();
        });
    }

    this._popupRef.backdropClick().subscribe(() => this.close());
  }

  /** Create the popup. */
  private _createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: 'mat-overlay-transparent-backdrop',
      direction: this._dir ? this._dir.value : 'ltr',
      scrollStrategy: this._scrollStrategy,
      panelClass: 'mat-datetimepicker-popup',
    });

    this._popupRef = this._overlay.create(overlayConfig);
  }

  /** Create the popup PositionStrategy. */
  private _createPopupPositionStrategy(): PositionStrategy {
    return this._overlay
      .position()
      .flexibleConnectedTo(this._datepickerInput.getConnectedOverlayOrigin())
      .withTransformOriginOn('.mat-datetimepicker-content')
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
        },
      ]);
  }
}

/** Directive used to connect an input to a MatDatepicker. */
@Directive({
  selector: 'input[matDatetimepicker]',
  providers: [
    // MAT_DATETIMEPICKER_VALUE_ACCESSOR,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatDatetimepickerInputDirective),
      multi: true,
    },
    // MAT_DATETIMEPICKER_VALIDATORS,
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MatDatetimepickerInputDirective),
      multi: true,
    },
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MatDatetimepickerInputDirective },
  ],
  exportAs: 'matDatepickerInput',
})
export class MatDatetimepickerInputDirective<D>
  implements AfterContentInit, ControlValueAccessor, OnDestroy, Validator
{
  @HostBinding('aria.haspopup')
  ariaHaspopup = true;

  _datepicker: MatDatetimepickerComponent<D>;
  _dateFilter: (date: D | null, type: MatDatetimepickerFilterType) => boolean;
  /** Emits when a `change` event is fired on this `<input>`. */
  @Output() dateChange = new EventEmitter<MatDatetimepickerInputEvent<D>>();
  /** Emits when an `input` event is fired on this `<input>`. */
  @Output() dateInput = new EventEmitter<MatDatetimepickerInputEvent<D>>();
  /** Emits when the value changes (either due to user input or programmatic change). */
  _valueChange = new EventEmitter<D | null>();
  /** Emits when the disabled state has changed */
  _disabledChange = new EventEmitter<boolean>();
  private _datepickerSubscription = Subscription.EMPTY;
  private _localeSubscription = Subscription.EMPTY;
  /** Whether the last value set on the input was valid. */
  private _lastValueValid = false;

  constructor(
    private _elementRef: ElementRef,
    @Optional() public _dateAdapter: DatetimeAdapter<D>,
    @Optional() @Inject(MAT_DATETIME_FORMATS) private _dateFormats: MatDatetimeFormats,
    @Optional() private _formField: MatFormField,
  ) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DatetimeAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('MAT_DATETIME_FORMATS');
    }

    // Update the displayed date when the locale changes.
    this._localeSubscription = _dateAdapter.localeChanges.subscribe(() => {
      this.value = this._value;
    });
  }

  /** The datepicker that this input is associated with. */
  @Input()
  set matDatetimepicker(value: MatDatetimepickerComponent<D>) {
    this.registerDatepicker(value);
  }

  @Input() set matDatepickerFilter(
    filter: (date: D | null, type: MatDatetimepickerFilterType) => boolean,
  ) {
    this._dateFilter = filter;
    this._validatorOnChange();
  }

  private _value: D | null;

  /** The value of the input. */
  @Input()
  get value(): D | null {
    return this._value;
  }

  set value(value: D | null) {
    const deserializedValue = this._dateAdapter.deserialize(value);
    this._lastValueValid = !deserializedValue || this._dateAdapter.isValid(deserializedValue);
    const validDate = this._dateAdapter.getValidDateOrNull(deserializedValue);
    const oldDate = this.value;
    this._value = validDate;
    this._formatValue(validDate);

    // use timeout to ensure the datetimepicker is instantiated and we get the correct format
    setTimeout(() => {
      if (!this._dateAdapter.sameDatetime(oldDate, this._value)) {
        this._valueChange.emit(this._value);
      }
    });
  }

  private _min: D | null;

  /** The minimum valid date. */
  @Input()
  get min(): D | null {
    return this._min;
  }

  set min(value: D | null) {
    this._min = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._validatorOnChange();
  }

  private _max: D | null;

  /** The maximum valid date. */
  @Input()
  get max(): D | null {
    return this._max;
  }

  set max(value: D | null) {
    this._max = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._validatorOnChange();
  }

  private _disabled: boolean;

  /** Whether the datepicker-input is disabled. */
  @Input()
  @HostBinding('disabled')
  get disabled() {
    return !!this._disabled;
  }

  set disabled(value: any) {
    const newValue = coerceBooleanProperty(value);

    if (this._disabled !== newValue) {
      this._disabled = newValue;
      this._disabledChange.emit(newValue);
    }
  }

  @HostBinding('attr.aria-owns')
  get ariaOwns() {
    return (this._datepicker?.opened && this._datepicker.id) || null;
  }

  @HostBinding('attr.min')
  get minIso8601() {
    return this.min ? this._dateAdapter.toIso8601(this.min) : null;
  }

  @HostBinding('attr.max')
  get maxIso8601() {
    return this.max ? this._dateAdapter.toIso8601(this.max) : null;
  }

  _onTouched = () => {};

  ngAfterContentInit() {
    if (this._datepicker) {
      this._datepickerSubscription = this._datepicker.selectedChanged.subscribe((selected: D) => {
        this.value = selected;
        this._cvaOnChange(selected);
        this._onTouched();
        this.dateInput.emit(new MatDatetimepickerInputEvent(this, this._elementRef.nativeElement));
        this.dateChange.emit(new MatDatetimepickerInputEvent(this, this._elementRef.nativeElement));
      });
    }
  }

  ngOnDestroy() {
    this._datepickerSubscription.unsubscribe();
    this._localeSubscription.unsubscribe();
    this._valueChange.complete();
    this._disabledChange.complete();
  }

  registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(c) : null;
  }

  /**
   * Gets the element that the datepicker popup should be connected to.
   * @return The element to connect the popup to.
   */
  getConnectedOverlayOrigin(): ElementRef {
    return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
  }

  // Implemented as part of ControlValueAccessor
  writeValue(value: D): void {
    this.value = value;
  }

  // Implemented as part of ControlValueAccessor
  registerOnChange(fn: (value: any) => void): void {
    this._cvaOnChange = fn;
  }

  // Implemented as part of ControlValueAccessor
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  @HostListener('document:keydown', ['$event'])
  _onKeydown(event: KeyboardEvent) {
    if (event.altKey && event.keyCode === DOWN_ARROW) {
      this._datepicker.open();
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event.target.value'])
  _onInput(value: string) {
    let date = this._dateAdapter.parse(value, this.getParseFormat());
    this._lastValueValid = !date || this._dateAdapter.isValid(date);
    date = this._dateAdapter.getValidDateOrNull(date);
    this._value = date;
    this._cvaOnChange(date);
    this._valueChange.emit(date);
    this.dateInput.emit(new MatDatetimepickerInputEvent(this, this._elementRef.nativeElement));
  }

  @HostListener('focus')
  _onFocus() {
    this._datepicker._handleFocus();
  }

  @HostListener('change')
  _onChange() {
    this.dateChange.emit(new MatDatetimepickerInputEvent(this, this._elementRef.nativeElement));
  }

  /** Handles blur events on the input. */
  @HostListener('blur')
  _onBlur() {
    // Reformat the input only if we have a valid value.
    if (this.value) {
      this._formatValue(this.value);
    }

    this._onTouched();
  }

  private registerDatepicker(value: MatDatetimepickerComponent<D>) {
    if (value) {
      this._datepicker = value;
      this._datepicker._registerInput(this);
    }
  }

  private getDisplayFormat() {
    switch (this._datepicker.type) {
      case 'date':
        return this._dateFormats.display.dateInput;
      case 'datetime':
        return this._dateFormats.display.datetimeInput;
      case 'time':
        return this._dateFormats.display.timeInput;
      case 'month':
        return this._dateFormats.display.monthInput;
      default:
        return this._dateFormats.parse.dateInput;
    }
  }

  private getParseFormat() {
    let parseFormat;

    switch (this._datepicker.type) {
      case 'date':
        parseFormat = this._dateFormats.parse.dateInput;
        break;
      case 'datetime':
        parseFormat = this._dateFormats.parse.datetimeInput;
        break;
      case 'time':
        parseFormat = this._dateFormats.parse.timeInput;
        break;
      case 'month':
        parseFormat = this._dateFormats.parse.monthInput;
        break;
      default:
        parseFormat = this._dateFormats.parse.dateInput;
    }

    return parseFormat;
  }

  private _cvaOnChange: (value: any) => void = () => {};

  private _validatorOnChange = () => {};

  /** The form control validator for whether the input parses. */
  private _parseValidator: ValidatorFn = (): ValidationErrors | null => {
    return this._lastValueValid
      ? null
      : { matDatepickerParse: { text: this._elementRef.nativeElement.value } };
  };

  /** The form control validator for the min date. */
  private _minValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(control.value),
    );
    return !this.min ||
      !controlValue ||
      this._dateAdapter.compareDatetime(this.min, controlValue) <= 0
      ? null
      : { matDatepickerMin: { min: this.min, actual: controlValue } };
  };

  /** The form control validator for the max date. */
  private _maxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(control.value),
    );
    return !this.max ||
      !controlValue ||
      this._dateAdapter.compareDatetime(this.max, controlValue) >= 0
      ? null
      : { matDatepickerMax: { max: this.max, actual: controlValue } };
  };

  /** The form control validator for the date filter. */
  private _filterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(control.value),
    );
    return !this._dateFilter ||
      !controlValue ||
      this._dateFilter(controlValue, MatDatetimepickerFilterType.DATE)
      ? null
      : { matDatepickerFilter: true };
  };

  /** The combined form control validator for this input. */
  private _validator: ValidatorFn | null = Validators.compose([
    this._parseValidator,
    this._minValidator,
    this._maxValidator,
    this._filterValidator,
  ]);

  /** Formats a value and sets it on the input element. */
  private _formatValue(value: D | null) {
    this._elementRef.nativeElement.value = value
      ? this._dateAdapter.format(value, this.getDisplayFormat())
      : '';
  }
}

// export const MAT_DATETIMEPICKER_VALUE_ACCESSOR: any = {
//   provide: NG_VALUE_ACCESSOR,
//   useExisting: forwardRef(() => MatDatetimepickerInputDirective),
//   multi: true,
// };

// export const MAT_DATETIMEPICKER_VALIDATORS: any = {
//   provide: NG_VALIDATORS,
//   useExisting: forwardRef(() => MatDatetimepickerInputDirective),
//   multi: true,
// };
