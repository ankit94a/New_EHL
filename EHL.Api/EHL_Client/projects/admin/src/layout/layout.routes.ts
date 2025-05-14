import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from 'projects/shared/src/guards/auth-guard';
import { SmteSteDistrComponent } from './smte-ste-distr/smte-ste-distr.component';

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
            {
              path: 'dashboard',
              loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'landing-page-update',
              loadComponent: () => import('./landing/landing-page-update/landing-page-update.component').then(m => m.LandingPageUpdateComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'emer',
              loadComponent: () => import('./emer/emer-list/emer-list.component').then(m => m.EmerListComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'Oil',
              loadComponent: () => import('./oil/oil.component').then(m => m.OilComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'mrls-distr',
              loadComponent: () => import('./mrls-dist-list/mrls-dist.component').then(m =>m.MrlsDistComponent),
              // canActivate: [AuthGuard]
            },
            {
              path: 'nge',
              loadComponent:() => import('./policy/nge/nge.component').then(m =>m.NgeComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'attribute',
              loadComponent: () => import('./attribute/attribute.component').then(m => m.AttributeComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'tech-manual',
              loadComponent: () => import('./policy/tech-manuals/tech-manuals/tech-manuals.component').then(m => m.TechManualsComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'policy',
              loadComponent: () => import('./policy/policies/policies-list/policies.component').then(m => m.PoliciesComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'ispl',
              loadComponent: () => import('./policy/ispl/ispl.component').then(m => m.IsplComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'master-sheet',
              loadComponent: () => import('./master-sheet/master-sheet.component').then(m => m.MasterSheetComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'wing',
              loadComponent: () => import('./wing-list/wing-list.component').then(m => m.WingListComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'ep-contract',
              loadComponent: () => import('./ep-contract/ep-contract-list/ep-contract-list.component').then(m => m.EpContractListComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'confidential',
              loadComponent: () => import('./emer/emer-confidential/emer-confidential.component').then(m => m.EmerConfidentialComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'technical-ao/ai',
              loadComponent: () => import('./techincal-ao-ai/techincal-ao-ai.component').then(m => m.TechincalAoAiComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'defect-report',
              loadComponent: () => import('./defect-report/defect-report.component').then(m => m.DefectReportComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'misc',
              loadComponent: () => import('./misc/misc.component').then(m => m.MiscComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'emer-index',
              loadComponent: () => import('./emer/emer-index/emer-index.component').then(m => m.EmerIndexComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'eqpt-mgrs',
              loadComponent: () => import('./eqpt-mgrs/eqpt-mgrs.component').then(m => m.EqptMgrsComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'eqpt-appreciation',
              loadComponent: () => import('./eqpt-appreciation/eqpt-appreciation.component').then(m => m.EqptAppreciationComponent),
              // canActivate: [AuthGuard],
            },
            {
              path: 'smte/ste-distr',
              loadComponent: () => import('./smte-ste-distr/smte-ste-distr.component').then(m => m.SmteSteDistrComponent),
              // canActivate: [AuthGuard],
            }
      ]
  }
]
