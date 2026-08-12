import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FullscreenService } from '@awg-shared/fullscreen/fullscreen.service';
import { ModalService } from '@awg-shared/modal/modal.service';
import { UTILS } from '@awg-shared/utils/object-utils';

import { EDITION_GRAPH_IMAGES_DATA } from '@awg-views/edition-view/data';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

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
     * Private readonly injection variable: _modalService
     *
     * It keeps the instance of the injected ModalService.
     */
    private readonly _modalService = inject(ModalService);

    /**
     * Readonly signal: isFullscreen.
     *
     * It holds the fullscreen status.
     */
    readonly isFullscreen = inject(FullscreenService).isFullscreen;

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = inject(EditionStateService).selectedEditionComplex;

    /**
     * Readonly signal: viewData.
     *
     * It holds the state of the graph view data.
     */
    readonly viewData = inject(EditionViewService).graphViewData;

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;

    /**
     * Readonly variable: GRAPH_IMAGES.
     *
     * It keeps the paths to static graph images.
     */
    readonly GRAPH_IMAGES = {
        OP12: '',
        OP25: EDITION_GRAPH_IMAGES_DATA.GRAPH_IMAGE_OP25.route,
    } satisfies Record<string, string>;

    /**
     * Public method: getStaticImage.
     *
     * It retrieves the static image source path for a given image id.
     *
     * @param {string} imageId The given image id.
     * @returns {string | null} The retrieved image source path or null.
     */
    getStaticImage(imageId: string | undefined): string | null {
        if (!imageId) {
            return null;
        }

        if (imageId in this.GRAPH_IMAGES) {
            return this.GRAPH_IMAGES[imageId as keyof typeof this.GRAPH_IMAGES];
        }

        return null;
    }

    /**
     * Public method: openModal.
     *
     * It opens a text modal snippet via the {@link ModalService} for a given id.
     *
     * @param {string} id The given modal snippet id.
     * @returns {void} Opens the text modal.
     */
    openModal(id: string): void {
        if (!id) {
            return;
        }
        this._modalService.openTextModal(id);
    }
}
