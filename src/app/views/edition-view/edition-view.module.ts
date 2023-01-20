import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { EditionViewRoutingModule, routedEditionViewComponents } from './edition-view-routing.module';

import { EditionComplexCardComponent } from './edition-complex-card';
import { EditionJumbotronComponent } from './edition-jumbotron';
/**
 * The editionView module.
 *
 * It embeds the edition components and their
 * [routing definition]{@link EditionViewRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionViewRoutingModule],
    declarations: [routedEditionViewComponents, EditionComplexCardComponent, EditionJumbotronComponent],
})
export class EditionViewModule {}
