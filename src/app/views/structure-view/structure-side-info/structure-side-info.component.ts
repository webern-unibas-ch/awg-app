import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ExternalLinkDirective } from '@awg-shared/external-link/external-link.directive';
import { MetaIdentifierBadgesComponent } from '@awg-shared/meta/meta-identifier-badges/meta-identifier-badges.component';
import { META_DATA } from '@awg-shared/meta/meta.data';
import { MetaSectionTypes } from '@awg-shared/meta/meta.model';

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
    imports: [DatePipe, ExternalLinkDirective, MetaIdentifierBadgesComponent],
})
export class StructureSideInfoComponent {
    /**
     * Readonly variable: STRUCTURE_SIDE_INFO_HEADER.
     *
     * It keeps the header for the structure side info.
     */
    readonly STRUCTURE_SIDE_INFO_HEADER = 'Strukturmodell';

    /**
     * Readonly variable: structureMetaData.
     *
     * It keeps the metadata for the structure side info.
     */
    readonly structureMetaData = META_DATA[MetaSectionTypes.structure];
}
