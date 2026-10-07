import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';
import { SliderZoomComponent } from '@awg-shared/zoom/slider-zoom.component';

import { ConstructResultsComponent } from './construct-results';
import { ForceGraphComponent } from './force-graph';
import { GraphVisualizerComponent } from './graph-visualizer.component';
import { SelectResultsComponent } from './select-results';
import { SparqlEditorComponent } from './sparql-editor';
import { SparqlNoResultsComponent } from './sparql-no-results';
import { SparqlTableComponent } from './sparql-table';
import { TriplesEditorComponent } from './triples-editor';
import { UnsupportedTypeResultsComponent } from './unsupported-type-results/unsupported-type-results.component';

/**
 * The GraphVisualizer module.
 *
 * It embeds the graph visualizer components
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, SliderZoomComponent, SparqlNoResultsComponent, UnsupportedTypeResultsComponent],
    declarations: [
        ConstructResultsComponent,
        ForceGraphComponent,
        GraphVisualizerComponent,
        SelectResultsComponent,
        SparqlEditorComponent,
        SparqlTableComponent,
        TriplesEditorComponent,
    ],
    exports: [GraphVisualizerComponent],
})
export class GraphVisualizerModule {}
