import { NgModule } from '@angular/core';
import { SharedModule}  from '../../../../shared/shared.module';

import { SourceDescriptionComponent } from './sources/source-description/source-description.component';
import { SourceEvaluationComponent } from './sources/source-evaluation/source-evaluation.component';
import { SourceListComponent } from './sources/source-list/source-list.component';
import { TextcriticsComponent } from './textcritics/textcritics.component';

import { ReportRoutingModule, routedReportComponents } from './report-routing.module';

@NgModule({
    imports: [
        SharedModule,
        ReportRoutingModule
    ],
    declarations: [
        routedReportComponents,
        SourceDescriptionComponent,
        SourceEvaluationComponent,
        SourceListComponent,
        TextcriticsComponent
    ]
})
export class ReportModule { }

/**
 *
 * NOT USED AT THE MOMENT AS LONG
 *
 *         LAZY ROUTING
 *
 * IS NOT WORKING WITH ANGULAR-CLI
 *
 */
