import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { ForceGraphComponent } from './force-graph/force-graph.component';
import { ForceGraphNoResultComponent } from './force-graph-no-result/force-graph-no-result.component';
import { GraphVisualizerComponent } from './graph-visualizer.component';

import { GraphVisualizerService } from './services/graph-visualizer.service';
import { PrefixPipe } from './prefix-pipe/prefix.pipe';

/**
 * The GraphVisualizer module.
 *
 * It embeds the graph visualizer components and pipes.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [GraphVisualizerComponent, ForceGraphComponent, ForceGraphNoResultComponent, PrefixPipe],
    exports: [GraphVisualizerComponent],
    providers: [GraphVisualizerService, PrefixPipe]
})
export class GraphVisualizerModule {}
