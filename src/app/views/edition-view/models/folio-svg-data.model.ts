import {
    FolioCalculationPoint,
    FolioCalculationLine,
    FolioCalculationContentItem,
    FolioCalculationSheet,
    FolioCalculationSystems,
    FolioCalculation
} from './folio-calculation.model';

export class FolioSvgSheet {
    folioId: string;
    upperLeftCorner: FolioCalculationPoint;
    lowerRightCorner: FolioCalculationPoint;

    constructor(calculatedSheet: FolioCalculationSheet) {
        this.folioId = calculatedSheet.folioId;
        this.upperLeftCorner = calculatedSheet.upperLeftCorner;
        this.lowerRightCorner = calculatedSheet.lowerRightCorner;
    }
}

export class FolioSvgSystems {
    lineLabelArray: FolioCalculationPoint[];
    lineArrays: FolioCalculationLine[][];

    constructor(calculatedSystems: FolioCalculationSystems) {
        this.lineLabelArray = calculatedSystems.lineLabelArray;
        this.lineArrays = calculatedSystems.lineArrays;
    }
}

export class FolioSvgContentItem {
    sigle: string;
    measure: string;
    upperLeftCorner: FolioCalculationPoint;
    width: number;
    height: number;
    lineArray: FolioCalculationLine[];

    constructor(calculatedContentItem: FolioCalculationContentItem) {
        this.sigle = calculatedContentItem.sigle;
        this.measure = calculatedContentItem.measure;
        this.upperLeftCorner = calculatedContentItem.current.corner.upperLeft;
        this.width = calculatedContentItem.width;
        this.height = calculatedContentItem.height;
        this.lineArray = calculatedContentItem.lineArray;
    }
}

export class FolioSvgContentItems {
    contentItems: FolioSvgContentItem[];

    constructor(calculatedContentItems: FolioCalculationContentItem[]) {
        this.contentItems = [];
        calculatedContentItems.forEach((calculatedContentItem: FolioCalculationContentItem) => {
            this.contentItems.push(new FolioSvgContentItem(calculatedContentItem));
        });
    }
}

export class FolioSvgData {
    sheet: FolioSvgSheet;
    systems: FolioSvgSystems;
    contentItemsArray: FolioSvgContentItems;

    constructor(calculation: FolioCalculation) {
        this.sheet = new FolioSvgSheet(calculation.sheet);
        this.systems = new FolioSvgSystems(calculation.systems);
        this.contentItemsArray = new FolioSvgContentItems(calculation.contentItemsArray);
    }
}
