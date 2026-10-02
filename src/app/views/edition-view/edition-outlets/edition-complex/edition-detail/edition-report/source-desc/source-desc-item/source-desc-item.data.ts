import { SourceDescDetails } from '@awg-views/edition-view/models/source-desc.model';

/**
 * Object constant: SOURCE_DESC_DETAILS.
 *
 * It is used in the context of the source description items
 * to keep the configuration of the simple details sections
 * of the physical description in the order of their display.
 */
export const SOURCE_DESC_DETAILS: readonly Omit<SourceDescDetails, 'details'>[] = [
    { key: 'titles', label: 'Titel', cssClass: 'titles' },
    { key: 'dates', label: 'Datierung', cssClass: 'dates' },
    { key: 'paginations', label: 'Paginierung', cssClass: 'paginations' },
    { key: 'measureNumbers', label: 'Taktzahlen', cssClass: 'measure-numbers' },
    { key: 'instrumentations', label: 'Instrumentenvorsatz', cssClass: 'instrumentations' },
    { key: 'annotations', label: 'Eintragungen', cssClass: 'annotations' },
];
