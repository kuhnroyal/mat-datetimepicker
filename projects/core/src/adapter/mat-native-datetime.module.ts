import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATETIME_FORMATS } from './datetime-formats';
import { MAT_NATIVE_DATETIME_FORMATS } from './native-datetime-formats';
import { NativeDatetimeModule } from './native-datetime.module';

@NgModule({
  imports: [NativeDatetimeModule, MatNativeDateModule],
  providers: [{ provide: MAT_DATETIME_FORMATS, useValue: MAT_NATIVE_DATETIME_FORMATS }],
})
export class MatNativeDatetimeModule {}
