import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaEvaluationsComponent } from '../edition-tka/edition-tka-evaluations/edition-tka-evaluations.component';
import { EditionTkaLabelComponent } from '../edition-tka/edition-tka-label/edition-tka-label.component';
import { EditionTkaTableComponent } from '../edition-tka/edition-tka-table/edition-tka-table.component';

import { EditionDisclaimerWorkeditionsComponent } from '@awg-views/edition-view/edition-disclaimer-workeditions/edition-disclaimer-workeditions.component';
import { EditionReportComponent } from './edition-report.component';
import { SourceDescriptionModule } from './source-description/source-description.module';
import { SourceEvaluationPlaceholderComponent } from './source-evaluation/source-evaluation-placeholder/source-evaluation-placeholder.component';
import { SourceEvaluationComponent } from './source-evaluation/source-evaluation.component';
import { SourceListComponent } from './source-list/source-list.component';
import { SourceSiglumComponent } from './source-siglum/source-siglum.component';
import { TextcriticsListComponent } from './textcritics-list/textcritics-list.component';

import { EditionReportRoutingModule } from './edition-report-routing.module';

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
        EditionDisclaimerWorkeditionsComponent,
        EditionTkaEvaluationsComponent,
        EditionTkaLabelComponent,
        EditionTkaTableComponent,
        SourceEvaluationComponent,
        SourceEvaluationPlaceholderComponent,
        SourceListComponent,
        SourceSiglumComponent,
        TextcriticsListComponent,
    ],
    declarations: [EditionReportComponent],
})
export class EditionReportModule {}
