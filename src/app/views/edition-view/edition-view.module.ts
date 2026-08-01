import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { EditionBreadcrumbComponent } from './edition-breadcrumb/edition-breadcrumb.component';
import { EditionInfoComponent } from './edition-info/edition-info.component';
import { EditionJumbotronComponent } from './edition-jumbotron/edition-jumbotron.component';
import { EditionViewRoutingModule, routedEditionViewComponents } from './edition-view-routing.module';

/**
 * The editionView module.
 *
 * It embeds the edition components and their
 * [routing definition]{@link EditionViewRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionViewRoutingModule, EditionInfoComponent, EditionBreadcrumbComponent],
    declarations: [routedEditionViewComponents, EditionJumbotronComponent],
})
export class EditionViewModule {}
