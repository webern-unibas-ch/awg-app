import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SideInfoRoutingModule, routedComponents } from './side-info-routing.module';
import { SearchInfoComponent } from './search-info/search-info.component';

@NgModule({
    imports: [
        SharedModule,
        SideInfoRoutingModule
    ],
    declarations: [
        routedComponents,
        SearchInfoComponent
    ]
})
export class SideInfoModule { }
