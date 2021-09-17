import { NgModule } from '@angular/core';
import { MomentDateModule } from '@angular/material-moment-adapter';

import { DatetimeAdapter } from '@mat-datetimepicker/core';

import { MomentDatetimeAdapter } from './moment-datetime-adapter';

@NgModule({
  imports: [MomentDateModule],
  providers: [
    {
      provide: DatetimeAdapter,
      useClass: MomentDatetimeAdapter,
    },
  ],
})
export class MomentDatetimeModule {}
