import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { MetaSectionTypes, MetaStructure } from '@awg-core/models/meta.model';
import { CoreService } from '@awg-core/services/core-service/core.service';
import { MetaIdentifierBadgesComponent } from '@awg-shared/meta-identifier-badges/meta-identifier-badges.component';

/**
 * The StructureSideInfo component.
 *
 * It contains the side-info section of the structure view
 * showing author and last modification date information.
 */
@Component({
    selector: 'awg-structure-info',
    templateUrl: './structure-side-info.component.html',
    styleUrls: ['./structure-side-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe, MetaIdentifierBadgesComponent],
})
export class StructureSideInfoComponent {
    /**
     * Private readonly injection variable: _coreService.
     *
     * It keeps the instance of the injected CoreService.
     */
    private readonly _coreService = inject(CoreService);

    /**
     * Public readonly variable: STRUCTURE_SIDE_INFO_HEADER.
     *
     * It keeps the header for the structure side info.
     */
    readonly STRUCTURE_SIDE_INFO_HEADER = 'Strukturmodell';

    /**
     * Readonly signal: structureMetaData.
     *
     * It holds the metadata for the structure side info via the injected CoreService.
     */
    readonly structureMetaData = signal<MetaStructure>(
        this._coreService.getMetaDataSection(MetaSectionTypes.structure)
    ).asReadonly();
}
