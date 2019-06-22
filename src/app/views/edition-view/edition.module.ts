import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionDetailModule } from './edition-outlets/edition-detail/edition-detail.module';
import { ReportModule } from './edition-outlets/report/report.module';

/* Routing Module */
import { EditionRoutingModule, routedEditionComponents } from './edition-routing.module';

/**
 * The edition module.
 *
 * It embeds the edition components and their
 * [routing definition]{@link EditionRoutingModule}
 * as well as the {@link EditionDetailModule},
 * {@link ReportModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionDetailModule, ReportModule, EditionRoutingModule],
    declarations: [routedEditionComponents]
})
export class EditionModule {}
