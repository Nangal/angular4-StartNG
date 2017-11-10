import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { DashboardComponent } from './dashboard.component';

import { DashboardService } from './dashboard.service';

export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    PerfectScrollbarModule,
    NgxChartsModule,
    DirectivesModule,
    Ng2SmartTableModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
    { provide: 'dashboardService', useClass: DashboardService }
  ]
})

export class DashboardModule { }