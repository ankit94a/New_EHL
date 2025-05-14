import { Routes } from '@angular/router';
import { AuthGuard } from 'projects/shared/src/guards/auth-guard';

export const routes: Routes = [
  {
      path: '',
      loadChildren: () => import('../layout/layout.routes').then(m => m.routes),
      // canActivate: [AuthGuard],
  },
  {
      path: 'landing',
      loadComponent: () => import('../layout/landing/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
//   {
//     path: 'wing',
//     loadComponent: () => import('../layout/wing-list/wing-list.component').then(m => m.WingListComponent),
// },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];
