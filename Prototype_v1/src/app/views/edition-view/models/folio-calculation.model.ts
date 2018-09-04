import { FolioSvgPoint } from './folio-svg-point.model';
import { FolioDataSection } from './folio-data-section.model';
import { FolioSvgLine } from './folio-svg-line.model';


export class FolioCalculationItemCorner {
    upperLeft: FolioSvgPoint;
    lowerLeft: FolioSvgPoint;
    upperRight: FolioSvgPoint;
    lowerRight: FolioSvgPoint;
}


export class FolioCalculationItemsCache {
    section: FolioDataSection;
    corner: FolioCalculationItemCorner;
}


export class FolioCalculationItems {
    offsetCorrection: number;
    widthWithOffset: number;
    width: number;
    height: number;
    systemRange: number;
    startXIndex: number;
    startYIndex: number;
    startX: number;
    endX: number;
    startY: number;
    endY: number;
    lineArray: FolioSvgLine[];
    current: FolioCalculationItemsCache;
    previous: FolioCalculationItemsCache;
}


export class FolioCalculationSheet {
    offset: FolioSvgPoint;
    width: number;
    height: number;
}

export class FolioCalculationSystems {
    width: number;
    leftMargin: number;
    rightMargin: number;
    upperMargin: number;
    margins: number;
    startX: number;
    endX: number;
    startY: number;
    yArray: number[][];
    labelStartX: number;
    labelOffsetCorrection: number;
}


export class FolioCalculation {
    numberOfSystems: number;
    sheet: FolioCalculationSheet;
    systems: FolioCalculationSystems;
    items: FolioCalculationItems;
}
