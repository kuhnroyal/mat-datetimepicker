import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";

  group: FormGroup;

  constructor(fb: FormBuilder) {
    this.group = fb.group({
      start: ["2017-11-09T12:10:00.000Z", Validators.required],
      end: [null]
    });
  }
}
