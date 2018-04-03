import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Moment, utc} from "moment/moment";
import {MAT_MOMENT_DATETIME_FORMATS, MomentDatetimeAdapter} from "@mat-datetimepicker/moment";
import {DatetimeAdapter, MatDatetimepickerFilterType, MAT_DATETIME_FORMATS} from "@mat-datetimepicker/core";
import {DateAdapter} from "@angular/material";
import {MomentDateAdapter} from "@angular/material-moment-adapter";

@Component({
  selector: "app-moment-datetime",
  templateUrl: "../date.component.html",
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter
    },
    {
      provide: DatetimeAdapter,
      useClass: MomentDatetimeAdapter
    },
    {
      provide: MAT_DATETIME_FORMATS,
      useValue: MAT_MOMENT_DATETIME_FORMATS
    }
  ]
})
export class MomentDatetimeComponent {
  type = "moment";

  group: FormGroup;
  today: Moment;
  tomorrow: Moment;
  min: Moment;
  max: Moment;
  start: Moment;
  filter: (date: Moment, type: MatDatetimepickerFilterType) => boolean;

  constructor(fb: FormBuilder) {
    this.today = utc().year(1929);
    this.tomorrow = utc().date(utc().date() + 1);
    this.min = this.today.clone().year(2018).month(10).date(3).hour(11).minute(10);
    this.max = this.min.clone().date(4).minute(45);
    this.start = this.today.clone().year(1930).month(9).date(28);
    this.filter = (date: Moment, type: MatDatetimepickerFilterType) => {
      switch (type) {
        case MatDatetimepickerFilterType.DATE:
          return date.year() % 2 === 0 &&
            date.month() % 2 === 0 &&
            date.date() % 2 === 0;
        case MatDatetimepickerFilterType.HOUR:
          return date.hour() % 2 === 0;
        case MatDatetimepickerFilterType.MINUTE:
          return date.minute() % 2 === 0;
      }
    };

    this.group = fb.group({
      dateTime: ["2017-11-09T12:10:00.000Z", Validators.required],
      date: [null, Validators.required],
      time: [null, Validators.required],
      month: [null, Validators.required],
      mintest: [this.today, Validators.required],
      filtertest: [this.today, Validators.required],
      touch: [null, Validators.required]
    });
  }
}
