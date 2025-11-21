import {
  enableProdMode,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    {
      provide: LOCALE_ID,
      useValue: 'de-DE',
    },
    {
      provide: MAT_DATE_LOCALE,
      useExisting: LOCALE_ID,
    },
  ],
}).catch((e) => console.error(e));
