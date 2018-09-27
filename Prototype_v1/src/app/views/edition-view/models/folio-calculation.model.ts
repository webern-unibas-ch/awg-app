import { FolioSvgPoint } from './folio-svg-point.model';
import { FolioSvgLine } from './folio-svg-line.model';
import { Folio, FolioItems, FolioSection } from './folio.model';
import { FolioFormatOptions } from './folio-format-options.model';


export class FolioCalculationItemCorner {
    upperLeft: FolioSvgPoint;
    lowerLeft: FolioSvgPoint;
    upperRight: FolioSvgPoint;
    lowerRight: FolioSvgPoint;
}


export class FolioCalculationItemCache {
    section: FolioSection;
    corner: FolioCalculationItemCorner;
}


export class FolioCalculationItem {
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
    current: FolioCalculationItemCache;
    previous: FolioCalculationItemCache;
    sigle?: string;
    measure?: string;
}


export class FolioCalculationSheet {
    offset: FolioSvgPoint;
    width: number;
    height: number;
    folioId?: string;
    upperLeftCorner?: FolioSvgPoint;
    lowerRightCorner?: FolioSvgPoint;
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
    lineLabelArray?: FolioSvgPoint[];
    lineArrays?: FolioSvgLine[][];
}


export class FolioCalculation {
    itemsOffsetCorrection: number;
    numberOfSystems: number;
    zoomFactor: number;
    sheet: FolioCalculationSheet;
    systems: FolioCalculationSystems;
    itemsArray: FolioCalculationItem[];

    constructor(options: FolioFormatOptions, folioData: Folio, itemsOffsetCorrection?: number) {
        this.itemsOffsetCorrection = itemsOffsetCorrection ? itemsOffsetCorrection : 0;
        this.numberOfSystems = folioData.systems ? parseInt(folioData.systems, 10) : 0;
        this.zoomFactor = options.factor;

        this.sheet = this.getSheet(options, folioData.folio);
        this.systems = this.getSystems();
        this.itemsArray = this.getItemsArray(folioData.items);
    }


    getSheet(options: FolioFormatOptions, folioID: string): FolioCalculationSheet {
        // init
        const calculatedSheet = new FolioCalculationSheet();

        // set calculated values for offsets (= upper left starting point), width & height
        calculatedSheet.folioId = folioID;
        calculatedSheet.offset = new FolioSvgPoint(options.initialOffsetX, options.initialOffsetY);
        calculatedSheet.width = options.formatX * this.zoomFactor;
        calculatedSheet.height = options.formatY * this.zoomFactor;
        calculatedSheet.upperLeftCorner = calculatedSheet.offset;
        calculatedSheet.lowerRightCorner = new FolioSvgPoint(calculatedSheet.width, calculatedSheet.height);

        return calculatedSheet;
    }


    getSystems(): FolioCalculationSystems {
        // init
        const calculatedSystems = new FolioCalculationSystems();

        // offset correction
        calculatedSystems.labelOffsetCorrection = 4 / this.zoomFactor;       // offsetCorrection for system line labels dependent from zoom factor

        // x-values
        calculatedSystems.leftMargin = this.round(this.sheet.width / 6, 2);               // reserve 1/6 of sheetWidth for left margin
        calculatedSystems.rightMargin = this.round(calculatedSystems.leftMargin * 0.5, 2);     // right margin is 1/2 leftMargin
        calculatedSystems.margins = calculatedSystems.leftMargin + calculatedSystems.rightMargin;      // outer margins

        calculatedSystems.width = this.sheet.width - calculatedSystems.margins;                   // sheet width minus outer margins
        calculatedSystems.startX = this.sheet.upperLeftCorner.x + calculatedSystems.leftMargin;               // begin of sheet plus left margin
        calculatedSystems.endX = calculatedSystems.startX + calculatedSystems.width;                   // begin of system plus its width

        // y-values
        calculatedSystems.upperMargin = this.round(this.sheet.height / (this.numberOfSystems + 2), 2);     // reserve (1 / numberOfSystems plus two empty lines) of sheetHeight as offset
        calculatedSystems.startY = this.sheet.upperLeftCorner.y + calculatedSystems.upperMargin;                          // begin of sheet plus upper margin

        // get y values for systems
        calculatedSystems.yArray = this.getSystemYArray(calculatedSystems.upperMargin, calculatedSystems.startY);

        // system lines
        calculatedSystems.lineArrays = calculatedSystems.yArray.map(lineArray => lineArray.map(line => new FolioSvgLine(new FolioSvgPoint(calculatedSystems.startX, line), new FolioSvgPoint(calculatedSystems.endX, line))));       // line is the y value

        // system numbers (labels)
        calculatedSystems.labelStartX = this.round(calculatedSystems.startX - (calculatedSystems.leftMargin * 3 / 4), 2);   // place numbers 3/4 of left margin in front of system

        // reduce start values with lineLabelOffsetCorrection to get start positions of numbers
        // lineArray[0] = first line of a system
        calculatedSystems.lineLabelArray = calculatedSystems.yArray.map(lineArray =>  (new FolioSvgPoint(calculatedSystems.labelStartX, lineArray[0] - calculatedSystems.labelOffsetCorrection)));

        return calculatedSystems;
    }


    getItemsArray(items: FolioItems[]): FolioCalculationItem[] {
        // init
        const calculatedItems: FolioCalculationItem[] = [];

        // iterate over items
        items.forEach((item: FolioItems, itemIndex: number) => {

            // init
            const calculatedItem: FolioCalculationItem = new FolioCalculationItem();
            calculatedItem.previous = new FolioCalculationItemCache();
            calculatedItem.current = new FolioCalculationItemCache();
            calculatedItem.previous.section = new FolioSection();   // reset prevSection
            calculatedItem.current.section = new FolioSection();     // reset currentSection
            let sectionPartition: number = 1;   // default: 1 section

            // offsetCorrection to avoid collision between items
            calculatedItem.offsetCorrection = this.itemsOffsetCorrection;

            // check if number of sections exist in data; if yes, apply value
            if (item['sectionPartition']) {
                sectionPartition = item['sectionPartition'];
            }

            // check if sections exist
            if (item.sections) {
                // check if sections length is bigger than sectionPartition
                const sectionsLength = item.sections.length;
                if (sectionsLength > sectionPartition) {
                    console.error('Sections array is bigger than sectionPartition');
                    return;
                }
                // iterate over sections
                item.sections.forEach((section: FolioSection, sectionIndex: number) => {
                    // set section cache
                    this.setItemSectionCache(calculatedItem, section);

                    // calculate main values for item
                    this.calculateItemMainValues(calculatedItem, section, sectionPartition, item);

                    // set item corner points
                    calculatedItem.current.corner = this.setItemCornerPoints(calculatedItem);

                    // set item lines
                    calculatedItem.lineArray = this.setItemLineArray(calculatedItem, sectionsLength, sectionIndex, sectionPartition);

                    calculatedItem.sigle = item.sigle;
                    calculatedItem.measure = item.measure;

                    calculatedItems.push(calculatedItem);
                });
            } else {
                console.error('No sections array in item', item);
            }
        });

        return calculatedItems;
    }



    private calculateItemMainValues(calculatedItem: FolioCalculationItem, section: FolioSection, sectionPartition: number, item: FolioItems): void {
        if (!calculatedItem) { return; }

        // itemsWidth
        calculatedItem.widthWithOffset = this.round(this.systems.width / sectionPartition, 2);
        calculatedItem.width = calculatedItem.widthWithOffset - this.itemsOffsetCorrection;   // offsetCorrection to avoid horizontal collision between items

        // itemsHeight
        calculatedItem.systemRange = section.endSystem - section.startSystem + 1;
        calculatedItem.height = this.round(this.systems.upperMargin * calculatedItem.systemRange - this.itemsOffsetCorrection, 2);      // offsetCorrection to avoid vertical collision between items

        // find item start indices
        calculatedItem.startYIndex = section.startSystem - 1;
        calculatedItem.startXIndex = 0 ;
        // check if position exists ...
        if (section.position) {
            const position: number = section.position;
            if (position > sectionPartition) {
                // ... and is bigger than number of sections
                // index remains 0
                console.error('Assuming position 1 because current position is bigger than number of sections for item ', item);
            } else if (sectionPartition > 1) {
                // ... or is smaller or equal to number of sections which is bigger 1
                // than index is position - 1 (positions go from 1, 2, 3 to n)
                calculatedItem.startXIndex = position - 1;
            }
        }
        // for other cases index remains 0 (default)

        // itemsStartX
        // widthWithOffset * startXIndex
        // add half the offsetCorrection to systemStartX to center items
        calculatedItem.startX = this.getItemStart(calculatedItem.widthWithOffset, calculatedItem.startXIndex, this.systems.startX, this.itemsOffsetCorrection / 2);
        calculatedItem.endX = this.round(calculatedItem.startX + calculatedItem.width, 2);

        // itemsStartY
        // subtract half the offsetCorrection from systemStartY to center items
        calculatedItem.startY = this.getItemStart(this.systems.upperMargin, calculatedItem.startYIndex, this.systems.startY,  - this.itemsOffsetCorrection / 2);
        calculatedItem.endY = this.round(calculatedItem.startY + calculatedItem.height, 2);
    }


    private setItemSectionCache(calculatedItem: FolioCalculationItem, section: FolioSection): void {
        if (!calculatedItem) { return; }

        if (calculatedItem.current['section']) {
            calculatedItem.previous.section = calculatedItem.current.section;
            calculatedItem.previous.corner = calculatedItem.current.corner;
        }
        calculatedItem.current.section = section;
    }


    private setItemCornerPoints(calculatedItem: FolioCalculationItem): FolioCalculationItemCorner {
        if (!calculatedItem) { return; }

        const corner: FolioCalculationItemCorner = {
            upperLeft: new FolioSvgPoint(calculatedItem.startX, calculatedItem.startY),
            lowerLeft: new FolioSvgPoint(calculatedItem.startX, calculatedItem.endY),
            upperRight: new FolioSvgPoint(calculatedItem.endX, calculatedItem.startY),
            lowerRight: new FolioSvgPoint(calculatedItem.endX, calculatedItem.endY)
        };
        return corner;
    }


    private setItemLineArray(calculatedItem: FolioCalculationItem, sectionsLength: number, sectionIndex: number, sectionPartition: number): FolioSvgLine[] {
        if (!calculatedItem.current.corner) { return; }

        // init
        const lineArray: FolioSvgLine[] = [];
        const lines: string[] = [];
        const corner = calculatedItem.current.corner;               // shortcut
        const correctionValue = this.itemsOffsetCorrection / 2;     // offset correction value

        // decide which lines to add to array depending on sectionsLength and position in sectionIndex
        if (sectionsLength === 1) {
            // item is a single rectangle => add all 4 lines to line array
            lines.push('uH', 'lH', 'lV', 'rV');
        } else if (sectionsLength > 1) {
            // item is a joint item
            if (sectionIndex === 0) {
                // first item part

                // offset correction
                this.setItemOffsetCorrection(corner.upperRight, correctionValue);
                this.setItemOffsetCorrection(corner.lowerRight, correctionValue);

                // add upper & lower horizontal & left vertical line to line array
                lines.push('uH', 'lH', 'lV');
            } else if (sectionIndex === sectionPartition - 1) {
                // last item part

                // offset correction
                this.setItemOffsetCorrection(corner.upperLeft, -correctionValue);
                this.setItemOffsetCorrection(corner.lowerLeft, -correctionValue);

                // add upper & lower horizontal & right vertical line to line array
                lines.push('uH', 'lH', 'rV');

                // check for connector
                if (sectionIndex > 0) {
                    this.checkForConnectorLine(calculatedItem, lineArray);
                }
            } else if ((sectionIndex > 0) && (sectionIndex < sectionPartition - 1)) {
                // middle item part

                // offset correction
                this.setItemOffsetCorrection(corner.upperRight, correctionValue);
                this.setItemOffsetCorrection(corner.lowerRight, correctionValue);
                this.setItemOffsetCorrection(corner.upperLeft, -correctionValue);
                this.setItemOffsetCorrection(corner.lowerLeft, -correctionValue);

                // add upper and lower horizontal line to line array
                lines.push('uH', 'lH');

                // check for connector
                if (sectionIndex > 0) {
                    this.checkForConnectorLine(calculatedItem, lineArray);

                }
            }
        }

        // create lines
        const upperHorizontalLine = new FolioSvgLine(corner.upperLeft, corner.upperRight);
        const lowerHorizontalLine = new FolioSvgLine(corner.lowerLeft, corner.lowerRight);
        const leftVerticalLine = new FolioSvgLine(corner.upperLeft, corner.lowerLeft);
        const rightVerticalLine = new FolioSvgLine(corner.upperRight, corner.lowerRight);

        lines.forEach((line: string) => {
            switch (line)
            {
                case 'uH':
                    lineArray.push(upperHorizontalLine);
                    break;
                case 'lH':
                    lineArray.push(lowerHorizontalLine);
                    break;
                case 'lV':
                    lineArray.push(leftVerticalLine);
                    break;
                case 'rV':
                    lineArray.push(rightVerticalLine);
                    break;
            }
        });

        return lineArray;
    }


    private checkForConnectorLine(calculatedItem: FolioCalculationItem, lineArray: FolioSvgLine[]): void {
        // init
        const currentSection: FolioSection = calculatedItem.current.section;
        const prevSection: FolioSection = calculatedItem.previous.section;

        // check if sections exist
        if (!prevSection || (currentSection.startSystem === prevSection.startSystem) && (currentSection.endSystem === prevSection.endSystem) ) { return; }

        // check for different start or end systems
        if (currentSection.startSystem !== prevSection.startSystem) {
            // draw upper connector
            const connectorLine: FolioSvgLine = new FolioSvgLine(calculatedItem.previous.corner.upperRight, calculatedItem.current.corner.upperLeft);
            lineArray.push(connectorLine);
        }
        if (currentSection.endSystem !== prevSection.endSystem) {
            // draw lower connector
            const connectorLine: FolioSvgLine = new FolioSvgLine(calculatedItem.previous.corner.lowerRight, calculatedItem.current.corner.lowerLeft);
            lineArray.push(connectorLine);
        }
    }


    // sets the offsetCorrection for an item
    private setItemOffsetCorrection(cornerPoint: FolioSvgPoint, correctionX: number) {
        cornerPoint = cornerPoint.add(correctionX, 0);
    }


    // calculates the start position of an item
    private getItemStart(offset: number, index: number, systemStart: number, offsetCorrection?: number): number {
        // @offset * index (X: start at item 1, 2, 3 etc; Y: start at system line 1, 2, 3 etc.)
        // @systemStart: add horizontal(X) or vertical (Y) systemsMargins
        // @offsetCorrection: mostly needed to center items
        let itemValue = systemStart + offset * index;
        if (offsetCorrection) {
            itemValue += offsetCorrection;
        }
        const itemStart = this.round(parseFloat(itemValue.toString()), 2);
        return itemStart;
    }


    // calculates the start position of the systems
    private getSystemYArray(offset: number, systemStart: number, offsetCorrection?: number): number[][] {
        const arr = [];
        // iterate over systems and get their start position
        for (let i = 0; i < this.numberOfSystems; i++) {
            // use the same method as for items to populate the systems array
            const yStartValue = this.getItemStart(offset, i, systemStart, offsetCorrection);
            arr[i] = this.getSystemLineArray(yStartValue);
        }
        return arr;
    }


    // calculates the start position of the lines per system
    private getSystemLineArray(y: number): number[] {
        if (!y) { return; }

        const lineArray: number[] = [];
        const lineSpaceFactor = 1.5;   // factor to adjust the space between lines

        // iterate from 0 to 4 (5 notation lines) and get start values for each line
        for (let i = 0; i < 5; i++) {
            lineArray[i] = y + lineSpaceFactor * i * this.zoomFactor;
        }
        return lineArray;
    }


    /******************
     * round a number with a given number of decimals
     */
    // in-built round-method is sometimes not correct
    // see: http://www.jacklmoore.com/notes/rounding-in-javascript/
    private round(value: number, decimals: number): number {
        if (Number.isNaN(value)) { return; }
        return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
    }

}
