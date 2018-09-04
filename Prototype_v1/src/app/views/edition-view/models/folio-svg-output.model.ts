import { FolioSvgOutputItem } from './folio-svg-output-item.model';
import { FolioSvgOutputSheet } from './folio-svg-output-sheet.model';
import { FolioSvgOutputSystems } from './folio-svg-output-systems.model';

export class FolioSvgOutput {
    sheet : FolioSvgOutputSheet;
    systems: FolioSvgOutputSystems;
    itemsArray: FolioSvgOutputItem[];

    constructor(sheet: FolioSvgOutputSheet, systems: FolioSvgOutputSystems, itemsArray: FolioSvgOutputItem[]) {
        this.sheet = sheet;
        this.systems = systems;
        this.itemsArray = itemsArray;
    }
}
