import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { UtilityService } from '@awg-core/services';
import { EDITION_TRADEMARKS_DATA } from '@awg-views/edition-view/data';
import {
    SourceDescriptionList,
    SourceDescriptionWritingInstruments,
    SourceDescriptionWritingMaterialDimension,
    SourceDescriptionWritingMaterialFormat,
    SourceDescriptionWritingMaterialItemLocation,
    SourceDescriptionWritingMaterialSystems,
} from '@awg-views/edition-view/models';

/**
 * The SourceDescription component.
 *
 * It contains the source description section
 * of the critical report
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-source-description',
    templateUrl: './source-description.component.html',
    styleUrls: ['./source-description.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SourceDescriptionComponent {
    /**
     * Input variable: sourceDescriptionListData.
     *
     * It keeps the source list data.
     */
    @Input()
    sourceDescriptionListData: SourceDescriptionList;

    /**
     * Output variable: navigateToReportFragment.
     *
     * It keeps an event emitter for the selected ids of an edition complex and report fragment.
     */
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();

    /**
     * Output variable: openModalRequest.
     *
     * It keeps an event emitter to open the modal
     * with the selected modal text snippet.
     */
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Output variable: selectSvgSheetRequest.
     *
     * It keeps an event emitter for the selected ids of an edition complex and svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();

    /**
     * Readonly variable: TRADEMARKS.
     *
     * It keeps the routes to the trademarks.
     */
    readonly TRADEMARKS = EDITION_TRADEMARKS_DATA;

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: SourceDescriptionComponent;

    /**
     * Constructor of the SourceDescriptionComponent.
     *
     * It declares a public instance of the UtilityService and
     * initializes the self-referring variable needed for CompileHtml library.
     *
     * @param {UtilityService} utils Instance of the UtilityService.
     */
    constructor(public utils: UtilityService) {
        this.ref = this;
    }

    /**
     * Public method: getWritingInstruments.
     *
     * It retrieves the string representation of the writing instruments
     * provided in the source description.
     *
     * @param {SourceDescriptionWritingInstruments} writingInstruments The given writing instruments data.
     * @returns {string} The retrieved writing instruments string.
     */
    getWritingInstruments(writingInstruments: SourceDescriptionWritingInstruments): string {
        const secondaryInstruments = writingInstruments.secondary?.join(', ');
        const instrumentsString = secondaryInstruments
            ? `${writingInstruments.main}; ${secondaryInstruments}`
            : writingInstruments.main;

        return `${instrumentsString}.`;
    }

    /**
     * Public method: getWritingMaterialTradeMark.
     *
     * It retrieves a trademark for a given variant
     * from the {@link EDITION_TRADEMARKS_DATA}.
     *
     * @param {string} variant The given variant.
     * @returns {object} The retrieved trademark.
     */
    getWritingMaterialTrademark(variant: string): {
        readonly route: string;
        readonly full: string;
        readonly short: string;
    } {
        return variant && this.TRADEMARKS[variant]
            ? this.TRADEMARKS[variant]
            : { route: '', full: 'Not a known trademark.', short: 'unknown' };
    }

    /**
     * Public method: getWritingMaterialItemLocation.
     *
     * It retrieves the string representation of the location
     * of an item of the writing material (trademark or watermark)
     * provided in the source description.
     *
     * @param {SourceDescriptionWritingMaterialItemLocation} location The given location data.
     * @returns {string} The retrieved location string.
     */
    getWritingMaterialItemLocation(location: SourceDescriptionWritingMaterialItemLocation): string {
        if (!this.utils.isNotEmptyObject(location)) {
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

        const formattedFolios = location.folios.map(formatFolio);
        const foliosString = getFoliosString(formattedFolios);

        const info = location.info ? `${location.info} ` : '';
        const positionWhiteSpace = foliosString ? ' ' : '';
        const position = location.position ? `${positionWhiteSpace}${location.position}` : '';

        return `${info}${foliosString}${position}`;
    }

    /**
     * Public method: getWritingMaterialFormat.
     *
     * It retrieves the string representation of the format
     * of the writing material provided in the source description.
     *
     * @param {SourceDescriptionWritingMaterialFormat} format The given format data.
     * @returns {string} The retrieved format string.
     */
    getWritingMaterialFormat(format: SourceDescriptionWritingMaterialFormat): string {
        const { orientation, height, width } = format;

        const getDimension = (dimension: SourceDescriptionWritingMaterialDimension) => {
            if (!this.utils.isNotEmptyObject(dimension)) {
                return '';
            }
            return dimension.uncertainty ? `${dimension.uncertainty} ${dimension.value}` : dimension.value;
        };

        return `Format: ${orientation} ${getDimension(height)} × ${getDimension(width)} mm`;
    }

    /**
     * Public method: getWritingMaterialSystems.
     *
     * It retrieves the systems of the writing material
     * provided in the source description.
     *
     * @param {SourceDescriptionWritingMaterialSystems} systems The given systems data.
     * @returns {string} The retrieved systems string.
     */
    getWritingMaterialSystems(systems: SourceDescriptionWritingMaterialSystems): string {
        const systemsOutput = [
            `${systems.number} ${systems.number === 1 ? 'System' : 'Systeme'}`,
            systems.info && ` (${systems.info})`,
            systems.addendum && `, ${systems.addendum}`,
        ];

        return systemsOutput.filter(Boolean).join('');
    }

    /**
     * Public method: navigateToReportFragment.
     *
     * It emits the given ids of a selected edition complex and report fragment
     * to the {@link navigateToReportFragmentRequest}.
     *
     * @param {object} reportIds The given report ids as { complexId: string, fragmentId: string }.
     * @returns {void} Emits the ids.
     */
    navigateToReportFragment(reportIds: { complexId: string; fragmentId: string }): void {
        if (!reportIds?.fragmentId) {
            return;
        }
        this.navigateToReportFragmentRequest.emit(reportIds);
    }

    /**
     * Public method: openModal.
     *
     * It emits a given id of a modal snippet text
     * to the {@link openModalRequest}.
     *
     * @param {string} id The given modal snippet id.
     * @returns {void} Emits the id.
     */
    openModal(id: string): void {
        if (!id) {
            return;
        }
        this.openModalRequest.emit(id);
    }

    /**
     * Public method: selectSvgSheet.
     *
     * It emits the given ids of a selected edition complex
     * and svg sheet to the {@link selectSvgSheetRequest}.
     *
     * @param {object} sheetIds The given sheet ids as { complexId: string, sheetId: string }.
     * @returns {void} Emits the ids.
     */
    selectSvgSheet(sheetIds: { complexId: string; sheetId: string }): void {
        if (!sheetIds?.sheetId) {
            return;
        }
        this.selectSvgSheetRequest.emit(sheetIds);
    }
}
