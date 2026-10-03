/**
 * The EDITION_SHEET_VIEWER_SUPPLIED_CLASS_LABELS constant.
 *
 * It holds the display labels of the supplied classes of an svg sheet
 * (supplied classes without a label are displayed by their class name).
 */
export const EDITION_SHEET_VIEWER_SUPPLIED_CLASS_LABELS: ReadonlyMap<string, string> = new Map([
    ['foliation', 'Blattangabe'],
    ['staffN', 'Systemangabe'],
    ['measureN', 'Taktzahlen'],
    ['clef', 'Schlüssel'],
    ['clef_key', 'Schlüssel mit Tonart'],
    ['key', 'Tonart'],
    ['accid', 'Akzidenzien'],
    ['hyphen', 'Silbentrennung'],
]);

/**
 * The EditionSheetViewerAdditionsPanelChange interface.
 *
 * It represents the requested visibility change of a single editorial addition
 * of the svg sheet (a supplied class or the tkk overlays).
 */
export interface EditionSheetViewerAdditionsPanelChange {
    /**
     * The key of the editorial addition (supplied class name or `EditionSvgOverlayTypes.tkk`).
     */
    key: string;

    /**
     * The requested visibility of the editorial addition.
     */
    isVisible: boolean;
}
