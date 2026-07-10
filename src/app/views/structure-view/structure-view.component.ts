import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ExternalLinkDirective } from '@awg-shared/external-link/external-link.directive';
import { HeadingComponent } from '@awg-shared/heading/heading.component';

/**
 * The StructureView component.
 *
 * It contains the structure view of the app
 * with a {@link HeadingComponent} and a structure overview.
 */
@Component({
    selector: 'awg-structure-view',
    templateUrl: './structure-view.component.html',
    styleUrls: ['./structure-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ExternalLinkDirective, HeadingComponent],
})
export class StructureViewComponent {
    /**
     * Public readonly variable: STRUCTURE_VIEW_ID.
     *
     * It keeps the id for the heading component
     * of the structure view.
     */
    readonly STRUCTURE_VIEW_ID = 'awg-structure-view-heading';

    /**
     * Public readonly variable: STRUCTURE_VIEW_TITLE.
     *
     * It keeps the title for the heading component
     * of the structure view.
     */
    readonly STRUCTURE_VIEW_TITLE = 'Datenstrukturmodell';

    /**
     * Public readonly variable: STRUCTURE_VIEW_IMG_PATH.
     *
     * It keeps the image path to the image of the structure view.
     */
    readonly STRUCTURE_VIEW_IMG_PATH = 'assets/img/structure/WebernGraph.png';

    /**
     * Public readonly variable: STRUCTURE_VIEW_SVG_PATH.
     *
     * It keeps the svg path to the image of the structure view.
     */
    readonly STRUCTURE_VIEW_SVG_PATH = 'assets/img/structure/WebernGraph.svg';
}
