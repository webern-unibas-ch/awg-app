/**
 * The TkaTableHeaderColumn interface.
 *
 * It is used in the context of the edition view
 * to store the data for a tka table header column.
 */
export interface TkaTableHeaderColumn {
    /**
     * The reference of the header column.
     */
    ref: string;

    /**
     * The label of the header column.
     */
    label: string;
}

/**
 * Object constant: TKA_TABLE_HEADERS.
 *
 * It is used in the context of the TkA tables.
 */
export const TKA_TABLE_HEADERS: Record<string, TkaTableHeaderColumn[]> = {
    default: [
        { ref: 'measure', label: 'Takt' },
        { ref: 'system', label: 'System' },
        { ref: 'location', label: 'Ort im Takt' },
        { ref: 'comment', label: 'Anmerkung' },
    ],
    corrections: [
        { ref: 'measure', label: 'Takt' },
        { ref: 'system', label: 'System' },
        { ref: 'location', label: 'Ort im Takt' },
        { ref: 'comment', label: 'Korrektur' },
    ],
    rowtable: [
        { ref: 'measure', label: 'Folio' },
        { ref: 'system', label: 'System' },
        { ref: 'location', label: 'Reihe/Reihenton' },
        { ref: 'comment', label: 'Anmerkung' },
    ],
};
