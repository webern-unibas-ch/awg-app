import { FolioDataSection } from './folio-data-section.model';

export class FolioDataItems {
    sigle: string;
    measure: string;
    numberOfSections?: number;
    sections?: [ FolioDataSection ];
}
