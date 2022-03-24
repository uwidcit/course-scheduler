import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import {canActivate, redirectUnauthorizedTo, redirectLoggedInTo} from '@angular/fire/auth-guard';
import { LoginComponent } from './layouts/login/login.component';


const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['views/calendar']);

export const AppRoutes: Routes = [
    {
        path: '',
        component: FullComponent,
        children: [
            
            {
                path: 'views',
                loadChildren: () => import('./starter/starter.module').then(m => m.StarterModule),
                ...canActivate(redirectToLogin)
                
            }
            
        ]
    },{
        path: 'login',
        component: LoginComponent,
        ...canActivate(redirectToHome)
       },
       {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full'
    },
];
