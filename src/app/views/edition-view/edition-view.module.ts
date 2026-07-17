import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { EditionInfoComponent } from './edition-info/edition-info.component';
import { EditionJumbotronComponent } from './edition-jumbotron';
import { EditionViewRoutingModule, routedEditionViewComponents } from './edition-view-routing.module';

/**
 * The editionView module.
 *
 * It embeds the edition components and their
 * [routing definition]{@link EditionViewRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionViewRoutingModule, EditionInfoComponent],
    declarations: [routedEditionViewComponents, EditionJumbotronComponent],
})
export class EditionViewModule {}
