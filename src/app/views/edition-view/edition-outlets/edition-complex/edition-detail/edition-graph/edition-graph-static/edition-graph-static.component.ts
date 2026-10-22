import { Component, computed, input } from '@angular/core';

import { OBJECT_UTILS } from '@awg-shared/utils/object-utils';

import { EDITION_GRAPH_IMAGES_DATA } from '@awg-views/edition-view/data/edition-graph-images.data';

/**
 * The EditionGraphStatic component.
 *
 * It contains the static graph (an image)
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-graph-static',
    templateUrl: './edition-graph-static.component.html',
    styleUrl: './edition-graph-static.component.scss',
})
export class EditionGraphStaticComponent {
    /**
     * Readonly input signal: imageKey.
     *
     * It holds the key of the static graph image.
     */
    readonly imageKey = input<string | undefined>();

    /**
     * Readonly variable: graphImages.
     *
     * It keeps the paths to static graph images.
     */
    readonly graphImages = {
        OP12: '',
        OP25: EDITION_GRAPH_IMAGES_DATA.GRAPH_IMAGE_OP25.route,
    } satisfies Record<string, string>;

    /**
     * Readonly computed signal: imageSrc.
     *
     * It holds the path of the static graph image for the given image key
     * (or null if the key is unknown or has no image).
     */
    readonly imageSrc = computed<string | null>(() => {
        const imageKey = this.imageKey();
        if (!imageKey || !OBJECT_UTILS.isKeyOf(this.graphImages, imageKey)) {
            return null;
        }

        return this.graphImages[imageKey] || null;
    });
}
