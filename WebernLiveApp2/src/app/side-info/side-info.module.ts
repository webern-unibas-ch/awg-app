import { ModuleWithProviders, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SideInfoRoutingModule, routedComponents } from './side-info-routing.module';
import { SearchInfoComponent } from './search-info/search-info.component';

import { SideInfoService } from './services/side-info.service';

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
export class SideInfoModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SideInfoModule,
            providers: [ SideInfoService ]
        };
    }
}
