import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { ConstructResultsComponent } from './construct-results';
import { ForceGraphComponent } from './force-graph';
import { GraphVisualizerComponent } from './graph-visualizer.component';
import { SelectResultsComponent } from './select-results';
import { SparqlEditorComponent } from './sparql-editor';
import { SparqlNoResultsComponent } from './sparql-no-results';
import { SparqlTableComponent } from './sparql-table';
import { TriplesEditorComponent } from './triples-editor';
import { UnsupportedTypeResultsComponent } from './unsupported-type-results';

import { GraphVisualizerService } from './services';

import { PrefixPipe } from './prefix-pipe';

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
