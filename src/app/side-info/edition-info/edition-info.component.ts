import { Component, OnInit } from '@angular/core';

import { MetaEdition, MetaSectionKey } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

/**
 * The EditionInfo component.
 *
 * It contains the side-info section of the edition view.
 */
@Component({
    selector: 'awg-edition-info',
    templateUrl: './edition-info.component.html',
    styleUrls: ['./edition-info.component.css']
})
export class EditionInfoComponent implements OnInit {
    /**
     * Public variable: pageMetaData.
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
        this.editionMetaData = this.coreService.getMetaDataSection(MetaSectionKey.edition);
    }
}
