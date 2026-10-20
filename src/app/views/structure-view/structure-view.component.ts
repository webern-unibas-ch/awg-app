import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ButtonScrollToTopComponent } from '@awg-shared/button-scroll-to-top/button-scroll-to-top.component';
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
    styleUrl: './structure-view.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonScrollToTopComponent, ExternalLinkDirective, HeadingComponent],
})
export class StructureViewComponent {
    /**
     * Public readonly variable: structureViewId.
     *
     * It keeps the id for the heading component
     * of the structure view.
     */
    readonly structureViewId = 'awg-structure-view-heading';

    /**
     * Public readonly variable: structureViewTitle.
     *
     * It keeps the title for the heading component
     * of the structure view.
     */
    readonly structureViewTitle = 'Datenstrukturmodell';

    /**
     * Public readonly variable: structureViewImgPath.
     *
     * It keeps the image path to the image of the structure view.
     */
    readonly structureViewImgPath = 'assets/img/structure/WebernGraph.png';

    /**
     * Public readonly variable: structureViewSvgPath.
     *
     * It keeps the svg path to the image of the structure view.
     */
    readonly structureViewSvgPath = 'assets/img/structure/WebernGraph.svg';
}
