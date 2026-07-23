import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LoadingService } from '@awg-app/shared/loading/loading.service';

import { FullscreenService } from '@awg-shared/fullscreen/fullscreen.service';
import { UTILS } from '@awg-shared/utils/object-utils';
import { EDITION_GRAPH_IMAGES_DATA } from '@awg-views/edition-view/data';
import { EditionDataService, EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionGraph component.
 *
 * It contains the graph section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-graph',
    templateUrl: './edition-graph.component.html',
    styleUrls: ['./edition-graph.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionGraphComponent {
    /**
     * Private readonly injection variable: _editionDataService.
     *
     * It keeps the instance of the injected EditionDataService.
     */
    private readonly _editionDataService = inject(EditionDataService);

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Private readonly injection variable: _fullscreenService.
     *
     * It keeps the instance of the injected FullscreenService.
     */
    private readonly _fullscreenService = inject(FullscreenService);

    /**
     * Private readonly injection variable: _loadingService.
     *
     * It keeps the instance of the injected LoadingService.
     */
    private readonly _loadingService = inject(LoadingService);

    /**
     * Private readonly signal: _viewReady.
     *
     * It holds a flag indicating if the view is ready.
     */
    private readonly _viewReady = signal<boolean>(false);

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: EditionGraphComponent;

    /**
     * Readonly signal: isFullscreen.
     *
     * It holds the fullscreen status.
     */
    readonly isFullscreen = this._fullscreenService.isFullscreen;

    /**
     * Readonly signal: graphData.
     *
     * It holds the graph data for the selected edition complex.
     */
    readonly graphData = this._editionDataService.graphData;

    /**
     * Readonly signal: errorObject.
     *
     * It holds an errorObject for the service calls.
     */
    readonly errorObject = this._editionDataService.getErrorForDataOperations(['graph']);

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = this._editionStateService.selectedEditionComplex;

    /**
     * Readonly signal: isGraphDataLoaded.
     *
     * It holds a flag indicating if the graph data is loaded.
     */
    readonly isGraphDataLoaded = computed(() => this._viewReady() && this._editionDataService.isGraphDataLoaded());

    /**
     * Readonly variable: GRAPH_IMAGES.
     *
     * It keeps the paths to static graph images.
     */
    readonly GRAPH_IMAGES = {
        OP12: '',
        OP25: EDITION_GRAPH_IMAGES_DATA.GRAPH_IMAGE_OP25.route,
    };

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;

    /**
     * Constructor of the EditionGraphComponent.
     *
     * It initializes the self-referring variable needed for CompileHtml library,
     * and sets the viewReady signal to true after a short delay
     * to show the loadingSpinner when switching between complex views.
     */
    constructor() {
        this.ref = this;

        setTimeout(() => {
            this._viewReady.set(true);
        }, 0);
    }
}
