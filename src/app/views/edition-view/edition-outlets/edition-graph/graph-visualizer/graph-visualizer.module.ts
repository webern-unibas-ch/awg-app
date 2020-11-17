import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { ForceGraphComponent } from './force-graph/force-graph.component';
import { ForceGraphNoResultComponent } from './force-graph-no-result/force-graph-no-result.component';
import { TriplesEditorComponent } from './triples-editor/triples-editor.component';
import { GraphVisualizerComponent } from './graph-visualizer.component';

import { PrefixPipe } from './prefix-pipe/prefix.pipe';

/**
 * The GraphVisualizer module.
 *
 * It embeds the graph visualizer components and pipes
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [
        GraphVisualizerComponent,
        ForceGraphComponent,
        ForceGraphNoResultComponent,
        PrefixPipe,
        TriplesEditorComponent
    ],
    exports: [GraphVisualizerComponent],
    providers: [PrefixPipe]
})
export class GraphVisualizerModule {}
