import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

//
// edition-detail
import { EditionHeadingComponent } from './edition-heading/edition-heading.component';
import { EditionSheetControlComponent } from './edition-outlets/edition-detail/edition-sheet-control/edition-sheet-control.component';
import { EditionSvgPanelComponent } from './edition-outlets/edition-detail/edition-svg-panel/edition-svg-panel.component';
import { EditionTkaTableComponent } from './edition-outlets/edition-detail/edition-tka-table/edition-tka-table.component';

//
// report
import { SourceDescriptionComponent } from './edition-outlets/report/source-description/source-description.component';
import { SourceEvaluationComponent } from './edition-outlets/report/source-evaluation/source-evaluation.component';
import { SourceListComponent } from './edition-outlets/report/source-list/source-list.component';
import { TkaComponent } from './edition-outlets/report/tka/tka.component';

//
// edition service & routes
import { EditionService } from './edition.service';
import { EditionsRoutingModule, routedComponents } from './editions-routing.module';


@NgModule({
    imports: [
        SharedModule,
        EditionsRoutingModule,
    ],
    declarations: [
        routedComponents,
        EditionHeadingComponent,
        EditionSheetControlComponent,
        EditionSvgPanelComponent,
        EditionTkaTableComponent,

        SourceDescriptionComponent,
        SourceEvaluationComponent,
        SourceListComponent,
        TkaComponent
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
