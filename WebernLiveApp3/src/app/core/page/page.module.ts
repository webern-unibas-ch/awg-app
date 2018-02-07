import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { PageComponent } from './page.component';
import { PageMainTextComponent } from './page-main-text';
import { PageMenuComponent } from './page-menu';
import { PageSubMenuComponent } from './page-sub-menu';
import { PageSearchComponent } from './page-search';
import { PageRightTextComponent } from './page-right-text';

@NgModule({
    imports: [ RouterModule, SharedModule ],
    declarations: [
        PageComponent,
        PageMainTextComponent,
        PageMenuComponent,
        PageSubMenuComponent,
        PageSearchComponent,
        PageRightTextComponent
    ],
    exports: [
        PageComponent,
        PageMainTextComponent,
        PageMenuComponent,
        PageSubMenuComponent,
        PageSearchComponent,
        PageRightTextComponent
    ]
})
export class PageModule { }
