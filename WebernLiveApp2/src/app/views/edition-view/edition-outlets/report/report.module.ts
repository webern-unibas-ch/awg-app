import { NgModule } from '@angular/core';
import { SharedModule}  from '../../../../shared/shared.module';

import { SourceDescriptionComponent } from './source-description/source-description.component';
import { SourceEvaluationComponent } from './source-evaluation/source-evaluation.component';
import { SourceListComponent } from './source-list/source-list.component';
import { TkaComponent } from './tka/tka.component';

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
        TkaComponent
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
