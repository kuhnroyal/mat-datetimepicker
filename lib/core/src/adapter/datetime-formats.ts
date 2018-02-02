import { InjectionToken } from "@angular/core";

// noinspection TsLint
export type MatDatetimeFormats = {
  parse: {
    dateInput?: any,
    monthInput?: any,
    timeInput?: any,
    datetimeInput?: any
  },
  display: {
    dateInput: any,
    monthInput: any,
    timeInput: any,
    datetimeInput: any,
    monthYearLabel: any,
    dateA11yLabel: any,
    monthYearA11yLabel: any,
  }
};

export const MAT_DATETIME_FORMATS = new InjectionToken<MatDatetimeFormats>("mat-datetime-formats");
