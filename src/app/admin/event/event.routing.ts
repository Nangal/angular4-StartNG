import { Routes, RouterModule } from '@angular/router';

import { EventListComponent } from './list/list.component';
import { EventCreateComponent } from './create/create.component';

export const EventComponents = [
  EventListComponent,
  EventCreateComponent,
]

export const routes: Routes = [
  {
    path: 'list',
    component: EventListComponent,
    pathMatch: 'full',
    data: { breadcrumb: 'List' }
  },
  {
    path: 'create',
    component: EventCreateComponent,
    pathMatch: 'create',
    data: { breadcrumb: 'Create' }
  }
];

export const EventRoutes = RouterModule.forChild(routes);