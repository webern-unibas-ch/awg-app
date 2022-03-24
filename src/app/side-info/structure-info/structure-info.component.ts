import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MetaSectionTypes, MetaStructure } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

/**
 * The StructureInfo component.
 *
 * It contains the side-info section of the structure view
 * showing author and last modification date information.
 */
@Component({
    selector: 'awg-structure-info',
    templateUrl: './structure-info.component.html',
    styleUrls: ['./structure-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StructureInfoComponent implements OnInit {
    /**
     * Public variable: structureInfoHeader.
     *
     * It keeps the header for the structure-info.
     */
    structureInfoHeader = 'Strukturmodell';

    /**
     * Public variable: structureMetaData.
     *
     * It keeps the meta data for the structure info.
     */
    structureMetaData: MetaStructure;

    /**
     * Constructor of the StructureInfoComponent.
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
     * the meta data for the structure info.
     *
     * @returns {void} Sets the structureMetaData variable.
     */
    provideMetaData(): void {
        this.structureMetaData = this.coreService.getMetaDataSection(MetaSectionTypes.structure);
    }
}
