import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { MomentDatetimeComponent } from './moment/moment.component';
import { NativeDatetimeComponent } from './native/native.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    FooterComponent,
    NativeDatetimeComponent,
    MomentDatetimeComponent,
  ],
})
export class AppComponent {}
