import { NgModule, SkipSelf, Optional } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

//
// services
import {
    ApiService,
    ConversionService,
    DataStreamerService,
    MetaService,
    SideInfoService
} from './services';

@NgModule({
    imports:        [ SharedModule ],
    declarations:   [ FooterComponent, NavbarComponent ],
    exports:        [ FooterComponent, NavbarComponent ],
    providers:      [
        ApiService,
        ConversionService,
        DataStreamerService,
        MetaService,
        SideInfoService
    ]
})
export class CoreModule {
    constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
