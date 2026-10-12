import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

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
    styleUrls: ['./edition-graph-static.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class EditionGraphStaticComponent {
    /**
     * Readonly input signal: imageKey.
     *
     * It holds the key of the static graph image.
     */
    readonly imageKey = input<string | undefined>();

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
     * Readonly computed signal: imageSrc.
     *
     * It holds the path of the static graph image for the given image key
     * (or null if the key is unknown or has no image).
     */
    readonly imageSrc = computed<string | null>(() => {
        const imageKey = this.imageKey();
        if (!imageKey || !Object.hasOwn(this.GRAPH_IMAGES, imageKey)) {
            return null;
        }

        return this.GRAPH_IMAGES[imageKey as keyof typeof this.GRAPH_IMAGES] || null;
    });
}
