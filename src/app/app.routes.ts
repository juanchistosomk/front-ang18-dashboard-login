import { Routes, CanActivateFn } from '@angular/router';
import { DashboardComponent } from './business/dashboard/dashboard.component';
import { ProfileComponent } from './business/profile/profile.component';
import { CompaniesComponent } from './business/companies/companies.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),  // se debe agrega 'default' en la clase de layout
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./business/dashboard/dashboard.component').then(m => DashboardComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'profile',
                loadComponent: () => import('./business/profile/profile.component').then(m => ProfileComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'company',
                loadComponent: () => import('./business/companies/companies.component').then(m => CompaniesComponent),
                canActivate: [AuthGuard]
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./business/auth/login/login.component'),
        canActivate: [AuthenticatedGuard]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }

  
];
