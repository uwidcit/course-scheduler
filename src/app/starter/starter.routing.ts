import { Routes } from '@angular/router';
import { ProgrammeComponent } from '../layouts/programme/programme.component';

import { StarterComponent } from './starter.component';

export const StarterRoutes: Routes = [
    {
        path: '',
        redirectTo: '/views/calendar',
        pathMatch: 'full'
    },
    {
        path: 'calendar',
        component: StarterComponent,
        data: {
            title: 'Calendar View',
            urls: [
                { title: 'Dashboard', url: '/dashboard' },
                { title: 'Starter Page' }
            ]
        }
    },
    {
        path: 'programmes',
        component: ProgrammeComponent
    }
];
