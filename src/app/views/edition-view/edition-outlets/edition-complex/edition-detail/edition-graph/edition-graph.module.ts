import { NgModule } from '@angular/core';

import { ButtonUsageHintsComponent } from '@awg-shared/button-usage-hints/button-usage-hints.component';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionGraphRoutingModule, routedEditionGraphComponents } from './edition-graph-routing.module';
import { GraphVisualizerComponent } from './graph-visualizer/graph-visualizer.component';

/**
 * The editionGraph module.
 *
 * It embeds the edition graph components and their
 * [routing definition]{@link EditionGraphRoutingModule},
 * as well as the {@link GraphVisualizerComponent}.
 */
@NgModule({
    imports: [SharedModule, ButtonUsageHintsComponent, GraphVisualizerComponent, EditionGraphRoutingModule],
    declarations: [routedEditionGraphComponents],
})
export class EditionGraphModule {}
