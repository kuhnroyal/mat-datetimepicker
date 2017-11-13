import { A11yModule } from "@angular/cdk/a11y";
import { OverlayModule } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule
} from "@angular/material";
import { MatDatetimepickerCalendar } from "./calendar";
import { MatDatetimepickerCalendarBody } from "./calendar-body";
import { MatDatetimepickerClock } from "./clock";
import {
  MatDatetimepicker,
  MatDatetimepickerContent
} from "./datetimepicker";
import { MatDatetimepickerToggle } from "./datetimepicker-toggle";
import { MatDatetimepickerInput } from "./datetimepicker-input";
import { MatDatetimepickerMonthView } from "./month-view";
import { MatDatetimepickerYearView } from "./year-view";

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    OverlayModule,
    A11yModule
  ],
  entryComponents: [
    MatDatetimepickerContent
  ],
  declarations: [
    MatDatetimepickerCalendar,
    MatDatetimepickerCalendarBody,
    MatDatetimepickerClock,
    MatDatetimepicker,
    MatDatetimepickerToggle,
    MatDatetimepickerInput,
    MatDatetimepickerContent,
    MatDatetimepickerMonthView,
    MatDatetimepickerYearView
  ],
  exports: [
    MatDatetimepickerCalendar,
    MatDatetimepickerCalendarBody,
    MatDatetimepickerClock,
    MatDatetimepicker,
    MatDatetimepickerToggle,
    MatDatetimepickerInput,
    MatDatetimepickerContent,
    MatDatetimepickerMonthView,
    MatDatetimepickerYearView
  ]
})
export class MatDatetimepickerModule {
}
