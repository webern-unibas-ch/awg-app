import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';
import { GraphVisualizerModule, GraphVisualizerComponent } from './graph-visualizer';

/**
 * The editionGraph module.
 *
 * It embeds the edition graph components, pipes and services.
 */
@NgModule({
    imports: [SharedModule, GraphVisualizerModule],
    exports: [GraphVisualizerComponent]
})
export class EditionGraphModule {}
