import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { GraphVisualizerComponent } from './graph-visualizer/graph-visualizer.component';
import { ForceGraphComponent } from './graph-visualizer/force-graph/force-graph.component';
import { PrefixPipe } from './graph-visualizer/prefix-pipe/prefix.pipe';

import { EditionGraphService } from './edition-graph.service';

@NgModule({
    imports: [SharedModule],
    declarations: [GraphVisualizerComponent, ForceGraphComponent, PrefixPipe],
    exports: [GraphVisualizerComponent],
    providers: [EditionGraphService, PrefixPipe]
})
export class EditionGraphModule {}
