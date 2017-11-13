import { MatDatetimeFormats } from "./datetime-formats";

export const MAT_NATIVE_DATETIME_FORMATS: MatDatetimeFormats = {
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
};
