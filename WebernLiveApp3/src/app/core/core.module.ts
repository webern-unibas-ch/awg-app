import { NgModule, SkipSelf, Optional } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CornerRibbonComponent } from './corner-ribbon/corner-ribbon.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { PageComponent } from './page/page.component';

import { MainTextComponent } from './page/main-text/main-text.component';
import { MenuComponent } from './page/menu/menu.component';
import { SubMenuComponent } from './page/sub-menu/sub-menu.component';
import { SearchComponent } from './page/search/search.component';
import { RightTextComponent } from './page/right-text/right-text.component';

import { MenuService } from './menu.service';
import { MetaService } from './meta.service';


@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [
        CornerRibbonComponent,
        FooterComponent,
        HeaderComponent,
        PageComponent,

        MainTextComponent,
        MenuComponent,
        SubMenuComponent,
        SearchComponent,
        RightTextComponent
    ],
    exports: [
        CornerRibbonComponent,
        FooterComponent,
        HeaderComponent,
        PageComponent,

        MainTextComponent,
        MenuComponent,
        SubMenuComponent ],
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
