import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

//
// edition-detail
import { EditionSheetControlComponent } from './edition-outlets/edition-detail/edition-sheet-control/edition-sheet-control.component';
import { EditionSvgPanelComponent } from './edition-outlets/edition-detail/edition-svg-panel/edition-svg-panel.component';
import { EditionTkaTableComponent } from './edition-outlets/edition-detail/edition-tka-table/edition-tka-table.component';

//
// report
import { SourcesComponent } from './edition-outlets/report/sources/sources.component';
import { SourceDescriptionComponent } from './edition-outlets/report/sources/source-description/source-description.component';
import { SourceEvaluationComponent } from './edition-outlets/report/sources/source-evaluation/source-evaluation.component';
import { SourceListComponent } from './edition-outlets/report/sources/source-list/source-list.component';
import { TextcriticsComponent } from './edition-outlets/report/textcritics/textcritics.component';

//
// edition service & routes
import { DataService, EditionService } from './services';
import { EditionRoutingModule, routedComponents } from './edition-routing.module';


@NgModule({
    imports: [
        SharedModule,
        EditionRoutingModule,
    ],
    declarations: [
        routedComponents,
        EditionSheetControlComponent,
        EditionSvgPanelComponent,
        EditionTkaTableComponent,

        SourcesComponent,
        SourceDescriptionComponent,
        SourceEvaluationComponent,
        SourceListComponent,
        TextcriticsComponent
    ]
})
export class EditionModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: EditionModule,
            providers: [ DataService, EditionService ]
        };
    }
}
