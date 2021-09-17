import { NgModule } from '@angular/core';
import { NativeDateModule } from '@angular/material/core';
import { DatetimeAdapter } from './datetime-adapter';
import { NativeDatetimeAdapter } from './native-datetime-adapter';

@NgModule({
  imports: [NativeDateModule],
  providers: [
    {
      provide: DatetimeAdapter,
      useClass: NativeDatetimeAdapter,
    },
  ],
})
export class NativeDatetimeModule {}
