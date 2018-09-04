import { Injectable } from '@angular/core';

import {
    FolioCalculation,
    FolioData,
    FolioDataItems,
    FolioDataSection,
    FolioFormatOptions,
    FolioSvgLine,
    FolioSvgOutputItem,
    FolioSvgOutputSheet,
    FolioSvgOutputSystems,
    FolioSvgOutput,
    FolioSvgPoint,
    ViewBox
} from '@awg-views/edition-view/models';
import {
    FolioCalculationItemCorner,
    FolioCalculationItems,
    FolioCalculationItemsCache,
    FolioCalculationSheet,
    FolioCalculationSystems
} from '@awg-views/edition-view/models/folio-calculation.model';


@Injectable()
export class FolioService {

    itemsArray: FolioSvgOutputItem[];
    sheet: FolioSvgOutputSheet;
    systems: FolioSvgOutputSystems;

    private calculation: FolioCalculation;

    private itemsOffsetCorrection: number = 4;      // offsetCorrection to avoid collision between items
    private zoomFactor: number;                     // zoom factor


    /******************
     * dynamic viewBox
     */
    getViewBoxData(folioFormatOptions: FolioFormatOptions): ViewBox {

        this.zoomFactor = folioFormatOptions.factor;

        // set viewBoxWidth from formatX + doubled offset
        const viewBoxWidth = (folioFormatOptions.formatX + 2 * folioFormatOptions.initialOffsetX) * this.zoomFactor;

        // set viewBoxHeight for one row
        const viewBoxHeight = (folioFormatOptions.formatY + 2 * folioFormatOptions.initialOffsetY) * this.zoomFactor;

        // set new viewBoxModel
        const vb: ViewBox = new ViewBox(viewBoxWidth, viewBoxHeight);

        return vb;
    }


    /******************
     * SvgOutputData
     */
    // compute all values to render the svg
    getFolioSvgOutputData(folioFormatOptions: FolioFormatOptions, folioData: FolioData, numberOfSystems: number): FolioSvgOutput {

        this.calculation = new FolioCalculation();
        this.calculation.numberOfSystems = numberOfSystems;

        if (!this.zoomFactor) {
            this.zoomFactor = folioFormatOptions.factor;
        }

        /**********
         * sheet
         */
        this.sheet = this.getSheet(folioFormatOptions, folioData.folio);

        /**********
         * systems
         */
        this.systems = this.getSystems();

        /**********
         * items
         */
        this.itemsArray = this.getItemsArray(folioData.items);

        /***************
         * output object
         */
        const folioSvgOutput: FolioSvgOutput = new FolioSvgOutput(this.sheet, this.systems, this.itemsArray);

        return folioSvgOutput;
    }


    // all calculations for sheet
    private getSheet(folioFormatOptions: FolioFormatOptions, folio: string): FolioSvgOutputSheet {
        // init
        const sheet = new FolioSvgOutputSheet();
        this.calculation.sheet = new FolioCalculationSheet();

        console.log(this.calculation);

        // set calculated values for offsets (= upper left starting point), width & height
        this.calculation.sheet.offset = new FolioSvgPoint(folioFormatOptions.initialOffsetX, folioFormatOptions.initialOffsetY);
        this.calculation.sheet.width = folioFormatOptions.formatX * this.zoomFactor;
        this.calculation.sheet.height = folioFormatOptions.formatY * this.zoomFactor;

        // set sheet values
        sheet.folio = folio;
        sheet.upperLeftCorner = this.calculation.sheet.offset;
        sheet.lowerRightCorner = new FolioSvgPoint(this.calculation.sheet.width, this.calculation.sheet.height);

        return sheet;
    }


    // all calculations for items
    private getItemsArray(items: FolioDataItems[]): FolioSvgOutputItem[] {
        // init
        const itemsArray: FolioSvgOutputItem[] = [];
        this.calculation.items = new FolioCalculationItems();
        this.calculation.items.previous = new FolioCalculationItemsCache();
        this.calculation.items.current = new FolioCalculationItemsCache();
        this.calculation.items.offsetCorrection = this.itemsOffsetCorrection;            // offsetCorrection to avoid collision between items

        // iterate over items
        items.forEach((item: FolioDataItems, itemsIndex: number) => {

            console.warn('NEW ITEM', item);

            // init
            let sectionPartition: number = 1;   // default: 1 section
            this.calculation.items.previous.section = new FolioDataSection();   // reset prevSection
            this.calculation.items.current.section = new FolioDataSection();     // reset currentSection

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
                item.sections.forEach((section: FolioDataSection, sectionIndex: number) => {
                    // set section cache
                    this.setItemSectionCache(section);


                    // calculate main values for item
                    this.calculateItemMainValues(section, sectionPartition, item);


                    // set item corner points
                    this.calculation.items.current.corner = this.setItemCornerPoints();


                    // set item lines
                    this.calculation.items.lineArray = this.setItemLineArray(sectionsLength, sectionIndex, sectionPartition);


                    // item object
                    const itemObject: FolioSvgOutputItem = {
                        sigle: item.sigle,
                        measure: item.measure,
                        upperLeftCorner: this.calculation.items.current.corner.upperLeft,
                        width: this.calculation.items.width,
                        height: this.calculation.items.height,
                        lineArray: this.calculation.items.lineArray
                    };
                    itemsArray.push(itemObject);
                });
            } else {
                console.error('No sections array in item', item);
            }
        });

    return itemsArray;
    }


    private calculateItemMainValues(section: FolioDataSection, sectionPartition: number, item: FolioDataItems): void {
        if (!this.calculation.items) { return; }

        // itemsWidth
        this.calculation.items.widthWithOffset = this.round(this.calculation.systems.width / sectionPartition, 2);
        this.calculation.items.width = this.calculation.items.widthWithOffset - this.itemsOffsetCorrection;   // offsetCorrection to avoid horizontal collision between items

        //itemsHeight
        this.calculation.items.systemRange = section.endSystem - section.startSystem + 1;
        this.calculation.items.height = this.round(this.calculation.systems.upperMargin * this.calculation.items.systemRange - this.itemsOffsetCorrection, 2);      // offsetCorrection to avoid vertical collision between items

        // find item start indices
        this.calculation.items.startYIndex = section.startSystem - 1;
        this.calculation.items.startXIndex = 0 ;
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
                this.calculation.items.startXIndex = position - 1;
            }
        }
        // for other cases index remains 0 (default)

        // itemsStartX
        // widthWithOffset * startXIndex
        // add half the offsetCorrection to systemStartX to center items
        this.calculation.items.startX = this.getItemStart(this.calculation.items.widthWithOffset, this.calculation.items.startXIndex, this.calculation.systems.startX, this.itemsOffsetCorrection / 2);
        this.calculation.items.endX = this.round(this.calculation.items.startX + this.calculation.items.width, 2);

        // itemsStartY
        // subtract half the offsetCorrection from systemStartY to center items
        this.calculation.items.startY = this.getItemStart(this.calculation.systems.upperMargin, this.calculation.items.startYIndex, this.calculation.systems.startY,  - this.itemsOffsetCorrection / 2);
        this.calculation.items.endY = this.round(this.calculation.items.startY + this.calculation.items.height, 2);
    }


    private setItemSectionCache(section: FolioDataSection): void {
        if (!this.calculation.items) { return; }

        if (this.calculation.items.current['section']) {
            this.calculation.items.previous.section = this.calculation.items.current.section;
            this.calculation.items.previous.corner = this.calculation.items.current.corner;
        }
        this.calculation.items.current.section = section;
    }


    private setItemCornerPoints(): FolioCalculationItemCorner {
        if (!this.calculation.items) { return; }

        const corner: FolioCalculationItemCorner = {
            upperLeft: new FolioSvgPoint(this.calculation.items.startX, this.calculation.items.startY),
            lowerLeft: new FolioSvgPoint(this.calculation.items.startX, this.calculation.items.endY),
            upperRight: new FolioSvgPoint(this.calculation.items.endX, this.calculation.items.startY),
            lowerRight: new FolioSvgPoint(this.calculation.items.endX, this.calculation.items.endY)
        };
        return corner;
    }


    private setItemLineArray(sectionsLength: number, sectionIndex: number, sectionPartition: number): FolioSvgLine[] {
        if (!this.calculation.items.current.corner) { return; }

        // init
        const lineArray: FolioSvgLine[] = [];
        let lines: string[] = [];
        // offset correction value
        const correctionValue = this.itemsOffsetCorrection / 2;

        // decide which lines to add to array depending on sectionsLength and position in sectionIndex
        if (sectionsLength === 1) {
            // item is a single rectangle => add all 4 lines to line array
            lines.push('uH', 'lH', 'lV', 'rV');
        } else if (sectionsLength > 1) {
            // item is a joint item
            if (sectionIndex === 0) {
                // first item part

                // offset correction
                this.setItemOffsetCorrection(this.calculation.items.current.corner.upperRight, correctionValue);
                this.setItemOffsetCorrection(this.calculation.items.current.corner.lowerRight, correctionValue);

                // add upper & lower horizontal & left vertical line to line array
                lines.push('uH', 'lH', 'lV');
            } else if (sectionIndex === sectionPartition - 1) {
                // last item part

                // offset correction
                this.setItemOffsetCorrection(this.calculation.items.current.corner.upperLeft, -correctionValue);
                this.setItemOffsetCorrection(this.calculation.items.current.corner.lowerLeft, -correctionValue);

                // add upper & lower horizontal & right vertical line to line array
                lines.push('uH', 'lH', 'rV');

                // check for connector
                if (sectionIndex > 0) {
                    this.checkForConnectorLine(this.calculation.items.current.section, this.calculation.items.previous.section, lineArray);
                }
            } else if ((sectionIndex > 0) && (sectionIndex < sectionPartition - 1)) {
                // middle item part

                // offset correction
                this.setItemOffsetCorrection(this.calculation.items.current.corner.upperRight, correctionValue);
                this.setItemOffsetCorrection(this.calculation.items.current.corner.lowerRight, correctionValue);
                this.setItemOffsetCorrection(this.calculation.items.current.corner.upperLeft, -correctionValue);
                this.setItemOffsetCorrection(this.calculation.items.current.corner.lowerLeft, -correctionValue);

                // add upper and lower horizontal line to line array
                lines.push('uH', 'lH');

                // check for connector
                if (sectionIndex > 0) {
                    this.checkForConnectorLine(this.calculation.items.current.section, this.calculation.items.previous.section, lineArray);

                }
            }
        }

        // create lines
        const upperHorizontalLine = new FolioSvgLine(this.calculation.items.current.corner.upperLeft, this.calculation.items.current.corner.upperRight);
        const lowerHorizontalLine = new FolioSvgLine(this.calculation.items.current.corner.lowerLeft, this.calculation.items.current.corner.lowerRight);
        const leftVerticalLine = new FolioSvgLine(this.calculation.items.current.corner.upperLeft, this.calculation.items.current.corner.lowerLeft);
        const rightVerticalLine = new FolioSvgLine(this.calculation.items.current.corner.upperRight, this.calculation.items.current.corner.lowerRight);

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


    private checkForConnectorLine(currentSection: FolioDataSection, prevSection: FolioDataSection, lineArray: FolioSvgLine[]): void {
        if (!prevSection || (currentSection.startSystem === prevSection.startSystem) && (currentSection.endSystem === prevSection.endSystem) ) { return; }

        // check for different start or end systems
        if (currentSection.startSystem !== prevSection.startSystem) {
            // draw upper connector
            const connectorLine: FolioSvgLine = new FolioSvgLine(this.calculation.items.previous.corner.upperRight, this.calculation.items.current.corner.upperLeft);
            lineArray.push(connectorLine);
        }
        if (currentSection.endSystem !== prevSection.endSystem) {
            // draw lower connector
            const connectorLine: FolioSvgLine = new FolioSvgLine(this.calculation.items.previous.corner.lowerRight, this.calculation.items.current.corner.lowerLeft);
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



    // all calculations for systems
    private getSystems(): FolioSvgOutputSystems {
        // init
        const systems: FolioSvgOutputSystems = new FolioSvgOutputSystems();
        this.calculation.systems = new FolioCalculationSystems();
        this.calculation.systems.labelOffsetCorrection = 4 / this.zoomFactor;       // offsetCorrection for system line labels dependent from zoom factor

        // x-values
        this.calculation.systems.leftMargin = this.round(this.calculation.sheet.width / 6, 2);               // reserve 1/6 of sheetWidth for left margin
        this.calculation.systems.rightMargin = this.round(this.calculation.systems.leftMargin * 0.5, 2);     // right margin is 1/2 leftMargin
        this.calculation.systems.margins = this.calculation.systems.leftMargin + this.calculation.systems.rightMargin;      // outer margins

        this.calculation.systems.width = this.calculation.sheet.width - this.calculation.systems.margins;                   // sheet width minus outer margins
        this.calculation.systems.startX = this.sheet.upperLeftCorner.x + this.calculation.systems.leftMargin;               // begin of sheet plus left margin
        this.calculation.systems.endX = this.calculation.systems.startX + this.calculation.systems.width;                   // begin of system plus its width

        // y-values
        this.calculation.systems.upperMargin = this.round(this.calculation.sheet.height / (this.calculation.numberOfSystems + 2), 2);     // reserve (1 / numberOfSystems plus two empty lines) of sheetHeight as offset
        this.calculation.systems.startY = this.sheet.upperLeftCorner.y + this.calculation.systems.upperMargin;                          // begin of sheet plus upper margin

        // get y values for systems
        this.calculation.systems.yArray = this.getSystemYArray(this.calculation.systems.upperMargin, this.calculation.systems.startY);

        // system lines
        systems.lineArrays = this.calculation.systems.yArray.map(lineArray => lineArray.map(line => new FolioSvgLine(new FolioSvgPoint(this.calculation.systems.startX, line), new FolioSvgPoint(this.calculation.systems.endX, line))));       // line is the y value

        // system numbers (labels)
        this.calculation.systems.labelStartX = this.round(this.calculation.systems.startX - (this.calculation.systems.leftMargin * 3 / 4), 2);   // place numbers 3/4 of left margin in front of system

        // reduce start values with lineLabelOffsetCorrection to get start positions of numbers
        // lineArray[0] = first line of a system
        systems.lineLabelArray = this.calculation.systems.yArray.map(lineArray =>  (new FolioSvgPoint(this.calculation.systems.labelStartX, lineArray[0] - this.calculation.systems.labelOffsetCorrection)));

        return systems;
    }


    // calculates the start position of the systems
    private getSystemYArray(offset: number, systemStart: number, offsetCorrection?: number): number[][] {
        const arr = [];
        // iterate over systems and get their start position
        for (let i = 0; i < this.calculation.numberOfSystems; i++) {
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
