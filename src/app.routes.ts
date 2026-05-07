import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { MyAdventures } from './app/pages/my-adventures/my-adventures';
import { AdventureDetail } from './app/pages/my-adventures/adventure-detail';
import { Notfound } from './app/pages/notfound/notfound';
import { Settings } from './app/pages/settings/settings';

export const appRoutes: Routes = [
    { path: '', component: Landing },
    {
        path: 'dashboard',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'my-adventures', component: MyAdventures },
            { path: 'my-adventures/:id', component: AdventureDetail },
            { path: 'settings', component: Settings },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
