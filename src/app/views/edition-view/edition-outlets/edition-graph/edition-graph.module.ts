import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';
import { GraphVisualizerModule } from './graph-visualizer';
import { EditionGraphRoutingModule, routedEditionGraphComponents } from './edition-graph-routing.module';

/**
 * The editionGraph module.
 *
 * It embeds the edition graph components and their
 * [routing definition]{@link EditionGraphRoutingModule},
 * as well as the {@link GraphVisualizerModule}.
 */
@NgModule({
    imports: [SharedModule, GraphVisualizerModule, EditionGraphRoutingModule],
    declarations: [routedEditionGraphComponents]
})
export class EditionGraphModule {}
