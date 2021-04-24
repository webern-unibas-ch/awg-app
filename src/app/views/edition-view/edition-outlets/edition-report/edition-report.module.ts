import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { SourcesModule } from './sources/sources.module';
import { TextcriticsModule } from './textcritics/textcritics.module';
import { EditionReportRoutingModule, routedEditionReportComponents } from './edition-report-routing.module';

/**
 * The EditionReport module.
 *
 * It embeds the edition report components and their
 * [routing definition]{@link EditionReportRoutingModule}
 * as well as the {@link SharedModule}, {@link SourcesModule}
 * and {@link TextcriticsModule}.
 */
@NgModule({
    imports: [SharedModule, SourcesModule, TextcriticsModule, EditionReportRoutingModule],
    declarations: [routedEditionReportComponents],
})
export class EditionReportModule {}
