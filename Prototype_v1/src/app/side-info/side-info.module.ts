import { ModuleWithProviders, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SideInfoRoutingModule, routedComponents } from './side-info-routing.module';

import { SideInfoService } from './side-info-services/side-info.service';

@NgModule({
    imports: [
        SharedModule,
        SideInfoRoutingModule
    ],
    declarations: [
        routedComponents
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
