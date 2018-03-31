/* tslint:disable */

import { Directionality } from "@angular/cdk/bidi";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ESCAPE } from "@angular/cdk/keycodes";
import {
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy
} from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from "@angular/core";
import { MAT_DATEPICKER_SCROLL_STRATEGY } from "@angular/material";
import {
  MatDialog,
  MatDialogRef
} from "@angular/material/dialog";
import { DOCUMENT } from "@angular/platform-browser";
import { first } from "rxjs/operators/first";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import { DatetimeAdapter } from "../adapter/datetime-adapter";
import { MatDatetimepickerCalendar } from "./calendar";
import { createMissingDateImplError } from "./datetimepicker-errors";
import { MatDatetimepickerInput } from "./datetimepicker-input";

/** Used to generate a unique ID for each datepicker instance. */
let datetimepickerUid = 0;

/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
@Component({
  selector: "mat-datetimepicker-content",
  templateUrl: "datetimepicker-content.html",
  styleUrls: ["datetimepicker-content.scss"],
  host: {
    "class": "mat-datetimepicker-content",
    "[class.mat-datetimepicker-content-touch]": "datetimepicker?.touchUi",
    "(keydown)": "_handleKeydown($event)"
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatDatetimepickerContent<D> implements AfterContentInit {
  datetimepicker: MatDatetimepicker<D>;

  @ViewChild(MatDatetimepickerCalendar) _calendar: MatDatetimepickerCalendar<D>;

  ngAfterContentInit() {
    this._calendar._focusActiveCell();
  }

  /**
   * Handles keydown event on datepicker content.
   * @param event The event.
   */
  _handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE) {
      this.datetimepicker.close();
      event.preventDefault();
      event.stopPropagation();
    }
  }
}

@Component({
  selector: "mat-datetimepicker",
  exportAs: "matDatetimepicker",
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class MatDatetimepicker<D> implements OnDestroy {
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

  private _startAt: D | null;

  /** The view that the calendar should start in. */
  @Input() startView: 'clock' | 'month' | 'year' = 'month';
  @Input() mode: 'auto' | 'portrait' | 'landscape' = 'auto';
  @Input() timeInterval: number = 1;

  @Input()
  get openOnFocus(): boolean { return this._openOnFocus; }
  set openOnFocus(value: boolean) { this._openOnFocus = coerceBooleanProperty(value); }
  private _openOnFocus: boolean;

  _handleFocus() {
    if (!this.opened && this.openOnFocus) {
      this.open();
    }
  }

  @Input()
  get type() {
    return this._type;
  }

  set type(value: "date" | "time" | "month" | "datetime") {
    this._type = value || "date";
  }

  private _type: "date" | "time" | "month" | "datetime" = "date";

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

  private _touchUi = false;

  /** Whether the datepicker pop-up should be disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined && this._datepickerInput ?
      this._datepickerInput.disabled : !!this._disabled;
  }

  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this._disabledChange.next(newValue);
    }
  }

  private _disabled: boolean;

  /**
   * Emits new selected date when selected date changes.
   * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.
   */
  @Output() selectedChanged = new EventEmitter<D>();

  /** Classes to be passed to the date picker panel. Supports the same syntax as `ngClass`. */
  @Input() panelClass: string | string[];

  /** Emits when the datepicker has been opened. */
  @Output("opened") openedStream: EventEmitter<void> = new EventEmitter<void>();

  /** Emits when the datepicker has been closed. */
  @Output("closed") closedStream: EventEmitter<void> = new EventEmitter<void>();

  /** Whether the calendar is open. */
  opened = false;

  /** The id for the datepicker calendar. */
  id = `mat-datetimepicker-${datetimepickerUid++}`;

  /** The currently selected date. */
  get _selected(): D | null {
    return this._validSelected;
  }

  set _selected(value: D | null) {
    this._validSelected = value;
  }

  private _validSelected: D | null = null;

  /** The minimum selectable date. */
  get _minDate(): D | null {
    return this._datepickerInput && this._datepickerInput.min;
  }

  /** The maximum selectable date. */
  get _maxDate(): D | null {
    return this._datepickerInput && this._datepickerInput.max;
  }

  get _dateFilter(): (date: D | null) => boolean {
    return this._datepickerInput && this._datepickerInput._dateFilter;
  }

  /** A reference to the overlay when the calendar is opened as a popup. */
  private _popupRef: OverlayRef;

  /** A reference to the dialog when the calendar is opened as a dialog. */
  private _dialogRef: MatDialogRef<any> | null;

  /** A portal containing the calendar for this datepicker. */
  private _calendarPortal: ComponentPortal<MatDatetimepickerContent<D>>;

  /** The element that was focused before the datepicker was opened. */
  private _focusedElementBeforeOpen: HTMLElement | null = null;

  private _inputSubscription = Subscription.EMPTY;

  /** The input element this datepicker is associated with. */
  _datepickerInput: MatDatetimepickerInput<D>;

  /** Emits when the datepicker is disabled. */
  _disabledChange = new Subject<boolean>();

  constructor(private _dialog: MatDialog,
              private _overlay: Overlay,
              private _ngZone: NgZone,
              private _viewContainerRef: ViewContainerRef,
              @Inject(MAT_DATEPICKER_SCROLL_STRATEGY) private _scrollStrategy,
              @Optional() private _dateAdapter: DatetimeAdapter<D>,
              @Optional() private _dir: Directionality,
              @Optional() @Inject(DOCUMENT) private _document: any) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError("DateAdapter");
    }
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
    let oldValue = this._selected;
    this._selected = date;
    if (!this._dateAdapter.sameDatetime(oldValue, this._selected)) {
      this.selectedChanged.emit(date);
    }
  }

  /**
   * Register an input with this datepicker.
   * @param input The datepicker input to register with this datepicker.
   */
  _registerInput(input: MatDatetimepickerInput<D>): void {
    if (this._datepickerInput) {
      throw Error("A MatDatepicker can only be associated with a single input.");
    }
    this._datepickerInput = input;
    this._inputSubscription =
      this._datepickerInput._valueChange.subscribe((value: D | null) => this._selected = value);
  }

  /** Open the calendar. */
  open(): void {
    if (this.opened || this.disabled) {
      return;
    }
    if (!this._datepickerInput) {
      throw Error("Attempted to open an MatDatepicker with no associated input.");
    }
    if (this._document) {
      this._focusedElementBeforeOpen = this._document.activeElement;
    }

    this.touchUi ? this._openAsDialog() : this._openAsPopup();
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

    if (this._focusedElementBeforeOpen &&
      typeof this._focusedElementBeforeOpen.focus === 'function') {
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
    this._dialogRef = this._dialog.open(MatDatetimepickerContent, {
      direction: this._dir ? this._dir.value : "ltr",
      viewContainerRef: this._viewContainerRef,
      panelClass: "mat-datetimepicker-dialog"
    });
    this._dialogRef.afterClosed().subscribe(() => this.close());
    this._dialogRef.componentInstance.datetimepicker = this;
  }

  /** Open the calendar as a popup. */
  private _openAsPopup(): void {
    if (!this._calendarPortal) {
      this._calendarPortal = new ComponentPortal(MatDatetimepickerContent, this._viewContainerRef);
    }

    if (!this._popupRef) {
      this._createPopup();
    }

    if (!this._popupRef.hasAttached()) {
      let componentRef: ComponentRef<MatDatetimepickerContent<D>> =
        this._popupRef.attach(this._calendarPortal);
      componentRef.instance.datetimepicker = this;

      // Update the position once the calendar has rendered.
      this._ngZone.onStable.asObservable().pipe(first()).subscribe(() => {
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
      backdropClass: "mat-overlay-transparent-backdrop",
      direction: this._dir ? this._dir.value : "ltr",
      scrollStrategy: this._scrollStrategy(),
      panelClass: "mat-datetimepicker-popup"
    });

    this._popupRef = this._overlay.create(overlayConfig);
  }

  /** Create the popup PositionStrategy. */
  private _createPopupPositionStrategy(): PositionStrategy {
    return this._overlay.position()
      .connectedTo(this._datepickerInput.getPopupConnectionElementRef(),
        {originX: "start", originY: "bottom"},
        {overlayX: "start", overlayY: "top"}
      )
      .withFallbackPosition(
        {originX: "start", originY: "top"},
        {overlayX: "start", overlayY: "bottom"}
      )
      .withFallbackPosition(
        {originX: "end", originY: "bottom"},
        {overlayX: "end", overlayY: "top"}
      )
      .withFallbackPosition(
        {originX: "end", originY: "top"},
        {overlayX: "end", overlayY: "bottom"}
      );
  }
}
