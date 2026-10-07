import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';
import { SliderZoomComponent } from '@awg-shared/zoom/slider-zoom.component';

import { ConstructResultsComponent } from './construct-results/construct-results.component';
import { GraphEditorSparqlComponent } from './editor/sparql/graph-editor-sparql.component';
import { GraphEditorTriplesComponent } from './editor/triples/graph-editor-triples.component';
import { ForceGraphComponent } from './force-graph/force-graph.component';
import { GraphVisualizerComponent } from './graph-visualizer.component';
import { SelectResultsComponent } from './select-results/select-results.component';
import { SparqlNoResultsComponent } from './sparql-no-results/sparql-no-results.component';
import { SparqlTableComponent } from './sparql-table/sparql-table.component';
import { UnsupportedTypeResultsComponent } from './unsupported-type-results/unsupported-type-results.component';

/**
 * The GraphVisualizer module.
 *
 * It embeds the graph visualizer components
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [
        GraphEditorSparqlComponent,
        GraphEditorTriplesComponent,
        SelectResultsComponent,
        SharedModule,
        SliderZoomComponent,
        SparqlNoResultsComponent,
        SparqlTableComponent,
        UnsupportedTypeResultsComponent,
    ],
    declarations: [ConstructResultsComponent, ForceGraphComponent, GraphVisualizerComponent],
    exports: [GraphVisualizerComponent],
})
export class GraphVisualizerModule {}
