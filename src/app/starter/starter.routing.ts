import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { ProgrammeComponent } from '../layouts/programme/programme.component';

import { StarterComponent } from './starter.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
export const StarterRoutes: Routes = [
    {
        path: '',
        redirectTo: '/views/calendar',
        pathMatch: 'full'
        
    },
    {
        path: 'calendar',
        component: StarterComponent,
        ...canActivate(redirectToLogin),
        
    },
    {
        path: 'programmes',
        component: ProgrammeComponent,
        ...canActivate(redirectToLogin)
    },
    {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full'
    },
];
