import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

export const routes: Routes = [

  {
      path:'',
      component:LayoutComponent,
      children:[
            {
              path: '',
              redirectTo: 'dashboard',
              pathMatch:'full'

            },
            // {
            //   path: 'dashboard',
            //   loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
            //   canActivate: [AuthGuard],
            // },
      ]
  }
]
