import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { EventRoutes, EventComponents } from './event.routing';
import { EventService } from './event.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PerfectScrollbarModule,
    NgxChartsModule,
    DirectivesModule,
    Ng2SmartTableModule,
    EventRoutes    
  ],
  declarations: [
    EventComponents
  ],
  providers: [
    { provide: 'eventService', useClass: EventService }
  ]
})

export class EventModule { }