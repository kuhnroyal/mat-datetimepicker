import { MatDatetimeFormats } from "@mat-datetimepicker/core";

export const MAT_MOMENT_DATETIME_FORMATS: MatDatetimeFormats = {
  parse: {
    dateInput: "l",
    monthInput: "MMMM",
    timeInput: "LT",
    datetimeInput: "L LT"
  },
  display: {
    dateInput: "l",
    monthInput: "MMMM",
    datetimeInput: "L LT",
    timeInput: "LT",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};
