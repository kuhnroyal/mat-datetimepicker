import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {
  DateAdapter,
  NativeDateAdapter
} from "@angular/material";
import {
  DatetimeAdapter,
  MAT_DATETIME_FORMATS,
  MAT_NATIVE_DATETIME_FORMATS,
  MatDatetimepickerFilterType,
  NativeDatetimeAdapter
} from "@mat-datetimepicker/core";

@Component({
  selector: "app-native-datetime",
  templateUrl: "../date.component.html",
  providers: [
    {
      provide: DateAdapter,
      useClass: NativeDateAdapter
    },
    {
      provide: DatetimeAdapter,
      useClass: NativeDatetimeAdapter
    },
    {
      provide: MAT_DATETIME_FORMATS,
      useValue: MAT_NATIVE_DATETIME_FORMATS
    }
  ]
})
export class NativeDatetimeComponent {
  type = "native";

  group: FormGroup;
  today = new Date();
  tomorrow = new Date();
  min = new Date();
  max = new Date();
  start = new Date();
  filter: (date: Date, type: MatDatetimepickerFilterType) => boolean;

  constructor(fb: FormBuilder) {
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.min.setFullYear(2018, 10, 3);
    this.min.setHours(11);
    this.min.setMinutes(10);
    this.max.setFullYear(2018, 10, 4);
    this.max.setHours(11);
    this.max.setMinutes(45);
    this.start.setFullYear(1930, 9, 28);

    this.filter = (date: Date, type: MatDatetimepickerFilterType) => {
      switch (type) {
        case MatDatetimepickerFilterType.DATE:
          return date.getUTCFullYear() % 2 === 0 &&
            date.getMonth() % 2 === 0 &&
            date.getDate() % 2 === 0;
        case MatDatetimepickerFilterType.HOUR:
          return date.getHours() % 2 === 0;
        case MatDatetimepickerFilterType.MINUTE:
          return date.getMinutes() % 2 === 0;
      }
    };

    this.group = fb.group({
      dateTime: [new Date("2017-11-09T12:10:00.000Z"), Validators.required],
      date: [null, Validators.required],
      time: [null, Validators.required],
      month: [null, Validators.required],
      mintest: [this.today, Validators.required],
      filtertest: [this.today, Validators.required],
      touch: [null, Validators.required]
    });
  }
}
