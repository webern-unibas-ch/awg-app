import { FolioSvgPoint } from './folio-svg-point.model';
import { FolioSvgLine } from './folio-svg-line.model';

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


export class FolioSvgOutputSheet {
    folio: string;
    upperLeftCorner: FolioSvgPoint;
    lowerRightCorner: FolioSvgPoint;
}

export class FolioSvgOutputSystems {
    lineLabelArray: FolioSvgPoint[];
    lineArrays: FolioSvgLine[][];
}

export class FolioSvgOutputItem {
    sigle: string;
    measure: string;
    upperLeftCorner: FolioSvgPoint;
    width: number;
    height: number;
    lineArray: FolioSvgLine[];
}
