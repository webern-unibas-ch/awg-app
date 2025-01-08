import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The StructureView component.
 *
 * It contains the structure view section of the app
 * with an {@link HeadingComponent} and a structure overview.
 */
@Component({
    selector: 'awg-structure-view',
    templateUrl: './structure-view.component.html',
    styleUrls: ['./structure-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false,
})
export class StructureViewComponent {
    /**
     * Public variable: structureViewTitle.
     *
     * It keeps the title for the heading component
     * of the structure view section.
     */
    structureViewTitle = 'Datenstrukturmodell';

    /**
     * Public variable: structureId.
     *
     * It keeps the id for the heading component
     * of the structure view section.
     */
    structureViewId = 'awg-structure-view';
}
