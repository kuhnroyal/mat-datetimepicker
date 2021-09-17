import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDatetimepickerCalendarComponent } from './calendar';
import { MatDatetimepickerCalendarBodyComponent } from './calendar-body';
import { MatDatetimepickerClockComponent } from './clock';
import {
  MatDatetimepickerComponent,
  MatDatetimepickerContentComponent,
  MatDatetimepickerInputDirective,
} from './datetimepicker';
import { MatDatetimepickerToggleComponent } from './datetimepicker-toggle';
import { MatDatetimepickerMonthView } from './month-view';
import { MatDatetimepickerYearView } from './year-view';
import { MatDatetimepickerMultiYearView } from './multi-year-view';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    OverlayModule,
    A11yModule,
  ],
  entryComponents: [MatDatetimepickerContentComponent],
  declarations: [
    MatDatetimepickerCalendarComponent,
    MatDatetimepickerCalendarBodyComponent,
    MatDatetimepickerClockComponent,
    MatDatetimepickerComponent,
    MatDatetimepickerToggleComponent,
    MatDatetimepickerInputDirective,
    MatDatetimepickerContentComponent,
    MatDatetimepickerMonthView,
    MatDatetimepickerYearView,
    MatDatetimepickerMultiYearView,
  ],
  exports: [
    MatDatetimepickerCalendarComponent,
    MatDatetimepickerCalendarBodyComponent,
    MatDatetimepickerClockComponent,
    MatDatetimepickerComponent,
    MatDatetimepickerToggleComponent,
    MatDatetimepickerInputDirective,
    MatDatetimepickerContentComponent,
    MatDatetimepickerMonthView,
    MatDatetimepickerYearView,
    MatDatetimepickerMultiYearView,
  ],
})
export class MatDatetimepickerModule {}
