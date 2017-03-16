import { NgModule, SkipSelf, Optional } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { PageModule } from './page/page.module';

import { CornerRibbonComponent } from './corner-ribbon/corner-ribbon.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

import { MenuService } from './menu.service';
import { MetaService } from './meta.service';


@NgModule({
    imports: [
        RouterModule, SharedModule,
        PageModule
    ],
    declarations: [
        CornerRibbonComponent,
        FooterComponent,
        HeaderComponent
    ],
    exports: [
        CornerRibbonComponent,
        FooterComponent,
        HeaderComponent,
        PageModule
    ],
    providers: [ MenuService, MetaService ]
})

export class CoreModule {
    constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
