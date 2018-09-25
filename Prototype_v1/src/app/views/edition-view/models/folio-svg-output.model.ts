import { FolioSvgPoint } from './folio-svg-point.model';
import { FolioSvgLine } from './folio-svg-line.model';
import {
    FolioCalculationItem,
    FolioCalculationSheet,
    FolioCalculationSystems,
    FolioCalculation
} from './folio-calculation.model';


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


export class FolioSvgOutput {
    sheet: FolioSvgOutputSheet;
    systems: FolioSvgOutputSystems;
    itemsArray: FolioSvgOutputItem[];

    constructor(calculation: FolioCalculation) {
        this.sheet = this.getSheet(calculation.sheet);
        this.systems = this.getSystems(calculation.systems);
        this.itemsArray = this.getItemsArray(calculation.itemsArray);
    }


    getSheet(calculatedSheet: FolioCalculationSheet): FolioSvgOutputSheet {
        let outputSheet = new FolioSvgOutputSheet();

        return outputSheet = {
            folio: calculatedSheet.folioId,
            upperLeftCorner: calculatedSheet.upperLeftCorner,
            lowerRightCorner: calculatedSheet.lowerRightCorner
        };
    }


    getSystems(calculatedSytems: FolioCalculationSystems): FolioSvgOutputSystems {
        let outputSystems = new FolioSvgOutputSystems();

        return outputSystems = {
            lineLabelArray: calculatedSytems.lineLabelArray,
            lineArrays: calculatedSytems.lineArrays
        };
    }

    getItemsArray(calculatedItems: FolioCalculationItem[]): FolioSvgOutputItem[] {
        const outputItemsArray: FolioSvgOutputItem[] = [];

        calculatedItems.forEach((calculatedItem: FolioCalculationItem) => {
            let outputItem = new FolioSvgOutputItem();

            outputItem = {
                sigle: calculatedItem.sigle,
                measure: calculatedItem.measure,
                upperLeftCorner: calculatedItem.current.corner.upperLeft,
                width: calculatedItem.width,
                height: calculatedItem.height,
                lineArray: calculatedItem.lineArray
            };

            outputItemsArray.push(outputItem);
        });
        return outputItemsArray;
    }

}
