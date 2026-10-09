import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { FullscreenToggleComponent } from '@awg-shared/fullscreen/fullscreen-toggle.component';
import { FullscreenService } from '@awg-shared/fullscreen/fullscreen.service';

import { GraphRdfData } from '@awg-views/edition-view/models/graph.model';
import { UsageHintsComponent } from '@awg-views/edition-view/shared/usage-hints/usage-hints.component';

import { GraphVisualizerComponent } from '../graph-visualizer/graph-visualizer.component';

/**
 * The EditionGraphDynamic component.
 *
 * It contains the dynamic graph (the {@link GraphVisualizerComponent})
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-graph-dynamic',
    templateUrl: './edition-graph-dynamic.component.html',
    styleUrls: ['./edition-graph-dynamic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FullscreenToggleComponent, GraphVisualizerComponent, UsageHintsComponent],
})
export class EditionGraphDynamicComponent {
    /**
     * Readonly signal: isFullscreen.
     *
     * It holds the fullscreen status.
     */
    readonly isFullscreen = inject(FullscreenService).isFullscreen;

    /**
     * Readonly input signal: rdfData.
     *
     * It holds the RDF data (triples and queries) of the graph.
     */
    readonly rdfData = input.required<GraphRdfData>();

    /**
     * Readonly computed signal: hasRdfData.
     *
     * It holds a boolean flag if triples and a query list are given.
     */
    readonly hasRdfData = computed(() => {
        const rdfData = this.rdfData();
        return !!rdfData?.triples && !!rdfData.queryList;
    });
}
