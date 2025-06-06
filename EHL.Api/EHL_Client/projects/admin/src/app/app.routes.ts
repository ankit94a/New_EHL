import { Routes } from '@angular/router';
import { AuthGuard } from 'projects/shared/src/guards/auth-guard';

export const routes: Routes = [
  {
      path: '',
      loadChildren: () => import('../layout/layout.routes').then(m => m.routes),
  },
  {
      path: 'landing',
      loadComponent: () => import('../layout/landing/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];
