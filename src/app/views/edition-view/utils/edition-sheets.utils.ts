/**
 * Utilities for edition svg sheets.
 *
 * They select svg sheets (incl. partials), their edition type, convolute and textcritics,
 * and evaluate the sheet ids to navigate to, as pure functions.
 */
import { UTILS } from '@awg-shared/utils/object-utils';

import { EditionSvgOverlayTkk } from '../models/edition-svg-overlay.model';
import {
    EditionSvgSheet,
    EditionSvgSheetContent,
    EditionSvgSheetContext,
    EditionSvgSheetSelection,
    EditionSvgSheetsList,
} from '../models/edition-svg-sheets.model';
import { EDITION_TYPE_KEYS, EditionTypeKey } from '../models/edition-type.model';
import { FolioConvolute } from '../models/folio.model';
import { TextcriticalCommentary, Textcritics } from '../models/textcritics.model';

/**
 * Function: toFullSheetId.
 *
 * It joins a given sheet id and an (optional) partial id to the full sheet id
 * (as used in the URL).
 *
 * @param {string | undefined} id The given sheet id.
 * @param {string} [partial] The given (optional) partial id.
 *
 * @returns {string} The full sheet id.
 */
export function toFullSheetId(id: string | undefined, partial?: string): string {
    return `${id ?? ''}${partial ?? ''}`;
}

/**
 * Function: getFullSheetIds.
 *
 * It gets all full sheet ids of a given svg sheet (one per partial).
 *
 * @param {EditionSvgSheet} sheet The given svg sheet.
 *
 * @returns {string[]} The full sheet ids of the svg sheet.
 */
export function getFullSheetIds(sheet: EditionSvgSheet): string[] {
    const fullIds = sheet.content.map(content => toFullSheetId(sheet.id, content.partial));

    return fullIds.length > 0 ? [...new Set(fullIds)] : [sheet.id];
}

/**
 * Function: toSvgSheetSelection.
 *
 * It creates the selection of a given svg sheet with a given (selected) content.
 *
 * @param {EditionSvgSheet} sheet The given svg sheet.
 * @param {EditionSvgSheetContent} content The given selected content (partial) of the svg sheet.
 *
 * @returns {EditionSvgSheetSelection} The selection of the svg sheet.
 */
export function toSvgSheetSelection(sheet: EditionSvgSheet, content: EditionSvgSheetContent): EditionSvgSheetSelection {
    return { id: sheet.id, fullId: toFullSheetId(sheet.id, content.partial), content };
}

/**
 * Function: findSvgSheet.
 *
 * It finds the selection of an svg sheet and its edition type by a given full sheet id.
 * A full sheet id with partial selects the given partial;
 * a plain sheet id selects the first content (partial) of the sheet.
 * A sheet without content cannot be selected.
 *
 * @param {EditionSvgSheetsList['sheets']} sheets The given sheets object.
 * @param {string} fullId The given full sheet id.
 *
 * @returns {EditionSvgSheetContext | undefined} The selection of the found svg sheet and its edition type, or undefined.
 */
export function findSvgSheet(
    sheets: EditionSvgSheetsList['sheets'],
    fullId: string
): EditionSvgSheetContext | undefined {
    if (!fullId) {
        return undefined;
    }

    for (const editionType of EDITION_TYPE_KEYS) {
        const sheetArray = sheets[editionType];

        // Validate that expected edition types exist
        if (!sheetArray) {
            console.error(`[EditionSheetsUtils]: Missing edition type in svg-sheets.json: ${editionType}`);
            continue;
        }

        for (const sheet of sheetArray) {
            const content =
                sheet.id === fullId
                    ? sheet.content[0]
                    : sheet.content.find(
                          sheetContent =>
                              sheetContent.partial && toFullSheetId(sheet.id, sheetContent.partial) === fullId
                      );

            if (content) {
                return { selection: toSvgSheetSelection(sheet, content), editionType };
            }
        }
    }

    return undefined;
}

/**
 * Function: getDefaultSheetId.
 *
 * It gets the full id of the default svg sheet,
 * i.e. the first text edition or, as fallback, the first sketch edition.
 *
 * @param {EditionSvgSheetsList['sheets']} sheets The given sheets object.
 *
 * @returns {string} The full id of the default svg sheet, or an empty string.
 */
export function getDefaultSheetId(sheets: EditionSvgSheetsList['sheets']): string {
    const defaultSheet = sheets.textEditions?.[0] ?? sheets.sketchEditions?.[0];

    return defaultSheet ? getFullSheetIds(defaultSheet)[0] : '';
}

/**
 * Function: getNextSheetId.
 *
 * It gets the full id of the previous or next svg sheet (incl. partials)
 * of a given sheet array in the given direction.
 *
 * @param {EditionSvgSheet[]} sheetArray The given svg sheet array.
 * @param {string} currentFullId The full id of the currently selected svg sheet.
 * @param {1 | -1} direction The given direction (-1 for previous, 1 for next).
 *
 * @returns {string} The full id of the previous or next svg sheet,
 * or the current full id if there is none.
 */
export function getNextSheetId(sheetArray: EditionSvgSheet[], currentFullId: string, direction: 1 | -1): string {
    const fullIds = sheetArray.flatMap(getFullSheetIds);
    const currentIndex = fullIds.indexOf(currentFullId);

    if (currentIndex < 0) {
        return currentFullId;
    }

    return fullIds[currentIndex + direction] ?? currentFullId;
}

/**
 * Function: findTextcritics.
 *
 * It finds the textcritics of an svg sheet by a given sheet id.
 *
 * @param {Textcritics[]} textcritics The given textcritics array.
 * @param {string} sheetId The given sheet id.
 *
 * @returns {Textcritics | undefined} The found textcritics, or undefined.
 */
export function findTextcritics(textcritics: Textcritics[], sheetId: string): Textcritics | undefined {
    return textcritics.find(textcritic => textcritic.id === sheetId);
}

/**
 * Function: findConvolute.
 *
 * It finds the folio convolute of a given selected svg sheet.
 * Only sketch editions have a convolute.
 *
 * @param {FolioConvolute[]} convolutes The given folio convolutes.
 * @param {EditionSvgSheetSelection} selection The given selected svg sheet.
 * @param {EditionTypeKey} editionType The edition type of the given selected svg sheet.
 *
 * @returns {FolioConvolute | undefined} The found convolute, or undefined.
 */
export function findConvolute(
    convolutes: FolioConvolute[],
    selection: EditionSvgSheetSelection,
    editionType: EditionTypeKey
): FolioConvolute | undefined {
    if (editionType !== 'sketchEditions') {
        return undefined;
    }

    return convolutes.find(convolute => convolute.convoluteId === selection.content.convolute);
}

/**
 * Function: filterCommentaryForOverlays.
 *
 * It filters the textcritical commentary for the given tkk overlays.
 * A missing or empty commentary is returned as it is.
 *
 * @param {TextcriticalCommentary} commentary The given textcritical commentary.
 * @param {EditionSvgOverlayTkk[]} overlays The given tkk overlays.
 *
 * @returns {TextcriticalCommentary} The filtered textcritical commentary.
 */
export function filterCommentaryForOverlays(
    commentary: TextcriticalCommentary,
    overlays: EditionSvgOverlayTkk[]
): TextcriticalCommentary {
    if (!commentary || UTILS.isEmptyObject(commentary)) {
        return commentary;
    }

    const overlayIds = new Set(overlays.map(overlay => overlay.id));
    const comments = commentary.comments
        .map(block => ({
            ...block,
            blockComments: block.blockComments.filter(
                comment => comment.svgGroupId !== undefined && overlayIds.has(comment.svgGroupId)
            ),
        }))
        .filter(block => block.blockComments.length > 0);

    return { preamble: commentary.preamble, comments };
}

/**
 * Utils constants: EDITION_SHEETS_UTILS.
 *
 * It keeps a namespace reference to the edition sheets utils methods.
 */
export const EDITION_SHEETS_UTILS = {
    filterCommentaryForOverlays,
    findConvolute,
    findSvgSheet,
    findTextcritics,
    getDefaultSheetId,
    getFullSheetIds,
    getNextSheetId,
    toFullSheetId,
    toSvgSheetSelection,
} as const;
