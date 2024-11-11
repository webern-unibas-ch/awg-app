import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

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
     * It keeps the metadata for the structure info.
     */
    structureMetaData: MetaStructure;

    /**
     * Private readonly injection variable: _coreService.
     *
     * It keeps the instance of the injected CoreService.
     */
    private readonly _coreService = inject(CoreService);

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
     * the metadata for the structure info.
     *
     * @returns {void} Sets the structureMetaData variable.
     */
    provideMetaData(): void {
        this.structureMetaData = this._coreService.getMetaDataSection(MetaSectionTypes.structure);
    }
}
