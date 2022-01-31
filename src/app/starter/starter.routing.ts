import { Routes } from '@angular/router';

import { StarterComponent } from './starter.component';

export const StarterRoutes: Routes = [
    {
        path: '',
        component: StarterComponent,
        data: {
            title: 'Calendar View',
            urls: [
                { title: 'Dashboard', url: '/dashboard' },
                { title: 'Starter Page' }
            ]
        }
    }
];
