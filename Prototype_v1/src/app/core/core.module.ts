import { NgModule, SkipSelf, Optional } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { FooterComponent } from './footer/footer.component';
import { FooterLogoComponent } from './footer/footer-logo/footer-logo.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
    imports:        [ SharedModule ],
    declarations:   [ FooterComponent, FooterLogoComponent, NavbarComponent ],
    exports:        [ FooterComponent, FooterLogoComponent, NavbarComponent ]
})
export class CoreModule {
    constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
