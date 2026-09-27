import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaEvaluationsComponent } from '../edition-tka/edition-tka-evaluations/edition-tka-evaluations.component';
import { EditionTkaLabelComponent } from '../edition-tka/edition-tka-label/edition-tka-label.component';
import { EditionTkaTableComponent } from '../edition-tka/edition-tka-table/edition-tka-table.component';
import { SourceDescriptionModule } from './source-description/source-description.module';

import { SourceEvaluationComponent } from './source-evaluation';
import { SourceListComponent } from './source-list';
import { TextcriticsListComponent } from './textcritics-list';

import { EditionReportRoutingModule, routedEditionReportComponents } from './edition-report-routing.module';

/**
 * The EditionReport module.
 *
 * It embeds the edition report components and their
 * [routing definition]{@link EditionReportRoutingModule}
 * as well as the {@link SharedModule}
 * and the {@link TextcriticsListComponent}, {@link SourceListComponent},
 * {@link SourceDescriptionComponent}, and {@link SourceEvaluationComponent}.
 */
@NgModule({
    imports: [
        SharedModule,
        SourceDescriptionModule,
        EditionReportRoutingModule,
        EditionTkaEvaluationsComponent,
        EditionTkaLabelComponent,
        EditionTkaTableComponent,
    ],
    declarations: [
        TextcriticsListComponent,
        SourceEvaluationComponent,
        SourceListComponent,
        routedEditionReportComponents,
    ],
})
export class EditionReportModule {}
