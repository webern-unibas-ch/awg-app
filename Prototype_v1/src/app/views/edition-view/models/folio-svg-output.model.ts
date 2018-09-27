import { FolioSvgPoint } from './folio-svg-point.model';
import { FolioSvgLine } from './folio-svg-line.model';
import {
    FolioCalculationContentItem,
    FolioCalculationSheet,
    FolioCalculationSystems,
    FolioCalculation
} from './folio-calculation.model';


export class ConvoluteFolioSvgFolio {
    folioId: string;
    upperLeftCorner: FolioSvgPoint;
    lowerRightCorner: FolioSvgPoint;
}

export class ConvoluteFolioSvgSystems {
    lineLabelArray: FolioSvgPoint[];
    lineArrays: FolioSvgLine[][];
}

export class ConvoluteFolioSvgContentItem {
    sigle: string;
    measure: string;
    upperLeftCorner: FolioSvgPoint;
    width: number;
    height: number;
    lineArray: FolioSvgLine[];
}


export class ConvoluteFolioSvgOutput {
    sheet: ConvoluteFolioSvgFolio;
    systems: ConvoluteFolioSvgSystems;
    contentItemsArray: ConvoluteFolioSvgContentItem[];

    constructor(calculation: FolioCalculation) {
        this.sheet = this.getSheet(calculation.sheet);
        this.systems = this.getSystems(calculation.systems);
        this.contentItemsArray = this.getContentItemsArray(calculation.itemsArray);
    }


    getSheet(calculatedSheet: FolioCalculationSheet): ConvoluteFolioSvgFolio {
        let outputSheet = new ConvoluteFolioSvgFolio();

        return outputSheet = {
            folioId: calculatedSheet.folioId,
            upperLeftCorner: calculatedSheet.upperLeftCorner,
            lowerRightCorner: calculatedSheet.lowerRightCorner
        };
    }


    getSystems(calculatedSytems: FolioCalculationSystems): ConvoluteFolioSvgSystems {
        let outputSystems = new ConvoluteFolioSvgSystems();

        return outputSystems = {
            lineLabelArray: calculatedSytems.lineLabelArray,
            lineArrays: calculatedSytems.lineArrays
        };
    }

    getContentItemsArray(calculatedContentItems: FolioCalculationContentItem[]): ConvoluteFolioSvgContentItem[] {
        const outputContentItemsArray: ConvoluteFolioSvgContentItem[] = [];

        calculatedContentItems.forEach((calculatedContentItem: FolioCalculationContentItem) => {
            let outputContentItem = new ConvoluteFolioSvgContentItem();

            outputContentItem = {
                sigle: calculatedContentItem.sigle,
                measure: calculatedContentItem.measure,
                upperLeftCorner: calculatedContentItem.current.corner.upperLeft,
                width: calculatedContentItem.width,
                height: calculatedContentItem.height,
                lineArray: calculatedContentItem.lineArray
            };

            outputContentItemsArray.push(outputContentItem);
        });
        return outputContentItemsArray;
    }

}
