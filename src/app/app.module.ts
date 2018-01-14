import { registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/de";
import {
  NgModule,
  LOCALE_ID
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule
} from "@angular/forms";
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule
} from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatDatetimepickerModule,
  MatNativeDatetimeModule,
  MAT_DATETIME_FORMATS
} from "@mat-datetimepicker/core";
// import {
//   MatMomentDatetimeModule,
//   MAT_MOMENT_DATETIME_FORMATS
// } from "@mat-datetimepicker/moment";

import { AppComponent } from "./app.component";

registerLocaleData(localeDe);

@NgModule({
  providers: [
    {
      provide: LOCALE_ID,
      useValue: "de-DE"
    },
    // this is only needed if you want to override the automatic moment formats
    {
      provide: MAT_DATETIME_FORMATS,
      useValue: {
        //     parse: {
        //       dateInput: "l"
        //     },
        //     display: {
        //       dateInput: "l",
        //       monthInput: "MMMM",
        //       datetimeInput: "LLL",
        //       timeInput: "LT",
        //       monthYearLabel: "MMM YYYY",
        //       dateA11yLabel: "LL",
        //       monthYearA11yLabel: "MMMM YYYY"
        //     }
        //   }
        // same goes for native formats
        parse: {
          dateInput: null
        },
        display: {
          dateInput: {year: "numeric", month: "numeric", day: "numeric"},
          monthInput: {month: "long"},
          datetimeInput: {year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric"},
          timeInput: {hour: "numeric", minute: "numeric"},
          monthYearLabel: {year: "numeric", month: "short"},
          dateA11yLabel: {year: "numeric", month: "long", day: "numeric"},
          monthYearA11yLabel: {year: "numeric", month: "long"}
        }
      }
    }
  ],
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    // use this if you want to use native javascript dates and INTL API if available
    MatNativeDatetimeModule,
    // MatMomentDatetimeModule,
    MatDatetimepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
