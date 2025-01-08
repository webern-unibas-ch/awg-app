import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionSectionDetailComplexCardComponent } from './edition-section-detail-complex-card';
import { EditionSectionDetailDisclaimerComponent } from './edition-section-detail-disclaimer';
import { EditionSectionDetailIntroCardComponent } from './edition-section-detail-intro-card';
import { EditionSectionDetailPlaceholderComponent } from './edition-section-detail-placeholder';

import {
    EditionSectionDetailRoutingModule,
    routedEditionSectionDetailComponents,
} from './edition-section-detail-routing.module';

/**
 * The edition section detail module.
 *
 * It embeds the edition section detail components.
 */
@NgModule({
    imports: [SharedModule, EditionSectionDetailRoutingModule],
    declarations: [
        EditionSectionDetailComplexCardComponent,
        EditionSectionDetailDisclaimerComponent,
        EditionSectionDetailIntroCardComponent,
        EditionSectionDetailPlaceholderComponent,
        routedEditionSectionDetailComponents,
    ],
})
export class EditionSectionDetailModule {}
