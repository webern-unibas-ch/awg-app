import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { EditionIntroContentComponent } from './edition-intro-content';
import { EditionIntroEmptyComponent } from './edition-intro-empty';
import { EditionIntroNavComponent } from './edition-intro-nav';

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
    declarations: [
        EditionIntroContentComponent,
        EditionIntroEmptyComponent,
        EditionIntroNavComponent,
        routedEditionIntroComponents,
    ],
})
export class EditionIntroModule {}
