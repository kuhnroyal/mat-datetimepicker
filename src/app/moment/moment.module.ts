import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MomentDatetimeComponent } from './moment.component';

@NgModule({
  declarations: [MomentDatetimeComponent],
  exports: [MomentDatetimeComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatetimepickerModule,
  ],
})
export class AppMomentModule {}
