import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { EditionHeadingComponent } from './edition/edition-heading/edition-heading.component';
import { EditionSheetControlComponent } from './edition/edition-sheet-control/edition-sheet-control.component';
import { EditionSvgPanelComponent } from './edition/edition-svg-panel/edition-svg-panel.component';
import { EditionTkaTableComponent } from './edition/edition-tka-table/edition-tka-table.component';

import { EditionService } from './edition.service';

import { EditionsRoutingModule, routedComponents } from './editions-routing.module';

@NgModule({
    imports: [
        SharedModule,
        EditionsRoutingModule
    ],
    declarations: [
        routedComponents,
        EditionHeadingComponent,
        EditionSheetControlComponent,
        EditionSvgPanelComponent,
        EditionTkaTableComponent
    ],
    exports: [
        routedComponents
    ]
})
export class EditionsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: EditionsModule,
            providers: [ EditionService ]
        }
    }
}
