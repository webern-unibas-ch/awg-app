import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { EditionIntroContentComponent } from './edition-intro-content';
import { EditionIntroNavComponent } from './edition-intro-nav';
import { EditionIntroPlaceholderComponent } from './edition-intro-placeholder';

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
        EditionIntroNavComponent,
        EditionIntroPlaceholderComponent,
        routedEditionIntroComponents,
    ],
})
export class EditionIntroModule {}
