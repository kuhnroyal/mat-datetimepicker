import {Component} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {DatetimeAdapter, NativeDatetimeAdapter, MAT_DATETIME_FORMATS, MAT_NATIVE_DATETIME_FORMATS} from "@mat-datetimepicker/core";
import {DateAdapter, NativeDateAdapter} from "@angular/material";

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
  start = new Date();

  constructor(fb: FormBuilder) {
    this.today.setFullYear(1929);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.min.setFullYear(2018, 10, 3);
    this.min.setHours(11);
    this.min.setMinutes(10);
    this.start.setFullYear(1930, 9, 28);
    console.log(this.tomorrow);

    this.group = fb.group({
      dateTime: ["2017-11-09T12:10:00.000Z", Validators.required],
      date: [null, Validators.required],
      time: [null, Validators.required],
      month: [null, Validators.required],
      mintest: [this.today, Validators.required],
      touch: [null, Validators.required]
    });
  }
}
