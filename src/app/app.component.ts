import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";

  group: FormGroup;
  today = new Date();
  tomorrow = new Date();
  min = new Date();
  start = new Date();
  // today = moment().year(1929);
  // tomorrow = moment().date(28);
  // min = this.today.clone().year(2018).month(10).date(3).hour(3).minute(0);
  // start = this.today.clone().year(1930).month(9).date(28);

  constructor(fb: FormBuilder) {
    this.today.setFullYear(1929);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.min.setFullYear(2018, 10, 3);
    this.min.setHours(3);
    this.min.setMinutes(3);
    this.start.setFullYear(1930, 9, 28);

    this.group = fb.group({
      start: [null, Validators.required],
      end: ["2017-11-09T12:10:00.000Z"],
      mintest: [this.today, Validators.required]
    });
  }
}
