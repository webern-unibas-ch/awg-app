import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EDITION_TRADEMARKS_DATA } from '@awg-views/edition-view/data/edition-trademarks.data';
import { EditionRouteConstant } from '@awg-views/edition-view/edition-routes.constants';
import {
    SourceDescriptionWritingMaterial,
    SourceDescriptionWritingMaterialDimension,
    SourceDescriptionWritingMaterialDimensions,
    SourceDescriptionWritingMaterialItemLocus,
    SourceDescriptionWritingMaterialSystems,
} from '@awg-views/edition-view/models/source-description.model';

/**
 * The SourceDescriptionWritingMaterials component.
 *
 * It contains the source description writing materials section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-description-writing-materials',
    templateUrl: './source-description-writing-materials.component.html',
    styleUrls: ['./source-description-writing-materials.component.scss'],
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
    writingMaterials: SourceDescriptionWritingMaterial[] = [];

    /**
     * Public method: getTradeMark.
     *
     * It retrieves a trademark for a given variant
     * from the {@link EDITION_TRADEMARKS_DATA}.
     *
     * @param {string} variant The given variant.
     * @returns {EditionRouteConstant} The retrieved trademark, or a default constant if not found.
     */
    getTrademark(variant: string): EditionRouteConstant {
        const unknownTrademark: EditionRouteConstant = {
            route: '',
            full: 'Not a known trademark.',
            short: 'unknown',
        };

        if (!variant || !Object.hasOwn(EDITION_TRADEMARKS_DATA, variant)) {
            return unknownTrademark;
        }

        return EDITION_TRADEMARKS_DATA[variant as keyof typeof EDITION_TRADEMARKS_DATA];
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
        let foliosStr = '';

        if (locus.folios?.length) {
            const folios = locus.folios
                .filter(Boolean)
                .map(folio =>
                    folio.endsWith('v') || folio.endsWith('r')
                        ? `${folio.slice(0, -1)}<sup>${folio.slice(-1)}</sup>`
                        : folio
                );

            if (folios.length === 1) {
                foliosStr = folios[0].includes('all') ? 'auf allen Blättern' : `auf Bl. ${folios[0]}`;
            } else if (folios.length > 1) {
                foliosStr = `auf Bl. ${folios.slice(0, -1).join(', ')} und ${folios.slice(-1)}`;
            }
        }

        const preInfo = locus.preFolioInfo || '';
        const position = locus.position || '';

        const parts = [preInfo, foliosStr, position].filter(Boolean);
        return parts.join(' ');
    }

    /**
     * Public method: getDimensions.
     *
     * It retrieves the string representation of the dimensions
     * of the writing material provided in the source description.
     *
     * @param {SourceDescriptionWritingMaterialDimensions | undefined} dimensions The given dimensions data, or undefined.
     * @returns {string} The retrieved dimensions string.
     */
    getDimensions(dimensions: SourceDescriptionWritingMaterialDimensions | undefined): string {
        if (!dimensions) {
            return '';
        }

        const { orientation, height, width, unit } = dimensions;

        const getDimension = (dim: SourceDescriptionWritingMaterialDimension | undefined): string => {
            if (!dim?.value) {
                return '';
            }
            return dim.uncertainty ? `${dim.uncertainty} ${dim.value}` : dim.value;
        };

        const h = getDimension(height);
        const w = getDimension(width);

        if (!h && !w) {
            return '';
        }

        const prefix = orientation ? `Format: ${orientation}` : 'Format:';
        const formatStr = `${h} × ${w}`;
        const parts = [prefix, formatStr, unit].filter(Boolean);

        return parts.join(' ');
    }

    /**
     * Public method: getSystems.
     *
     * It retrieves the systems of the writing material
     * provided in the source description.
     *
     * @param {SourceDescriptionWritingMaterialSystems| undefined} systems The given systems data, or undefined.
     * @returns {string} The retrieved systems string.
     */
    getSystems(systems: SourceDescriptionWritingMaterialSystems | undefined): string {
        if (!systems?.totalSystems) {
            return '';
        }

        const total = `${systems.totalSystems} ${systems.totalSystems === 1 ? 'System' : 'Systeme'}`;
        const addendum = systems.totalSystemsAddendum ? ` (${systems.totalSystemsAddendum})` : '';
        const info = systems.additionalInfo ? `, ${systems.additionalInfo}` : '';

        return total + addendum + info;
    }
}
