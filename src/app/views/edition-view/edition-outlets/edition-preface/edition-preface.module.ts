import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { EditionPrefaceRoutingModule, routedEditionPrefaceComponents } from './edition-preface-routing.module';

/**
 * The EditionPreface module.
 *
 * It embeds the {@link EditionPrefaceComponent} and its
 * [routing definition]{@link EditionPrefaceRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionPrefaceRoutingModule],
    declarations: [routedEditionPrefaceComponents],
})
export class EditionPrefaceModule {}
