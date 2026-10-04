import { NgModule } from '@angular/core';

import { ButtonUsageHintsComponent } from '@awg-shared/button-usage-hints/button-usage-hints.component';
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
    imports: [SharedModule, ButtonUsageHintsComponent, GraphVisualizerModule, EditionGraphRoutingModule],
    declarations: [routedEditionGraphComponents],
})
export class EditionGraphModule {}
