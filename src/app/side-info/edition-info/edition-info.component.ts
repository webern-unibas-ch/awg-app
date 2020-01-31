import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MetaEdition, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';
import { EditionWorks } from '@awg-views/edition-view/models';

/**
 * The EditionInfo component.
 *
 * It contains the side-info section of the edition view.
 */
@Component({
    selector: 'awg-edition-info',
    templateUrl: './edition-info.component.html',
    styleUrls: ['./edition-info.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditionInfoComponent implements OnInit {
    /**
     * Public variable: editionInfoHeaderOp12.
     *
     * It keeps the header information for the edition-info for Op12.
     */
    editionInfoHeaderOp12 = {
        section: 'AWG I/5',
        title: 'Vier Lieder',
        catalogueType: 'op.',
        catalogueNumber: '12',
        part: 'Skizzen',
        description: '[Beispieledition ausgewählter Skizzen]'
    };

    /**
     * Public variable: editionInfoHeaderOp25.
     *
     * It keeps the header information for the edition-info for Op25.
     */
    editionInfoHeaderOp25 = {
        section: 'AWG I/5',
        title: 'Drei Lieder',
        catalogueType: 'op.',
        catalogueNumber: '25',
        part: 'Graph',
        description: '[Beispieledition ausgewählter Skizzen]'
    };

    /**
     * Readonly constant: editionWorkOp12.
     *
     * It keeps the current composition.
     */
    readonly editionWorkOp12 = EditionWorks.op12;

    /**
     * Readonly constant: editionWorkOp25.
     *
     * It keeps the current composition.
     */
    readonly editionWorkOp25 = EditionWorks.op25;

    /**
     * Public variable: editionMetaData.
     *
     * It keeps the meta data for the edition info.
     */
    editionMetaData: MetaEdition;

    /**
     * Constructor of the EditionInfoComponent.
     *
     * It declares a private CoreService instance
     * to get the meta data.
     *
     * @param {CoreService} coreService Instance of the CoreService.
     */
    constructor(private coreService: CoreService) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.provideMetaData();
    }

    /**
     * Public method: provideMetaData.
     *
     * It calls the CoreService to provide
     * the meta data for the edition info.
     *
     * @returns {void} Sets the editionMetaData variable.
     */
    provideMetaData(): void {
        this.editionMetaData = this.coreService.getMetaDataSection(MetaSectionTypes.edition);
    }
}
