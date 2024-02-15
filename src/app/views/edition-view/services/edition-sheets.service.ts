import { Injectable } from '@angular/core';

import {
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    FolioConvolute,
    TextcriticalComment,
    Textcritics,
} from '@awg-views/edition-view/models';

/**
 * The Edition sheets service.
 *
 * It handles the provision of the current edition complex and
 * of the textcritical comments for a selected overlay item.
 *
 * Provided in: `root`.
 * @used in the {@link EditionSheetsComponent}.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionSheetsService {
    /**
     * Public method: findTextcritics.
     *
     * It finds the textcritics for a selected SVG sheet.
     *
     * @param {Textcritics[]} textcriticsArray The given textcritics array.
     * @param {EditionSvgSheet} selectedSheet The given selected SVG sheet.
     *
     * @returns {Textcritics} The textcritics that were found.
     */
    findTextcritics(
        textcriticsArray: Textcritics[] | undefined,
        selectedSheet: EditionSvgSheet | undefined
    ): Textcritics {
        if (!textcriticsArray || !selectedSheet) {
            return new Textcritics();
        }

        // Find the textcritics for the selected SVG sheet id in textcriticsData.textcritics array
        const textcritics = textcriticsArray.find(textcritic => textcritic.id === selectedSheet.id);

        // Return the textcritics with the given id or empty object if no comments were found
        return textcritics || new Textcritics();
    }

    /**
     * Public method: getCurrentEditionType.
     *
     * It returns the current edition type of the selected SVG sheet.
     *
     * @param {EditionSvgSheet} selectedSvgSheet The given selected SVG sheet.
     * @param {EditionSvgSheetList['sheets']} sheets The given array of objects representing the available SVG sheets.
     *
     * @returns {keyof EditionSvgSheetList['sheets'] | undefined} A string representing the current edition type, or undefined if not found.
     */
    getCurrentEditionType(
        selectedSvgSheet: EditionSvgSheet,
        sheets: EditionSvgSheetList['sheets']
    ): keyof EditionSvgSheetList['sheets'] | undefined {
        const selectedSheetContent = selectedSvgSheet?.content?.[0];
        const partial = selectedSheetContent?.partial;
        const sheetId = partial ? selectedSvgSheet.id + partial : selectedSvgSheet.id;

        const editionType = Object.keys(sheets).find(
            type => this._findSvgSheetIndexById(sheets[type], sheetId) >= 0
        ) as keyof EditionSvgSheetList['sheets'] | undefined;

        return editionType;
    }

    /**
     * Public method: getNextSheetId
     *
     * Returns the next sheet id in the specified direction, given a selected sheet and a list of sheets.
     *
     * @param {number} direction A number indicating the direction of navigation. -1 for previous and 1 for next.
     * @param {EditionSvgSheet} selectedSheet The given selected sheet.
     * @param {EditionSvgSheet[]} sheetArray The given EditionSvgSheet array.
     *
     * @returns {string} The id of the next sheet in the specified direction.
     **/
    getNextSheetId(direction: number, selectedSheet: EditionSvgSheet, sheetArray: EditionSvgSheet[]): string {
        const partial = selectedSheet?.content?.[0]?.partial;
        const currentSheetId = selectedSheet.id + (partial || '');
        const currentSheetIndex = this._findSvgSheetIndexById(sheetArray, selectedSheet.id);

        if (partial) {
            return this._findNextSheetIdForPartialSheet(
                direction,
                sheetArray,
                currentSheetIndex,
                currentSheetId,
                partial
            );
        } else {
            return this._findNextSheetIdForNonPartialSheet(direction, sheetArray, currentSheetIndex, currentSheetId);
        }
    }

    /**
     * Public method: getTextcriticalCommentsForOverlays.
     *
     * It provides the textcritical comments for the selected svg overlays.
     *
     * @param {TextcriticalComment[]} textcriticalComments The given textcritical comments.
     * @param {EditionSvgOverlay[]} overlays The given svg overlays.
     * @returns {TextcriticalComment[]} Array with filtered textcritical comments.
     */
    getTextcriticalCommentsForOverlays(
        textcriticalComments: TextcriticalComment[],
        overlays: EditionSvgOverlay[]
    ): TextcriticalComment[] {
        if (!textcriticalComments || !overlays) {
            return [];
        }
        return textcriticalComments.filter(comment => overlays.some(overlay => comment.svgGroupId === overlay.id));
    }

    /**
     * Public method: selectConvolute.
     *
     * It selects a FolioConvolute based on the currently selected sheet and edition type.
     *
     * @param {FolioConvolute[]} convolutes The given folio convolutes.
     * @param {EditionSvgSheetList['sheets']} sheets The given sheets object.
     * @param {EditionSvgSheet} selectedSheet The given selected sheet.
     *
     * @returns {FolioConvolute} The convolute that was found, or undefined.
     */
    selectConvolute(
        convolutes: FolioConvolute[],
        sheets: EditionSvgSheetList['sheets'],
        selectedSheet: EditionSvgSheet
    ): FolioConvolute {
        if (!convolutes || !sheets || !selectedSheet) {
            return undefined;
        }

        console.log('convolutes', convolutes);
        console.log('sheets', sheets);
        console.log('selectedSheet', selectedSheet);

        const editionType = this.getCurrentEditionType(selectedSheet, sheets);
        const convoluteId = editionType === 'sketchEditions' ? '' : ''; // SelectedSheet.convolute;

        return this._findConvoluteById(convolutes, convoluteId);
    }

    /**
     * Public method: selectSvgSheetById.
     *
     * It selects an SVG sheet from a given sheets object by a given id.
     *
     * @param {EditionSvgSheetList['sheets']} sheets The given sheets object.
     * @param {string} id The given id.
     *
     * @returns {EditionSvgSheet} The sheet that was found.
     */
    selectSvgSheetById(sheets: EditionSvgSheetList['sheets'], id: string): EditionSvgSheet {
        if (!sheets || !id) {
            return new EditionSvgSheet();
        }

        const indexes = {
            workEditions: this._findSvgSheetIndexById(sheets.workEditions, id),
            textEditions: this._findSvgSheetIndexById(sheets.textEditions, id),
            sketchEditions: this._findSvgSheetIndexById(sheets.sketchEditions, id),
        };

        for (const [type, index] of Object.entries(indexes)) {
            if (index < 0) {
                continue;
            }

            const sheet = this._getSheetWithPartialContentById(sheets[type], index, id);
            return sheet;
        }

        return new EditionSvgSheet();
    }

    /**
     * Private method: _findConvoluteById.
     *
     * It finds a convolute with a given id in a given convolute array.
     *
     * @param {FolioConvolute[]} folioConvolutes The given folio convolutes input.
     * @param {string} id The given id input.
     *
     * @returns {FolioConvolute} The convolute that was found, or undefined.
     */
    private _findConvoluteById(folioConvolutes: FolioConvolute[], id: string): FolioConvolute {
        // Find the convolute with the given id in folioConvoluteData.convolutes array
        const convolute = folioConvolutes.find(conv => conv.convoluteId === id);

        // If the convolute is found, return it; otherwise, return undefined
        return convolute;
    }

    /**
     * Private method: _findNextSheetIdForPartialSheet
     *
     * It finds the id of the next sheet of a given sheet array in the specified direction
     * when the selected sheet is a partial sheet.
     *
     * @param {number} direction A number indicating the direction of navigation. -1 for previous and 1 for next.
     * @param {EditionSvgSheet[]} sheetArray The given EditionSvgSheet array.
     * @param {number} currentSheetIndex The index of the currently selected sheet in the sheets array.
     * @param {string} currentSheetId The id of the currently selected sheet.
     * @param {string} partial The partial id of the currently selected sheet.
     *
     * @returns {string}    The id of the next partial sheet in the specified direction,
     *                      otherwise tries to get the next sheed id for non-partial sheets.
     **/
    private _findNextSheetIdForPartialSheet(
        direction: number,
        sheetArray: EditionSvgSheet[],
        currentSheetIndex: number,
        currentSheetId: string,
        partial: string
    ): string {
        const currentSheet = sheetArray[currentSheetIndex];
        const currentContentIndex = currentSheet.content.findIndex(content => content.partial === partial);
        const nextContentIndex = currentContentIndex + direction;

        if (nextContentIndex >= 0 && nextContentIndex < currentSheet.content?.length) {
            const nextSheetId = currentSheet.id + currentSheet.content[nextContentIndex].partial;
            return nextSheetId;
        } else {
            return this._findNextSheetIdForNonPartialSheet(direction, sheetArray, currentSheetIndex, currentSheetId);
        }
    }

    /**
     * Private method: _findNextSheetIdForNonPartialSheet
     *
     * It finds the id of the next sheet of a given sheet array in the specified direction
     * when the selected sheet is not a partial sheet.
     *
     * @param {number} direction A number indicating the direction of navigation. -1 for previous and 1 for next.
     * @param {EditionSvgSheet[]} sheetArray The given EditionSvgSheet array.
     * @param {number} currentSheetIndex The index of the currently selected sheet in the sheets array.
     * @param {string} currentSheetId The id of the currently selected sheet.
     *
     * @returns {string}    The id of the next sheet in the specified direction if there is one,
     *                      otherwise the currentSheetId.
     **/
    private _findNextSheetIdForNonPartialSheet(
        direction: number,
        sheetArray: EditionSvgSheet[],
        currentSheetIndex: number,
        currentSheetId: string
    ): string {
        const nextIndex = currentSheetIndex + direction;

        if (nextIndex >= 0 && nextIndex < sheetArray.length) {
            const nextSheet = sheetArray[nextIndex];
            const nextContentIndex = direction > 0 ? 0 : nextSheet.content.length - 1;
            const nextSheetId = nextSheet.id + (nextSheet.content[nextContentIndex]?.partial || '');
            return nextSheetId;
        } else {
            return currentSheetId;
        }
    }

    /**
     * Private method: _findSvgSheetIndex.
     *
     * It finds the index of an SVG sheet in a given array of sheets.
     *
     * @param {EditionSvgSheet[]} sheetArray The given EditionSvgSheet array.
     * @param {string} id The given id.
     *
     * @returns {number} The index of the sheet in the array.
     */
    private _findSvgSheetIndexById(sheetArray: EditionSvgSheet[], id: string): number {
        return sheetArray.findIndex(sheet => {
            let sheetId = sheet.id;
            // If we have partial sheets, look into content array for id with extra partial
            if (sheet.content.length > 1) {
                const partialIndex = this._findSvgSheetPartialIndexById(sheet, id);
                if (partialIndex >= 0) {
                    sheetId += sheet.content[partialIndex].partial;
                }
            }
            return sheetId === id;
        });
    }

    /**
     * Private method: _findSvgSheetPartialIndex.
     *
     * It checks if a given id includes an SVG sheet partial and returns its index.
     *
     * @param {EditionSvgSheet} sheet The given sheet.
     * @param {string} id The given id.
     *
     * @returns {number} The index of the sheet partial in the sheet.
     */
    private _findSvgSheetPartialIndexById(sheet: EditionSvgSheet, id: string): number {
        return sheet.content.findIndex(content => sheet.id + content.partial === id);
    }

    /**
     * Private method: _getSheetWithPartialContentById.
     *
     * It gets an SVG sheet and its content identified by its (partial) id within a given array of sheets.
     *
     * @param {EditionSvgSheet[]} sheetArray The given EditionSvgSheet array.
     * @param {number} sheetIndex The index of the sheet in the array.
     * @param {string} id The given id.
     *
     * @returns {EditionSvgSheet} The sheet that was found.
     */
    private _getSheetWithPartialContentById(
        sheetArray: EditionSvgSheet[],
        sheetIndex: number,
        id: string
    ): EditionSvgSheet {
        const sheet = { ...sheetArray[sheetIndex] };

        const partialIndex = this._findSvgSheetPartialIndexById(sheet, id);

        if (partialIndex >= 0) {
            sheet.content = [sheet.content[partialIndex]];
        }

        return sheet;
    }
}
