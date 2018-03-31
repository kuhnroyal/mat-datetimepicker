import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { Moment } from "moment";
import * as moment from "moment";
import {MomentDatetimeAdapter, MAT_MOMENT_DATETIME_FORMATS} from "@mat-datetimepicker/moment";
import {DatetimeAdapter, MAT_DATETIME_FORMATS} from "@mat-datetimepicker/core";
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
  start: Moment;


  constructor(fb: FormBuilder) {
    this.today = moment().year(1929);
    this.tomorrow = moment().date(moment().date() + 1);
    this.min = this.today.clone().year(2018).month(10).date(3).hour(11).minute(10);
    this.start = this.today.clone().year(1930).month(9).date(28);

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
