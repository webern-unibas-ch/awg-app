import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactInfoComponent } from './contact-info/contact-info.component';
import { EditionInfoComponent } from './edition-info/edition-info.component';
import { StructureInfoComponent } from './structure-info/structure-info.component';


const sideInfoRoutes: Routes = [
    { path: 'editionInfo', component: EditionInfoComponent, outlet: 'side' },
    { path: 'structureInfo', component: StructureInfoComponent, outlet: 'side' },
    { path: 'contactInfo', component: ContactInfoComponent, outlet: 'side' },
];

@NgModule({
    imports: [ RouterModule.forChild(sideInfoRoutes) ],
    exports: [ RouterModule ]
})
export class SideInfoRoutingModule { }

export const routedComponents = [
    ContactInfoComponent,
    EditionInfoComponent,
    StructureInfoComponent
];

