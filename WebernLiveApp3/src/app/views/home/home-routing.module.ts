import { NgModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { HomeComponent } from './home.component';
import { HomeOverviewComponent } from './home-overview';
import { HomeStructureComponent } from './home-structure';


const homeRoutes: Routes = [
    { path: 'home', component: HomeComponent,
        children: [
            {
                path: '',
                children: [
                    { path: 'overview', component: HomeOverviewComponent },
                    { path: 'structure', component: HomeStructureComponent },
                    { path: '', redirectTo: 'overview', pathMatch: 'full'}
                ]
            }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(homeRoutes) ],
    exports: [ RouterModule ]
})
export class HomeRoutingModule { }

export const routedHomeComponents = [
    HomeComponent,
    HomeOverviewComponent,
    HomeStructureComponent
];
