import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SideInfoRoutingModule, routedComponents } from './side-info-routing.module';

@NgModule({
    imports: [
        SharedModule,
        SideInfoRoutingModule
    ],
    declarations: [
        routedComponents
    ]
})
export class SideInfoModule {}
