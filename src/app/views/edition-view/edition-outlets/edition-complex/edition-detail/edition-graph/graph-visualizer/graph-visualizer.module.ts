import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { ConstructResultsComponent } from './construct-results/construct-results.component';
import { ForceGraphComponent } from './force-graph/force-graph.component';
import { SelectResultsComponent } from './select-results/select-results.component';
import { SparqlEditorComponent } from './sparql-editor/sparql-editor.component';
import { SparqlNoResultsComponent } from './sparql-no-results/sparql-no-results.component';
import { SparqlTableComponent } from './sparql-table/sparql-table.component';
import { TriplesEditorComponent } from './triples-editor/triples-editor.component';
import { UnsupportedTypeResultsComponent } from './unsupported-type-results/unsupported-type-results.component';
import { GraphVisualizerComponent } from './graph-visualizer.component';

import { GraphVisualizerService } from './services/graph-visualizer.service';

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
        ForceGraphComponent,
        GraphVisualizerComponent,
        PrefixPipe,
        SelectResultsComponent,
        SparqlEditorComponent,
        SparqlNoResultsComponent,
        SparqlTableComponent,
        TriplesEditorComponent,
        UnsupportedTypeResultsComponent,
    ],
    exports: [GraphVisualizerComponent],
    providers: [GraphVisualizerService, PrefixPipe],
})
export class GraphVisualizerModule {}
