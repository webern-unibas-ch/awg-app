import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { UtilityService } from '@awg-core/services';
import { EDITION_TRADEMARKS_DATA } from '@awg-views/edition-view/data';
import {
    SourceDescriptionWritingMaterial,
    SourceDescriptionWritingMaterialDimension,
    SourceDescriptionWritingMaterialDimensions,
    SourceDescriptionWritingMaterialItemLocus,
    SourceDescriptionWritingMaterialSystems,
} from '@awg-views/edition-view/models';

/**
 * The SourceDescriptionWritingMaterials component.
 *
 * It contains the source description writingmaterial section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-description-writing-materials',
    templateUrl: './source-description-writing-materials.component.html',
    styleUrl: './source-description-writing-materials.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SourceDescriptionWritingMaterialsComponent {
    /**
     * Input variable: writingMaterials.
     *
     * It keeps the writingMaterials array.
     */
    @Input()
    writingMaterials: SourceDescriptionWritingMaterial[];

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: SourceDescriptionWritingMaterialsComponent;

    /**
     * Public readonly injection variable: UTILS.
     *
     * It keeps the instance of the injected UtilityService.
     */
    readonly UTILS = inject(UtilityService);

    /**
     * Readonly variable: TRADEMARKS.
     *
     * It keeps the routes to the trademarks.
     */
    readonly TRADEMARKS = EDITION_TRADEMARKS_DATA;

    /**
     * Constructor of the SourceDescriptionContentComponent.
     *
     * It initializes the self-referring variable needed for CompileHtml library.
     */
    constructor() {
        this.ref = this;
    }

    /**
     * Public method: getTradeMark.
     *
     * It retrieves a trademark for a given variant
     * from the {@link EDITION_TRADEMARKS_DATA}.
     *
     * @param {string} variant The given variant.
     * @returns {object} The retrieved trademark.
     */
    getTrademark(variant: string): {
        readonly route: string;
        readonly full: string;
        readonly short: string;
    } {
        return variant && this.TRADEMARKS[variant]
            ? this.TRADEMARKS[variant]
            : { route: '', full: 'Not a known trademark.', short: 'unknown' };
    }

    /**
     * Public method: getItemLocus.
     *
     * It retrieves the string representation of the locus
     * of an item of the writing material (trademark or watermark)
     * provided in the source description.
     *
     * @param {SourceDescriptionWritingMaterialItemLocus} locus The given locus data.
     * @returns {string} The retrieved locus string.
     */
    getItemLocus(locus: SourceDescriptionWritingMaterialItemLocus): string {
        if (!this.UTILS.isNotEmptyObject(locus)) {
            return '';
        }

        const formatFolio = (folio: string) =>
            folio.endsWith('v') || folio.endsWith('r') ? `${folio.slice(0, -1)}<sup>${folio.slice(-1)}</sup>` : folio;

        const getFoliosString = (folios: string[]) => {
            if (folios.length === 1) {
                return folios[0].includes('all') ? 'auf allen Blättern' : `auf Bl. ${folios[0]}`;
            } else if (folios.length > 1) {
                return `auf Bl. ${folios.slice(0, -1).join(', ')} und ${folios.slice(-1)}`;
            }
            return '';
        };

        const formattedFolios = locus.folios.map(formatFolio);
        const foliosString = getFoliosString(formattedFolios);

        const infoString = locus.preFolioInfo ? `${locus.preFolioInfo} ` : '';
        const positionWhiteSpace = foliosString ? ' ' : '';
        const positionString = locus.position ? `${positionWhiteSpace}${locus.position}` : '';

        return `${infoString}${foliosString}${positionString}`;
    }

    /**
     * Public method: getDimensions.
     *
     * It retrieves the string representation of the dimensions
     * of the writing material provided in the source description.
     *
     * @param {SourceDescriptionWritingMaterialDimensions} dimensions The given dimensions data.
     * @returns {string} The retrieved dimensions string.
     */
    getDimensions(dimensions: SourceDescriptionWritingMaterialDimensions): string {
        const { orientation, height, width, unit } = dimensions;

        const getDimension = (dimension: SourceDescriptionWritingMaterialDimension) => {
            if (!this.UTILS.isNotEmptyObject(dimension)) {
                return '';
            }
            return dimension.uncertainty ? `${dimension.uncertainty} ${dimension.value}` : dimension.value;
        };

        return `Format: ${orientation} ${getDimension(height)} × ${getDimension(width)} ${unit}`;
    }

    /**
     * Public method: getSystems.
     *
     * It retrieves the systems of the writing material
     * provided in the source description.
     *
     * @param {SourceDescriptionWritingMaterialSystems} systems The given systems data.
     * @returns {string} The retrieved systems string.
     */
    getSystems(systems: SourceDescriptionWritingMaterialSystems): string {
        const systemsOutput = [
            `${systems.totalSystems} ${systems.totalSystems === 1 ? 'System' : 'Systeme'}`,
            systems.totalSystemsAddendum && ` (${systems.totalSystemsAddendum})`,
            systems.additionalInfo && `, ${systems.additionalInfo}`,
        ];

        return systemsOutput.filter(Boolean).join('');
    }
}
