import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { GraphVisualizerComponent } from './graph-visualizer/graph-visualizer.component';
import { ForceGraphComponent } from './graph-visualizer/force-graph/force-graph.component';
import { PrefixPipe } from './graph-visualizer/prefix-pipe/prefix.pipe';

import { EditionGraphService } from './edition-graph.service';
import { ForceGraphNoResultComponent } from './graph-visualizer/force-graph-no-result/force-graph-no-result.component';

@NgModule({
    imports: [SharedModule],
    declarations: [GraphVisualizerComponent, ForceGraphComponent, ForceGraphNoResultComponent, PrefixPipe],
    exports: [GraphVisualizerComponent],
    providers: [EditionGraphService, PrefixPipe]
})
export class EditionGraphModule {}
