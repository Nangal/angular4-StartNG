import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AdminComponent } from './admin.component';

export const routes: Routes = [
	{
		path: '', 
		component: AdminComponent,
		children:[
			{
				path: 'dashboard',
				loadChildren: './dashboard/dashboard.module#DashboardModule',
				data: { breadcrumb: 'Dashboard' }
			},
			{
				path: '',
				redirectTo: 'dashboard',
				pathMatch: 'full'
			},
	   ]
	}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);