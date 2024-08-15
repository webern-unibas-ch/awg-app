import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaModule } from '../edition-tka/edition-tka.module';
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
 * as well as the {@link SharedModule}, {@link EditionTkaModule}
 * and the {@link TextcriticsListComponent}, {@link SourceListComponent},
 * {@link SourceDescriptionComponent}, and {@link SourceEvaluationComponent}.
 */
@NgModule({
    imports: [SharedModule, EditionTkaModule, SourceDescriptionModule, EditionReportRoutingModule],
    declarations: [
        TextcriticsListComponent,
        SourceEvaluationComponent,
        SourceListComponent,
        routedEditionReportComponents,
    ],
})
export class EditionReportModule {}
