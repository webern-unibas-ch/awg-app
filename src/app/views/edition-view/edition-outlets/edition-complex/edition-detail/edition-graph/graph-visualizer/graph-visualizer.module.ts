import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';
import { SliderZoomComponent } from '@awg-shared/zoom/slider-zoom.component';

import { GraphEditorSparqlComponent } from './editor/sparql/graph-editor-sparql.component';
import { GraphEditorTriplesComponent } from './editor/triples/graph-editor-triples.component';
import { GraphVisualizerComponent } from './graph-visualizer.component';
import { ForceGraphComponent } from './results/construct/force-graph/force-graph.component';
import { ForceGraphLimitComponent } from './results/construct/force-graph/limit/force-graph-limit.component';
import { ForceGraphSvgComponent } from './results/construct/force-graph/svg/force-graph-svg.component';
import { GraphResultsConstructComponent } from './results/construct/graph-results-construct.component';
import { GraphResultsEmptyComponent } from './results/empty/graph-results-empty.component';
import { GraphResultsSelectComponent } from './results/select/graph-results-select.component';
import { GraphResultsUnsupportedComponent } from './results/unsupported/graph-results-unsupported.component';

/**
 * The GraphVisualizer module.
 *
 * It embeds the graph visualizer components
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [
        ForceGraphLimitComponent,
        ForceGraphSvgComponent,
        GraphEditorSparqlComponent,
        GraphEditorTriplesComponent,
        GraphResultsEmptyComponent,
        GraphResultsSelectComponent,
        GraphResultsUnsupportedComponent,
        SharedModule,
        SliderZoomComponent,
    ],
    declarations: [ForceGraphComponent, GraphResultsConstructComponent, GraphVisualizerComponent],
    exports: [GraphVisualizerComponent],
})
export class GraphVisualizerModule {}
