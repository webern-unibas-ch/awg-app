import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { EditionHeadingComponent } from './edition-heading/edition-heading.component';
import { EditionSheetControlComponent } from './edition-outlets/edition/edition-sheet-control/edition-sheet-control.component';
import { EditionSvgPanelComponent } from './edition-outlets/edition/edition-svg-panel/edition-svg-panel.component';
import { EditionTkaTableComponent } from './edition-outlets/edition/edition-tka-table/edition-tka-table.component';
import { EditionViewComponent } from './edition-view.component';

import { EditionService } from './edition.service';

import { EditionsRoutingModule, routedComponents } from './editions-routing.module';
import { ReportModule } from './edition-outlets/report/report.module';


@NgModule({
    imports: [
        SharedModule,
        EditionsRoutingModule,
        ReportModule
    ],
    declarations: [
        routedComponents,
        EditionHeadingComponent,
        EditionSheetControlComponent,
        EditionSvgPanelComponent,
        EditionTkaTableComponent
    ],
    exports: [
        EditionViewComponent
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
