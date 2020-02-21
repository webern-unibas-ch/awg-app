import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { GraphVisualizerComponent } from './graph-visualizer/graph-visualizer.component';
import { SparqlGraphComponent } from './graph-visualizer/sparql-graph/sparql-graph.component';
import { PrefixPipe } from './graph-visualizer/prefix-pipe/prefix.pipe';

import { EditionGraphService } from './edition-graph.service';

@NgModule({
    imports: [SharedModule],
    declarations: [GraphVisualizerComponent, SparqlGraphComponent, PrefixPipe],
    exports: [GraphVisualizerComponent],
    providers: [EditionGraphService, PrefixPipe]
})
export class EditionGraphModule {}
