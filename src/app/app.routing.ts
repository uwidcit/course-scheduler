import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import {canActivate, redirectUnauthorizedTo, redirectLoggedInTo} from '@angular/fire/auth-guard';
import { LoginComponent } from './layouts/login/login.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['home']);

export const AppRoutes: Routes = [
    {
        path: '',
        component: FullComponent,
        children: [
            {
                path: '',
                redirectTo: '/views/calendar',
                pathMatch: 'full'
            },
            {
                path: 'views',
                loadChildren: () => import('./starter/starter.module').then(m => m.StarterModule),
                //...canActivate(redirectToLogin)
            }
            
        ]
    },{
        path: 'login',
        component: LoginComponent,
        //...canActivate(redirectToHome)
       },
];
