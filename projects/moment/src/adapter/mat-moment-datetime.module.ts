import { NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';

import { MomentDatetimeModule } from './moment-datetime.module';
import { MAT_MOMENT_DATETIME_FORMATS } from './moment-datetime-formats';

@NgModule({
  imports: [MomentDatetimeModule, MatMomentDateModule],
  providers: [{ provide: MAT_DATETIME_FORMATS, useValue: MAT_MOMENT_DATETIME_FORMATS }],
})
export class MatMomentDatetimeModule {}
