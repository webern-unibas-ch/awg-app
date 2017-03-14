import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { EditionRoutingModule, routedEditionComponents } from './edition-routing.module';

@NgModule({
    imports: [ SharedModule, EditionRoutingModule ],
    declarations: [ routedEditionComponents ]
})
export class EditionModule { }
