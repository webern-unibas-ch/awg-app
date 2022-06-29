import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { EditionIntroRoutingModule, routedEditionIntroComponents } from './edition-intro-routing.module';

/**
 * The editionIntro module.
 *
 * It embeds the edition intro components and their
 * [routing definition]{@link EditionIntroRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionIntroRoutingModule],
    declarations: [routedEditionIntroComponents],
})
export class EditionIntroModule {}
