import { NgModule, SkipSelf, Optional } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

import { MetaService } from './services';

@NgModule({
    imports:        [ RouterModule, SharedModule ],
    declarations:   [ FooterComponent, NavbarComponent ],
    exports:        [ FooterComponent, NavbarComponent ],
    providers:      [ MetaService ]
})
export class CoreModule {
    constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
