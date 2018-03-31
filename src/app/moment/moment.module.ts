import {
  NgModule
} from "@angular/core";
import {
  MatDatetimepickerModule
} from "@mat-datetimepicker/core";
import {
  MatMomentDatetimeModule,
  MAT_MOMENT_DATETIME_FORMATS
} from "@mat-datetimepicker/moment";
import { MomentDatetimeComponent } from "./moment.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule, MatFormFieldModule, MatInputModule} from "@angular/material";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    MomentDatetimeComponent
  ],
  exports: [
    MomentDatetimeComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatetimepickerModule
  ]
})
export class AppMomentModule {
}
