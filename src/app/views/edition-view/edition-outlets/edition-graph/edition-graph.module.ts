import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { GraphVisualizerComponent } from './graph-visualizer/graph-visualizer.component';
import { SparqlGraphComponent } from './graph-visualizer/sparql-graph/sparql-graph.component';
import { SimplePrefixPipe } from './graph-visualizer/prefix-simple-pipe/prefix-simple.pipe';

import { EditionGraphService } from './edition-graph.service';

@NgModule({
    imports: [SharedModule],
    declarations: [GraphVisualizerComponent, SparqlGraphComponent, SimplePrefixPipe],
    exports: [GraphVisualizerComponent],
    providers: [EditionGraphService, SimplePrefixPipe]
})
export class EditionGraphModule {}
