import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { ConstructResultsComponent } from './construct-results/construct-results.component';
import { ForceGraphComponent } from './force-graph/force-graph.component';
import { ForceGraphNoResultComponent } from './force-graph-no-result/force-graph-no-result.component';
import { SparqlEditorComponent } from './sparql-editor/sparql-editor.component';
import { SelectResultsComponent } from './select-results/select-results.component';
import { TriplesEditorComponent } from './triples-editor/triples-editor.component';
import { UnsupportedTypeResultsComponent } from './unsupported-type-results/unsupported-type-results.component';
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
        ConstructResultsComponent,
        GraphVisualizerComponent,
        ForceGraphComponent,
        ForceGraphNoResultComponent,
        PrefixPipe,
        TriplesEditorComponent,
        SelectResultsComponent,
        SparqlEditorComponent,
        UnsupportedTypeResultsComponent,
    ],
    exports: [GraphVisualizerComponent],
    providers: [PrefixPipe],
})
export class GraphVisualizerModule {}
