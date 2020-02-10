import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { GraphVisualizerComponent } from './graph-visualizer/graph-visualizer.component';
import { EditionGraphService } from './edition-graph.service';

@NgModule({
    imports: [SharedModule],
    declarations: [GraphVisualizerComponent],
    exports: [GraphVisualizerComponent],
    providers: [EditionGraphService]
})
export class EditionGraphModule {}
