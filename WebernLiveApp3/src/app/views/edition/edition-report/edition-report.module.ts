import { NgModule } from '@angular/core';
import { RouterModule }  from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

import { EditionReportSourcesComponent,
        EditionReportSourceDescriptionComponent,
        EditionReportSourceEvaluationComponent,
        EditionReportSourceListComponent } from './edition-report-sources';
import { EditionReportTextcriticsComponent } from './edition-report-textcritics';

@NgModule({
    imports: [
        RouterModule,
        SharedModule
    ],
    declarations: [
        EditionReportSourcesComponent,
        EditionReportSourceDescriptionComponent,
        EditionReportSourceEvaluationComponent,
        EditionReportSourceListComponent,
        EditionReportTextcriticsComponent
    ],
    exports: [
        EditionReportSourcesComponent,
        EditionReportSourceDescriptionComponent,
        EditionReportSourceEvaluationComponent,
        EditionReportSourceListComponent,
        EditionReportTextcriticsComponent
    ]
})
export class EditionReportModule { }
