import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { EditionGraphRoutingModule, routedEditionGraphComponents } from './edition-graph-routing.module';
import { EditionGraphDescriptionComponent } from './edition-graph-description/edition-graph-description.component';
import { EditionGraphDynamicComponent } from './edition-graph-dynamic/edition-graph-dynamic.component';
import { EditionGraphStaticComponent } from './edition-graph-static/edition-graph-static.component';

/**
 * The editionGraph module.
 *
 * It embeds the edition graph components and their
 * [routing definition]{@link EditionGraphRoutingModule},
 * as well as its subcomponents for description, dynamic and static graph.
 */
@NgModule({
    imports: [
        SharedModule,
        EditionGraphDescriptionComponent,
        EditionGraphDynamicComponent,
        EditionGraphStaticComponent,
        EditionGraphRoutingModule,
    ],
    declarations: [routedEditionGraphComponents],
})
export class EditionGraphModule {}
