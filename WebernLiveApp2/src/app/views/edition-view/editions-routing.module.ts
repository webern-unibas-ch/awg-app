import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionViewComponent } from './edition-view.component';
import { IntroViewComponent } from "../intro-view/intro-view.component";

const editionsRoutes: Routes = [
    { path: 'edition',  component: EditionViewComponent },
    { path: 'edition/intro', component: IntroViewComponent },
    { path: 'edition/:id', component: EditionViewComponent },
    { path: 'editions', redirectTo: 'edition', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forChild(editionsRoutes)
    ],
    exports: [
        RouterModule
    ]

})
export class EditionsRoutingModule { }

export const routedComponents = [ EditionViewComponent, IntroViewComponent ];
