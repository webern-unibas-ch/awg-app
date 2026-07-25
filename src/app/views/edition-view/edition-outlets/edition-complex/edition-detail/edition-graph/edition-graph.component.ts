import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

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
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = this._editionStateService.selectedEditionComplex;

    /**
     * Readonly signal: viewData.
     *
     * It holds the state of the graph view data.
     */
    readonly viewData = this._editionDataService.graphViewData;

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
    }
}
