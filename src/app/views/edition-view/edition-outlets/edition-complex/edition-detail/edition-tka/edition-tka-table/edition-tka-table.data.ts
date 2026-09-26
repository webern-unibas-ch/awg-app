import { TkaTableHeaderColumn } from '@awg-views/edition-view/models/tka-table-header.model';

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
