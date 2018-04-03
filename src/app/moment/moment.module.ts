import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule
} from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDatetimepickerModule } from "@mat-datetimepicker/core";
import { MomentDatetimeComponent } from "./moment.component";

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
