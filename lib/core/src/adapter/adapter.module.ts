import { NgModule } from "@angular/core";
import {
  MatNativeDateModule,
  NativeDateModule
} from "@angular/material";
import { DatetimeAdapter } from "./datetime-adapter";
import { MAT_DATETIME_FORMATS } from "./datetime-formats";
import { NativeDatetimeAdapter } from "./native-datetime-adapter";
import { MAT_NATIVE_DATETIME_FORMATS } from "./native-datetime-formats";

// tslint:disable max-classes-per-file
@NgModule({
  imports: [NativeDateModule],
  providers: [
    {
      provide: DatetimeAdapter,
      useClass: NativeDatetimeAdapter
    }
  ]
})
export class NativeDatetimeModule {
}

@NgModule({
  imports: [
    NativeDatetimeModule,
    MatNativeDateModule
  ],
  providers: [{provide: MAT_DATETIME_FORMATS, useValue: MAT_NATIVE_DATETIME_FORMATS}]
})
export class MatNativeDatetimeModule {
}
