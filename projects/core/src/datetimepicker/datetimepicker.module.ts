import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDatetimepickerCalendarComponent } from './calendar';
import { MatDatetimepickerCalendarBodyComponent } from './calendar-body';
import { MatDatetimepickerClockComponent } from './clock';
import {
  MatDatetimepickerComponent,
  MatDatetimepickerContentComponent,
} from './datetimepicker';
import { MatDatetimepickerActionsComponent } from './datetimepicker-actions.component';
import { MatDatetimepickerInputDirective } from './datetimepicker-input';
import { MatDatetimepickerToggleComponent } from './datetimepicker-toggle';
import { MatDatetimepickerMonthViewComponent } from './month-view';
import { MatDatetimepickerYearViewComponent } from './year-view';
import { MatDatetimepickerMultiYearViewComponent } from './multi-year-view';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    OverlayModule,
    A11yModule,
  ],
  declarations: [
    MatDatetimepickerCalendarComponent,
    MatDatetimepickerCalendarBodyComponent,
    MatDatetimepickerClockComponent,
    MatDatetimepickerComponent,
    MatDatetimepickerToggleComponent,
    MatDatetimepickerInputDirective,
    MatDatetimepickerContentComponent,
    MatDatetimepickerMonthViewComponent,
    MatDatetimepickerYearViewComponent,
    MatDatetimepickerMultiYearViewComponent,
    MatDatetimepickerActionsComponent,
  ],
  exports: [
    MatDatetimepickerCalendarComponent,
    MatDatetimepickerCalendarBodyComponent,
    MatDatetimepickerClockComponent,
    MatDatetimepickerComponent,
    MatDatetimepickerToggleComponent,
    MatDatetimepickerInputDirective,
    MatDatetimepickerContentComponent,
    MatDatetimepickerMonthViewComponent,
    MatDatetimepickerYearViewComponent,
    MatDatetimepickerMultiYearViewComponent,
    MatDatetimepickerActionsComponent,
  ],
})
export class MatDatetimepickerModule {}
