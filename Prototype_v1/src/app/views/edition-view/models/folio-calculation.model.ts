import { ConvoluteFolio, ConvoluteFolioContent, ConvoluteFolioSection } from './convolute-folio.model';
import { FolioFormatOptions } from './folio-format-options.model';


export class FolioCalculationPoint {
    x: number;
    y: number;
    add: (addX: number, addY: number) => FolioCalculationPoint;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.add = (addX: number, addY: number) => {
            this.x += addX;
            this.y += addY;
            return this;
        };
    }
}


export class FolioCalculationLine {
    startPoint: FolioCalculationPoint;
    endPoint: FolioCalculationPoint;

    constructor(point1: FolioCalculationPoint, point2: FolioCalculationPoint) {
        this.startPoint = point1;
        this.endPoint = point2;
    }
}


export class FolioCalculationContentItemCorner {
    upperLeft: FolioCalculationPoint;
    lowerLeft: FolioCalculationPoint;
    upperRight: FolioCalculationPoint;
    lowerRight: FolioCalculationPoint;
}


export class FolioCalculationContentItemCache {
    section: ConvoluteFolioSection;
    corner: FolioCalculationContentItemCorner;
}


export class FolioCalculationContentItem {
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
    lineArray: FolioCalculationLine[];
    current: FolioCalculationContentItemCache;
    previous: FolioCalculationContentItemCache;
    sigle?: string;
    measure?: string;
}


export class FolioCalculationSheet {
    offset: FolioCalculationPoint;
    width: number;
    height: number;
    folioId?: string;
    upperLeftCorner?: FolioCalculationPoint;
    lowerRightCorner?: FolioCalculationPoint;
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
    lineLabelArray?: FolioCalculationPoint[];
    lineArrays?: FolioCalculationLine[][];
}


export class FolioCalculation {
    itemsOffsetCorrection: number;
    numberOfSystems: number;
    zoomFactor: number;
    sheet: FolioCalculationSheet;
    systems: FolioCalculationSystems;
    contentItemsArray: FolioCalculationContentItem[];

    constructor(options: FolioFormatOptions, folioData: ConvoluteFolio, itemsOffsetCorrection?: number) {
        this.itemsOffsetCorrection = itemsOffsetCorrection ? itemsOffsetCorrection : 0;
        this.numberOfSystems = folioData.systems ? parseInt(folioData.systems, 10) : 0;
        this.zoomFactor = options.factor;

        this.sheet = this.getSheet(options, folioData.folioId);
        this.systems = this.getSystems();
        this.contentItemsArray = this.getContentArray(folioData.content);
    }


    getSheet(options: FolioFormatOptions, folioId: string): FolioCalculationSheet {
        // init
        const calculatedSheet = new FolioCalculationSheet();

        // set calculated values for offsets (= upper left starting point), width & height
        calculatedSheet.folioId = folioId;
        calculatedSheet.offset = new FolioCalculationPoint(options.initialOffsetX, options.initialOffsetY);
        calculatedSheet.width = options.formatX * this.zoomFactor;
        calculatedSheet.height = options.formatY * this.zoomFactor;
        calculatedSheet.upperLeftCorner = calculatedSheet.offset;
        calculatedSheet.lowerRightCorner = new FolioCalculationPoint(calculatedSheet.width, calculatedSheet.height);

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
        calculatedSystems.lineArrays = calculatedSystems.yArray.map(lineArray => lineArray.map(line => new FolioCalculationLine(new FolioCalculationPoint(calculatedSystems.startX, line), new FolioCalculationPoint(calculatedSystems.endX, line))));       // line is the y value

        // system numbers (labels)
        calculatedSystems.labelStartX = this.round(calculatedSystems.startX - (calculatedSystems.leftMargin * 3 / 4), 2);   // place numbers 3/4 of left margin in front of system

        // reduce start values with lineLabelOffsetCorrection to get start positions of numbers
        // lineArray[0] = first line of a system
        calculatedSystems.lineLabelArray = calculatedSystems.yArray.map(lineArray =>  (new FolioCalculationPoint(calculatedSystems.labelStartX, lineArray[0] - calculatedSystems.labelOffsetCorrection)));

        return calculatedSystems;
    }


    getContentArray(contents: ConvoluteFolioContent[]): FolioCalculationContentItem[] {
        // init
        const calculatedContentItems: FolioCalculationContentItem[] = [];

        // iterate over items
        contents.forEach((content: ConvoluteFolioContent) => {

            // init
            const calculatedContentItem: FolioCalculationContentItem = new FolioCalculationContentItem();
            calculatedContentItem.previous = new FolioCalculationContentItemCache();
            calculatedContentItem.current = new FolioCalculationContentItemCache();
            calculatedContentItem.previous.section = new ConvoluteFolioSection();   // reset prevSection
            calculatedContentItem.current.section = new ConvoluteFolioSection();     // reset currentSection
            let sectionPartition = 1;   // default: 1 section

            // offsetCorrection to avoid collision between items
            calculatedContentItem.offsetCorrection = this.itemsOffsetCorrection;

            // check if number of sections exist in data; if yes, apply value
            if (content['sectionPartition']) {
                sectionPartition = content['sectionPartition'];
            }

            // check if sections exist
            if (content.sections) {
                // check if sections length is bigger than sectionPartition
                const sectionsLength = content.sections.length;
                if (sectionsLength > sectionPartition) {
                    console.error('Sections array is bigger than sectionPartition');
                    return;
                }
                // iterate over sections
                content.sections.forEach((section: ConvoluteFolioSection, sectionIndex: number) => {
                    // set section cache
                    this.setContentItemSectionCache(calculatedContentItem, section);

                    // calculate main values for item
                    this.calculateContentItemMainValues(calculatedContentItem, section, sectionPartition, content);

                    // set item corner points
                    calculatedContentItem.current.corner = this.setContentItemCornerPoints(calculatedContentItem);

                    // set item lines
                    calculatedContentItem.lineArray = this.setContentItemLineArray(calculatedContentItem, sectionsLength, sectionIndex, sectionPartition);

                    calculatedContentItem.sigle = content.sigle;
                    calculatedContentItem.measure = content.measure;

                    calculatedContentItems.push(calculatedContentItem);
                });
            } else {
                console.error('No sections array in content', content);
            }
        });

        return calculatedContentItems;
    }



    private calculateContentItemMainValues(calculatedContentItem: FolioCalculationContentItem, section: ConvoluteFolioSection, sectionPartition: number, item: ConvoluteFolioContent): void {
        if (!calculatedContentItem) { return; }

        // itemsWidth
        calculatedContentItem.widthWithOffset = this.round(this.systems.width / sectionPartition, 2);
        calculatedContentItem.width = calculatedContentItem.widthWithOffset - this.itemsOffsetCorrection;   // offsetCorrection to avoid horizontal collision between items

        // itemsHeight
        calculatedContentItem.systemRange = section.endSystem - section.startSystem + 1;
        calculatedContentItem.height = this.round(this.systems.upperMargin * calculatedContentItem.systemRange - this.itemsOffsetCorrection, 2);      // offsetCorrection to avoid vertical collision between items

        // find item start indices
        calculatedContentItem.startYIndex = section.startSystem - 1;
        calculatedContentItem.startXIndex = 0 ;
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
                calculatedContentItem.startXIndex = position - 1;
            }
        }
        // for other cases index remains 0 (default)

        // itemsStartX
        // widthWithOffset * startXIndex
        // add half the offsetCorrection to systemStartX to center items
        calculatedContentItem.startX = this.getContentItemStart(calculatedContentItem.widthWithOffset, calculatedContentItem.startXIndex, this.systems.startX, this.itemsOffsetCorrection / 2);
        calculatedContentItem.endX = this.round(calculatedContentItem.startX + calculatedContentItem.width, 2);

        // itemsStartY
        // subtract half the offsetCorrection from systemStartY to center items
        calculatedContentItem.startY = this.getContentItemStart(this.systems.upperMargin, calculatedContentItem.startYIndex, this.systems.startY,  - this.itemsOffsetCorrection / 2);
        calculatedContentItem.endY = this.round(calculatedContentItem.startY + calculatedContentItem.height, 2);
    }


    private setContentItemSectionCache(calculatedContentItem: FolioCalculationContentItem, section: ConvoluteFolioSection): void {
        if (!calculatedContentItem) { return; }

        if (calculatedContentItem.current['section']) {
            calculatedContentItem.previous.section = calculatedContentItem.current.section;
            calculatedContentItem.previous.corner = calculatedContentItem.current.corner;
        }
        calculatedContentItem.current.section = section;
    }


    private setContentItemCornerPoints(calculatedContentItem: FolioCalculationContentItem): FolioCalculationContentItemCorner {
        if (!calculatedContentItem) { return; }

        const corner: FolioCalculationContentItemCorner = {
            upperLeft: new FolioCalculationPoint(calculatedContentItem.startX, calculatedContentItem.startY),
            lowerLeft: new FolioCalculationPoint(calculatedContentItem.startX, calculatedContentItem.endY),
            upperRight: new FolioCalculationPoint(calculatedContentItem.endX, calculatedContentItem.startY),
            lowerRight: new FolioCalculationPoint(calculatedContentItem.endX, calculatedContentItem.endY)
        };
        return corner;
    }


    private setContentItemLineArray(calculatedContentItem: FolioCalculationContentItem, sectionsLength: number, sectionIndex: number, sectionPartition: number): FolioCalculationLine[] {
        if (!calculatedContentItem.current.corner) { return; }

        // init
        const lineArray: FolioCalculationLine[] = [];
        const lines: string[] = [];
        const corner = calculatedContentItem.current.corner;               // shortcut
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
                this.setContentItemOffsetCorrection(corner.upperRight, correctionValue);
                this.setContentItemOffsetCorrection(corner.lowerRight, correctionValue);

                // add upper & lower horizontal & left vertical line to line array
                lines.push('uH', 'lH', 'lV');
            } else if (sectionIndex === sectionPartition - 1) {
                // last item part

                // offset correction
                this.setContentItemOffsetCorrection(corner.upperLeft, -correctionValue);
                this.setContentItemOffsetCorrection(corner.lowerLeft, -correctionValue);

                // add upper & lower horizontal & right vertical line to line array
                lines.push('uH', 'lH', 'rV');

                // check for connector
                if (sectionIndex > 0) {
                    this.checkForConnectorLine(calculatedContentItem, lineArray);
                }
            } else if ((sectionIndex > 0) && (sectionIndex < sectionPartition - 1)) {
                // middle item part

                // offset correction
                this.setContentItemOffsetCorrection(corner.upperRight, correctionValue);
                this.setContentItemOffsetCorrection(corner.lowerRight, correctionValue);
                this.setContentItemOffsetCorrection(corner.upperLeft, -correctionValue);
                this.setContentItemOffsetCorrection(corner.lowerLeft, -correctionValue);

                // add upper and lower horizontal line to line array
                lines.push('uH', 'lH');

                // check for connector
                if (sectionIndex > 0) {
                    this.checkForConnectorLine(calculatedContentItem, lineArray);

                }
            }
        }

        // create lines
        const upperHorizontalLine = new FolioCalculationLine(corner.upperLeft, corner.upperRight);
        const lowerHorizontalLine = new FolioCalculationLine(corner.lowerLeft, corner.lowerRight);
        const leftVerticalLine = new FolioCalculationLine(corner.upperLeft, corner.lowerLeft);
        const rightVerticalLine = new FolioCalculationLine(corner.upperRight, corner.lowerRight);

        lines.forEach((line: string) => {
            switch (line) {
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


    private checkForConnectorLine(calculatedContentItem: FolioCalculationContentItem, lineArray: FolioCalculationLine[]): void {
        // init
        const currentSection: ConvoluteFolioSection = calculatedContentItem.current.section;
        const prevSection: ConvoluteFolioSection = calculatedContentItem.previous.section;

        // check if sections exist
        if (!prevSection || (currentSection.startSystem === prevSection.startSystem) && (currentSection.endSystem === prevSection.endSystem) ) { return; }

        // check for different start or end systems
        if (currentSection.startSystem !== prevSection.startSystem) {
            // draw upper connector
            const connectorLine: FolioCalculationLine = new FolioCalculationLine(calculatedContentItem.previous.corner.upperRight, calculatedContentItem.current.corner.upperLeft);
            lineArray.push(connectorLine);
        }
        if (currentSection.endSystem !== prevSection.endSystem) {
            // draw lower connector
            const connectorLine: FolioCalculationLine = new FolioCalculationLine(calculatedContentItem.previous.corner.lowerRight, calculatedContentItem.current.corner.lowerLeft);
            lineArray.push(connectorLine);
        }
    }


    // sets the offsetCorrection for an item
    private setContentItemOffsetCorrection(cornerPoint: FolioCalculationPoint, correctionX: number) {
        cornerPoint = cornerPoint.add(correctionX, 0);
    }


    // calculates the start position of an item
    private getContentItemStart(offset: number, index: number, systemStart: number, offsetCorrection?: number): number {
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
            const yStartValue = this.getContentItemStart(offset, i, systemStart, offsetCorrection);
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
