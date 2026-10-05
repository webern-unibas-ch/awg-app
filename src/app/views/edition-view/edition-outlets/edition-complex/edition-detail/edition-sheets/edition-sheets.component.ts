import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { AlertErrorComponent } from '@awg-shared/alert-error/alert-error.component';
import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { EditionNavigationSheetTarget } from '@awg-views/edition-view/models/edition-navigation.model';
import { EditionSvgOverlayTkk } from '@awg-views/edition-view/models/edition-svg-overlay.model';
import {
    EditionSvgSheetContext,
    EditionSvgSheetSelection,
} from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { FolioConvolute } from '@awg-views/edition-view/models/folio.model';
import { Textcritics } from '@awg-views/edition-view/models/textcritics.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionFoliosPanelComponent } from './edition-folios-panel/edition-folios-panel.component';
import { EditionSheetsPanelComponent } from './edition-sheets-panel/edition-sheets-panel.component';
import { EDITION_SHEETS_UTILS } from './edition-sheets.utils';

/**
 * The EditionSheets component.
 *
 * It contains the edition sheets section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-sheets',
    templateUrl: './edition-sheets.component.html',
    styleUrls: ['./edition-sheets.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AlertErrorComponent,
        EditionFoliosPanelComponent,
        EditionSheetsPanelComponent,
        TwelveToneSpinnerComponent,
    ],
})
export class EditionSheetsComponent {
    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Private readonly injection variable: _route.
     *
     * It keeps the instance of the injected Angular ActivatedRoute.
     */
    private readonly _route = inject(ActivatedRoute);

    /**
     * Private readonly signal: _queryParams.
     *
     * It holds the query parameters of the current route as a signal.
     */
    private readonly _queryParams = toSignal(this._route.queryParamMap, {
        initialValue: this._route.snapshot.queryParamMap,
    });

    /**
     * Private readonly computed signal: _sheetIdFromRoute.
     *
     * It holds the full sheet id given by the query param `id` (or an empty string).
     */
    private readonly _sheetIdFromRoute = computed<string>(() => this._queryParams()?.get('id') ?? '');

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = inject(EditionStateService).selectedEditionComplex;

    /**
     * Readonly signal: viewData.
     *
     * It holds the state of the sheets view data.
     */
    readonly viewData = inject(EditionViewService).sheetsViewData;

    /**
     * Private readonly computed signal: _viewDataContent.
     *
     * It holds the content (svg sheets, folio convolutes and textcritics) of the sheets view data.
     */
    private readonly _viewDataContent = computed(() => this.viewData()?.data);

    /**
     * Readonly signal: isFirstPageLoad.
     *
     * It holds the information if the page is loaded for the first time.
     */
    readonly isFirstPageLoad = signal<boolean>(true);

    /**
     * Readonly signal: isSheetFacetMinimized.
     *
     * It holds the toggle state of the sheet facet.
     */
    readonly isSheetFacetMinimized = signal<boolean>(false);

    /**
     * Private readonly computed signal: _selectedSheetContext.
     *
     * It holds the svg sheet (with its edition type) selected by the sheet id of the route.
     * It is the single source of all other signals concerning the selected svg sheet.
     * It keeps its reference as long as the same content of the same sheet is selected.
     */
    private readonly _selectedSheetContext = computed<EditionSvgSheetContext | undefined>(
        () => {
            const sheets = this._viewDataContent()?.svgSheetsData?.sheets;

            return sheets ? EDITION_SHEETS_UTILS.findSvgSheet(sheets, this._sheetIdFromRoute()) : undefined;
        },
        {
            equal: (a, b) =>
                a?.selection.fullId === b?.selection.fullId && a?.selection.content === b?.selection.content,
        }
    );

    /**
     * Readonly computed signal: selectedSvgSheet.
     *
     * It holds the svg sheet selected by the sheet id of the route
     * (id, full id and selected content).
     */
    readonly selectedSvgSheet = computed<EditionSvgSheetSelection | undefined>(
        () => this._selectedSheetContext()?.selection
    );

    /**
     * Readonly computed signal: selectedConvolute.
     *
     * It holds the folio convolute of the selected svg sheet.
     */
    readonly selectedConvolute = computed<FolioConvolute | undefined>(() => {
        const context = this._selectedSheetContext();
        const convolutes = this._viewDataContent()?.folioConvoluteData?.convolutes;

        return context && convolutes
            ? EDITION_SHEETS_UTILS.findConvolute(convolutes, context.selection, context.editionType)
            : undefined;
    });

    /**
     * Readonly computed signal: selectedTextcritics.
     *
     * It holds the textcritics of the selected svg sheet
     * with the commentary filtered for the selected tkk overlays
     * (a missing or empty commentary stays as it is).
     */
    readonly selectedTextcritics = computed<Textcritics | undefined>(() => {
        const selection = this.selectedSvgSheet();
        const textcriticsList = this._viewDataContent()?.textcriticsData?.textcritics;
        const textcritics =
            selection && textcriticsList
                ? EDITION_SHEETS_UTILS.findTextcritics(textcriticsList, selection.id)
                : undefined;

        return textcritics
            ? {
                  ...textcritics,
                  commentary: EDITION_SHEETS_UTILS.filterCommentaryForOverlays(
                      textcritics.commentary,
                      this.selectedTkkOverlays()
                  ),
              }
            : undefined;
    });

    /**
     * Readonly linked signal: selectedTkkOverlays.
     *
     * It holds the selected tkk overlays of the selected svg sheet.
     * It is reset to an empty array whenever the selected svg sheet changes.
     */
    readonly selectedTkkOverlays = linkedSignal<EditionSvgSheetSelection | undefined, EditionSvgOverlayTkk[]>({
        source: this.selectedSvgSheet,
        computation: () => [],
    });

    /**
     * Constructor of the EditionSheetsComponent.
     *
     * It sets up an effect to navigate to the default svg sheet
     * if no sheet id is given by the route.
     */
    constructor() {
        effect(() => {
            const sheets = this._viewDataContent()?.svgSheetsData?.sheets;
            const complex = this.selectedEditionComplex();

            if (!complex || !sheets) {
                return;
            }

            if (!this._sheetIdFromRoute()) {
                const defaultSheetId = EDITION_SHEETS_UTILS.getDefaultSheetId(sheets);
                this._selectSvgSheet({ complexId: '', sheetId: defaultSheetId });
            }

            this.isFirstPageLoad.set(false);
        });
    }

    /**
     *
     * Public method: onSheetBrowse.
     *
     * It evaluates the id of the previous or next SVG sheet
     * of the same edition type based on the given direction
     * and selects it with _selectSvgSheet.
     *
     * @param {1 | -1} direction The given direction: -1 for previous and 1 for next.
     * @returns {void} Evaluates the sheet id to be selected with _selectSvgSheet.
     */
    onSheetBrowse(direction: 1 | -1): void {
        const context = this._selectedSheetContext();
        const sheets = this._viewDataContent()?.svgSheetsData?.sheets;

        if (!context || !sheets) {
            return;
        }

        const nextSheetId = EDITION_SHEETS_UTILS.getNextSheetId(
            sheets[context.editionType],
            context.selection.fullId,
            direction
        );

        this._selectSvgSheet({ complexId: '', sheetId: nextSheetId });
    }

    /**
     * Public method: onLinkBoxSelect.
     *
     * It finds the target SVG sheet of a link box and selects it.
     *
     * @param {string} linkBoxId The given link box id.
     * @returns {void} Finds and selects the target SVG sheet of a link box.
     */
    onLinkBoxSelect(linkBoxId: string): void {
        const linkTo = this.selectedTextcritics()?.linkBoxes?.find(linkBox => linkBox.svgGroupId === linkBoxId)?.linkTo;

        if (linkTo) {
            this._selectSvgSheet(linkTo);
        }
    }

    /**
     * Public method: onOverlaySelect.
     *
     * It sets the selected tkk overlays
     * (that filter the commentary of the displayed textcritics).
     *
     * @param {EditionSvgOverlayTkk[]} overlays The given tkk overlays.
     * @returns {void} Sets the selectedTkkOverlays signal.
     */
    onOverlaySelect(overlays: EditionSvgOverlayTkk[]): void {
        this.selectedTkkOverlays.set(overlays);
    }

    /**
     * Private method: _selectSvgSheet.
     *
     * It delegates the navigation to the given sheet navigation target
     * directly to the {@link EditionNavigationService}.
     *
     * @param {EditionNavigationSheetTarget} sheetTarget The given sheet navigation target.
     * @returns {void} Navigates to the selected SVG sheet.
     */
    private _selectSvgSheet(sheetTarget: EditionNavigationSheetTarget): void {
        if (!sheetTarget.sheetId) {
            return;
        }
        this._navigationService.navigateToSvgSheet(sheetTarget);
    }
}
