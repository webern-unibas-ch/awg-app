import { Folio, FolioContent, FolioSection } from './folio.model';
import { FolioSettings } from './folio-settings.model';

/**
 * The FolioCalculationPoint class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of a point on the folio canvas.
 *
 * Exposed to be used throughout {@link EditionDetailModule}.
 */
export class FolioCalculationPoint {
    /**
     * The x value (in px) of a point.
     */
    x: number;

    /**
     * The y value (in px) of a point.
     */
    y: number;

    /**
     * Method: add.
     *
     * It adds x and y values (in px) to an existing point.
     *
     * @param {number} addX Add to x value.
     * @param {number} addY Add to y value.
     */
    add: (addX: number, addY: number) => FolioCalculationPoint;

    /**
     * Constructor of the FolioCalculationPoint class.
     *
     * It initializes the class with values for x and y (in px).
     *
     * @param {number} x The x value input (in px).
     * @param {number} y The y value input (in px).
     */
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

/**
 * The FolioCalculationLine class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of a line on the folio canvas.
 *
 * Exposed to be used throughout {@link EditionDetailModule}.
 */
export class FolioCalculationLine {
    /**
     * The starting point of a line (FolioCalculationPoint).
     */
    startPoint: FolioCalculationPoint;

    /**
     * The ending point of a line (FolioCalculationPoint).
     */
    endPoint: FolioCalculationPoint;

    /**
     * Constructor of the FolioCalculationLine class.
     *
     * It initializes the class with two points for start and end.
     *
     * @param {FolioCalculationPoint} startPoint The starting point input.
     * @param {FolioCalculationPoint} endPoint The ending point input.
     */
    constructor(startPoint: FolioCalculationPoint, endPoint: FolioCalculationPoint) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }
}

/**
 * The FolioCalculationContentItemCornerPoints class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of a content item's corners on the folio canvas.
 *
 * Not exposed, only called internally from {@link FolioCalculation}.
 */
class FolioCalculationContentItemCornerPoints {
    /**
     * The upper left corner point of a content item (FolioCalculationPoint).
     */
    upperLeftCorner: FolioCalculationPoint;

    /**
     * The lower left corner point of a content item (FolioCalculationPoint).
     */
    lowerLeftCorner: FolioCalculationPoint;

    /**
     * The upper right corner point of a content item (FolioCalculationPoint).
     */
    upperRightCorner: FolioCalculationPoint;

    /**
     * The lower right corner point of a content item (FolioCalculationPoint).
     */
    lowerRightCorner: FolioCalculationPoint;

    /**
     * Constructor of the FolioCalculationContentItemCornerPoints class.
     *
     * It initializes the class with four points
     * for upper and lower left and upper and lower right corners.
     *
     * @param {FolioCalculationContentItem} calculatedContentItem The calculated content item input.
     */
    constructor(calculatedContentItem: FolioCalculationContentItem) {
        this.upperLeftCorner = new FolioCalculationPoint(calculatedContentItem.startX, calculatedContentItem.startY);
        this.lowerLeftCorner = new FolioCalculationPoint(calculatedContentItem.startX, calculatedContentItem.endY);
        this.upperRightCorner = new FolioCalculationPoint(calculatedContentItem.endX, calculatedContentItem.startY);
        this.lowerRightCorner = new FolioCalculationPoint(calculatedContentItem.endX, calculatedContentItem.endY);
    }
}

/**
 * The FolioCalculationContentItemCache class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of a content item cache on the folio canvas.
 *
 * Not exposed, only called internally from {@link FolioCalculation}.
 */
class FolioCalculationContentItemCache {
    /**
     * The section of a content item (FolioSection).
     */
    section: FolioSection;

    /**
     * The corner points of a content item (FolioCalculationContentItemCornerPoints).
     */
    cornerPoints: FolioCalculationContentItemCornerPoints;
}

/**
 * The FolioCalculationContentItem class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of a content item on the folio canvas.
 *
 * Exposed to be used throughout {@link EditionDetailModule}.
 */
export class FolioCalculationContentItem {
    /**
     * The correction value for the offset of the content item (number).
     */
    offsetCorrection: number;

    /**
     * The width including offset of the content item (number).
     */
    widthWithOffset: number;

    /**
     * The width of the content item (number).
     */
    width: number;

    /**
     * The height of the content item (number).
     */
    height: number;

    /**
     * The system range of the content item (number).
     */
    systemRange: number;

    /**
     * The start position (x-value) of the index of the content item (number).
     */
    startXIndex: number;

    /**
     * The start position (y-value) of the index of the content item (number).
     */
    startYIndex: number;

    /**
     * The start position (x-value) of the content item (number).
     */
    startX: number;

    /**
     * The end position (x-value) of the content item (number).
     */
    endX: number;

    /**
     * The start position (y-value) of the content item (number).
     */
    startY: number;

    /**
     * The end position (y-value) of the content item (number).
     */
    endY: number;

    /**
     * The line array of the content item (FolioCalculationLine[]).
     */
    lineArray: FolioCalculationLine[];

    /**
     * The current content item (FolioCalculationContentItemCache).
     */
    current: FolioCalculationContentItemCache;

    /**
     * The previous content item (FolioCalculationContentItemCache).
     */
    previous: FolioCalculationContentItemCache;

    /**
     * The optional label for the sigle of the content item (string).
     */
    sigle?: string;

    /**
     * The optional label for the measure of the content item (string).
     */
    measure?: string;
}

/**
 * The FolioCalculationSheet class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of a sheet on the folio canvas.
 *
 * Exposed to be used throughout {@link EditionDetailModule}.
 */
export class FolioCalculationSheet {
    /**
     * The offset of the sheet (FolioCalculationPoint).
     */
    offset: FolioCalculationPoint;

    /**
     * The width of the sheet (number).
     */
    width: number;

    /**
     * The height of the sheet (number).
     */
    height: number;

    /**
     * The optional folio id of the sheet (string).
     */
    folioId?: string;

    /**
     * The optional upper left corner point of the sheet (FolioCalculationPoint).
     */
    upperLeftCorner?: FolioCalculationPoint;

    /**
     * The optional lower right corner point of the sheet (FolioCalculationPoint).
     */
    lowerRightCorner?: FolioCalculationPoint;

    /**
     * Constructor of the FolioCalculationSheet class.
     *
     * It initializes the class with values from folio settings, the folio id and zoom factor.
     *
     * @param {FolioSettings} folioSettings The folio settings input.
     * @param {string} folioId The folio id input.
     */
    constructor(folioSettings: FolioSettings, folioId: string) {
        this.folioId = folioId;
        this.offset = new FolioCalculationPoint(folioSettings.initialOffsetX, folioSettings.initialOffsetY);
        this.width = folioSettings.formatX * folioSettings.factor;
        this.height = folioSettings.formatY * folioSettings.factor;
        this.upperLeftCorner = this.offset;
        this.lowerRightCorner = new FolioCalculationPoint(this.width, this.height);
    }
}

/**
 * The FolioCalculationSystems class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of the systems on the folio canvas.
 *
 * Exposed to be used throughout {@link EditionDetailModule}.
 */
export class FolioCalculationSystems {
    /**
     * The width of the systems (number).
     */
    width: number;

    /**
     * The left margin of the systems (number).
     */
    leftMargin: number;

    /**
     * The right margin of the systems (number).
     */
    rightMargin: number;

    /**
     * The upper margin of the systems (number).
     */
    upperMargin: number;

    /**
     * The margins of the systems (number).
     */
    margins: number;

    /**
     * The start position (x-value) of the systems (number).
     */
    startX: number;

    /**
     * The end position (x-value) of the systems (number).
     */
    endX: number;

    /**
     * The start position (y-value) of the systems (number).
     */
    startY: number;

    /**
     * The array of y-value arrays for the systems (number).
     */
    yArray: number[][];

    /**
     * The start position (x-value) of the labels of the systems (number).
     */
    labelStartX: number;

    /**
     * The correction value for the offset of the labels of the systems (number).
     */
    labelOffsetCorrection: number;

    /**
     * The optional line label array of the systems (FolioCalculationPoint[]).
     */
    lineLabelArray?: FolioCalculationPoint[];

    /**
     * The optional array of line arrays of the systems (FolioCalculationLine[][]).
     */
    lineArrays?: FolioCalculationLine[][];
}

/**
 * The FolioCalculation class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate all the values needed for the folio canvas.
 *
 * Exposed to be used throughout {@link EditionDetailModule}.
 */
export class FolioCalculation {
    /**
     * The correction value for the offset of the folio items (number).
     */
    itemsOffsetCorrection: number;

    /**
     * The number of systems (number).
     */
    numberOfSystems: number;

    /**
     * The zoom factor (number).
     */
    zoomFactor: number;

    /**
     * The calculated values for the sheet
     * of a folio (FolioCalculationSheet).
     */
    sheet: FolioCalculationSheet;

    /**
     * The calculated values for the systems
     * of a folio (FolioCalculationSystems).
     */
    systems: FolioCalculationSystems;

    /**
     * The calculated values for the array of content items
     * of a folio (FolioCalculationContentItem[]).
     */
    contentItemsArray: FolioCalculationContentItem[];

    /**
     * Constructor of the FolioCalculation class.
     *
     * It initializes the class with values from folio settings, folio data and itemsOffset correction.
     *
     * @param {FolioSettings} folioSettings The folio settings input.
     * @param {Folio} folioData The folio data input.
     * @param {number} [itemsOffsetCorrection] The optional itemsOffset correction input.
     */
    constructor(folioSettings: FolioSettings, folioData: Folio, itemsOffsetCorrection?: number) {
        this.itemsOffsetCorrection = itemsOffsetCorrection ? itemsOffsetCorrection : 0;
        this.numberOfSystems = folioData.systems ? parseInt(folioData.systems, 10) : 0;
        this.zoomFactor = folioSettings.factor;

        this.calculateFolio(folioSettings, folioData);
    }

    /**
     * Private method: calculateFolio.
     *
     * It calls the calculation methods for the sheet,
     * systems and contentItemsArray of a folio.
     *
     * @param {FolioSettings} folioSettings The folio settings input.
     * @param {Folio} folioData The folio data input.
     */
    private calculateFolio(folioSettings: FolioSettings, folioData: Folio) {
        this.sheet = this.calculateSheet(folioSettings, folioData.folioId);
        this.systems = this.calculateSystems();
        this.contentItemsArray = this.calculateContentArray(folioData.content);
    }

    /**
     * Private method: calculateSheet.
     *
     * It returns a FolioCalculationSheet class that provides
     * all the calculated values for the sheet of a folio.
     *
     * @param {FolioSettings} folioSettings The folio settings input.
     * @param {string} folioId The folio id input.
     */
    private calculateSheet(folioSettings: FolioSettings, folioId: string): FolioCalculationSheet {
        return new FolioCalculationSheet(folioSettings, folioId);
    }

    /**
     * Private method: calculateSystems.
     *
     * It returns a FolioCalculationSystems class that provides
     * all the calculated values for the systems of a folio.
     */
    private calculateSystems(): FolioCalculationSystems {
        // init
        const calculatedSystems = new FolioCalculationSystems();

        // offset correction
        calculatedSystems.labelOffsetCorrection = 4 / this.zoomFactor; // offsetCorrection for system line labels dependent from zoom factor

        // x-values
        calculatedSystems.leftMargin = this.round(this.sheet.width / 6, 2); // reserve 1/6 of sheetWidth for left margin
        calculatedSystems.rightMargin = this.round(calculatedSystems.leftMargin * 0.5, 2); // right margin is 1/2 leftMargin
        calculatedSystems.margins = calculatedSystems.leftMargin + calculatedSystems.rightMargin; // outer margins

        calculatedSystems.width = this.sheet.width - calculatedSystems.margins; // sheet width minus outer margins
        calculatedSystems.startX = this.sheet.upperLeftCorner.x + calculatedSystems.leftMargin; // begin of sheet plus left margin
        calculatedSystems.endX = calculatedSystems.startX + calculatedSystems.width; // begin of system plus its width

        // y-values
        calculatedSystems.upperMargin = this.round(this.sheet.height / (this.numberOfSystems + 2), 2); // reserve (1 / numberOfSystems plus two empty lines) of sheetHeight as offset
        calculatedSystems.startY = this.sheet.upperLeftCorner.y + calculatedSystems.upperMargin; // begin of sheet plus upper margin

        // get y values for systems
        calculatedSystems.yArray = this.getSystemYArray(calculatedSystems.upperMargin, calculatedSystems.startY);

        // system lines
        calculatedSystems.lineArrays = calculatedSystems.yArray.map(lineArray =>
            lineArray.map(
                line =>
                    new FolioCalculationLine(
                        new FolioCalculationPoint(calculatedSystems.startX, line),
                        new FolioCalculationPoint(calculatedSystems.endX, line)
                    )
            )
        ); // line is the y value

        // system numbers (labels)
        calculatedSystems.labelStartX = this.round(
            calculatedSystems.startX - (calculatedSystems.leftMargin * 3) / 4,
            2
        ); // place numbers 3/4 of left margin in front of system

        // reduce start values with lineLabelOffsetCorrection to get start positions of numbers
        // lineArray[0] = first line of a system
        calculatedSystems.lineLabelArray = calculatedSystems.yArray.map(
            lineArray =>
                new FolioCalculationPoint(
                    calculatedSystems.labelStartX,
                    lineArray[0] - calculatedSystems.labelOffsetCorrection
                )
        );

        return calculatedSystems;
    }

    /**
     * Private method: calculateContentArray.
     *
     * It provides all the calculated values for the content items of a folio.
     *
     * @param {FolioContent[]} contents The folio contents input.
     * @returns {FolioCalculationContentItem[]} The array of the calculated content items.
     */
    private calculateContentArray(contents: FolioContent[]): FolioCalculationContentItem[] {
        // init
        const calculatedContentItems: FolioCalculationContentItem[] = [];

        // iterate over items
        contents.forEach((content: FolioContent) => {
            // init
            const calculatedContentItem: FolioCalculationContentItem = new FolioCalculationContentItem();
            calculatedContentItem.previous = new FolioCalculationContentItemCache();
            calculatedContentItem.current = new FolioCalculationContentItemCache();
            calculatedContentItem.previous.section = new FolioSection(); // reset prevSection
            calculatedContentItem.current.section = new FolioSection(); // reset currentSection
            let sectionPartition = 1; // default: 1 section

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
                content.sections.forEach((section: FolioSection, sectionIndex: number) => {
                    // set section cache
                    this.setContentItemSectionCache(calculatedContentItem, section);

                    // set main values for item
                    this.setContentItemMainValues(calculatedContentItem, section, sectionPartition, content);

                    // set item corner points
                    calculatedContentItem.current.cornerPoints = new FolioCalculationContentItemCornerPoints(
                        calculatedContentItem
                    );

                    // set item lines
                    calculatedContentItem.lineArray = this.setContentItemLineArray(
                        calculatedContentItem,
                        sectionsLength,
                        sectionIndex,
                        sectionPartition
                    );

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

    /**
     * Private helper method for calculateContentArray: setContentItemMainValues.
     *
     * It calculates the main values for the content items of a folio.
     *
     * @param {FolioCalculationContentItem} calculatedContentItem The calculated content item input.
     * @param {FolioSection} section The section input.
     * @param {number} sectionPartition The section partition input.
     * @param {FolioContent} item The folio content input.
     * @returns {void} Calculates and sets the main values of the calculatedContentItem.
     */
    private setContentItemMainValues(
        calculatedContentItem: FolioCalculationContentItem,
        section: FolioSection,
        sectionPartition: number,
        item: FolioContent
    ): void {
        if (!calculatedContentItem) {
            return;
        }

        // itemsWidth
        calculatedContentItem.widthWithOffset = this.round(this.systems.width / sectionPartition, 2);
        calculatedContentItem.width = calculatedContentItem.widthWithOffset - this.itemsOffsetCorrection; // offsetCorrection to avoid horizontal collision between items

        // itemsHeight
        calculatedContentItem.systemRange = section.endSystem - section.startSystem + 1;
        calculatedContentItem.height = this.round(
            this.systems.upperMargin * calculatedContentItem.systemRange - this.itemsOffsetCorrection,
            2
        ); // offsetCorrection to avoid vertical collision between items

        // find item start indices
        calculatedContentItem.startYIndex = section.startSystem - 1;
        calculatedContentItem.startXIndex = 0;
        // check if position exists ...
        if (section.position) {
            const position: number = section.position;
            if (position > sectionPartition) {
                // ... and is bigger than number of sections
                // index remains 0
                console.error(
                    'Assuming position 1 because current position is bigger than number of sections for item ',
                    item
                );
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
        calculatedContentItem.startX = this.getContentItemStart(
            calculatedContentItem.widthWithOffset,
            calculatedContentItem.startXIndex,
            this.systems.startX,
            this.itemsOffsetCorrection / 2
        );
        calculatedContentItem.endX = this.round(calculatedContentItem.startX + calculatedContentItem.width, 2);

        // itemsStartY
        // subtract half the offsetCorrection from systemStartY to center items
        calculatedContentItem.startY = this.getContentItemStart(
            this.systems.upperMargin,
            calculatedContentItem.startYIndex,
            this.systems.startY,
            -this.itemsOffsetCorrection / 2
        );
        calculatedContentItem.endY = this.round(calculatedContentItem.startY + calculatedContentItem.height, 2);
    }

    /**
     * Private helper method for calculateContentArray: setContentItemSectionCache.
     *
     * It caches the current and previous section of a calculated content item.
     *
     * @param {FolioCalculationContentItem} calculatedContentItem The calculated content item input.
     * @param {FolioSection} section The section input.
     * @returns {void} Caches the current and previous section of the calculatedContentItem.
     */
    private setContentItemSectionCache(
        calculatedContentItem: FolioCalculationContentItem,
        section: FolioSection
    ): void {
        if (!calculatedContentItem) {
            return;
        }

        if (calculatedContentItem.current['section']) {
            calculatedContentItem.previous.section = calculatedContentItem.current.section;
            calculatedContentItem.previous.cornerPoints = calculatedContentItem.current.cornerPoints;
        }
        calculatedContentItem.current.section = section;
    }

    private setContentItemLineArray(
        calculatedContentItem: FolioCalculationContentItem,
        sectionsLength: number,
        sectionIndex: number,
        sectionPartition: number
    ): FolioCalculationLine[] {
        if (!calculatedContentItem.current.cornerPoints) {
            return;
        }

        // init
        const lineArray: FolioCalculationLine[] = [];
        const lines: string[] = [];
        const cornerPoints = calculatedContentItem.current.cornerPoints; // shortcut
        const correctionValue = this.itemsOffsetCorrection / 2; // offset correction value

        // decide which lines to add to array depending on sectionsLength and position in sectionIndex
        if (sectionsLength === 1) {
            // item is a single rectangle => add all 4 lines to line array
            lines.push('uH', 'lH', 'lV', 'rV');
        } else if (sectionsLength > 1) {
            // item is a joint item
            if (sectionIndex === 0) {
                // first item part

                // offset correction
                this.setContentItemOffsetCorrection(cornerPoints.upperRightCorner, correctionValue);
                this.setContentItemOffsetCorrection(cornerPoints.lowerRightCorner, correctionValue);

                // add upper & lower horizontal & left vertical line to line array
                lines.push('uH', 'lH', 'lV');
            } else if (sectionIndex === sectionPartition - 1) {
                // last item part

                // offset correction
                this.setContentItemOffsetCorrection(cornerPoints.upperLeftCorner, -correctionValue);
                this.setContentItemOffsetCorrection(cornerPoints.lowerLeftCorner, -correctionValue);

                // add upper & lower horizontal & right vertical line to line array
                lines.push('uH', 'lH', 'rV');

                // check for connector
                if (sectionIndex > 0) {
                    this.checkForConnectorLine(calculatedContentItem, lineArray);
                }
            } else if (sectionIndex > 0 && sectionIndex < sectionPartition - 1) {
                // middle item part

                // offset correction
                this.setContentItemOffsetCorrection(cornerPoints.upperRightCorner, correctionValue);
                this.setContentItemOffsetCorrection(cornerPoints.lowerRightCorner, correctionValue);
                this.setContentItemOffsetCorrection(cornerPoints.upperLeftCorner, -correctionValue);
                this.setContentItemOffsetCorrection(cornerPoints.lowerLeftCorner, -correctionValue);

                // add upper and lower horizontal line to line array
                lines.push('uH', 'lH');

                // check for connector
                if (sectionIndex > 0) {
                    this.checkForConnectorLine(calculatedContentItem, lineArray);
                }
            }
        }

        // create lines
        const upperHorizontalLine = new FolioCalculationLine(
            cornerPoints.upperLeftCorner,
            cornerPoints.upperRightCorner
        );
        const lowerHorizontalLine = new FolioCalculationLine(
            cornerPoints.lowerLeftCorner,
            cornerPoints.lowerRightCorner
        );
        const leftVerticalLine = new FolioCalculationLine(cornerPoints.upperLeftCorner, cornerPoints.lowerLeftCorner);
        const rightVerticalLine = new FolioCalculationLine(
            cornerPoints.upperRightCorner,
            cornerPoints.lowerRightCorner
        );

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

    private checkForConnectorLine(
        calculatedContentItem: FolioCalculationContentItem,
        lineArray: FolioCalculationLine[]
    ): void {
        // init
        const currentSection: FolioSection = calculatedContentItem.current.section;
        const prevSection: FolioSection = calculatedContentItem.previous.section;

        // check if sections exist
        if (
            !prevSection ||
            (currentSection.startSystem === prevSection.startSystem &&
                currentSection.endSystem === prevSection.endSystem)
        ) {
            return;
        }

        // check for different start or end systems
        if (currentSection.startSystem !== prevSection.startSystem) {
            // draw upper connector
            const connectorLine: FolioCalculationLine = new FolioCalculationLine(
                calculatedContentItem.previous.cornerPoints.upperRightCorner,
                calculatedContentItem.current.cornerPoints.upperLeftCorner
            );
            lineArray.push(connectorLine);
        }
        if (currentSection.endSystem !== prevSection.endSystem) {
            // draw lower connector
            const connectorLine: FolioCalculationLine = new FolioCalculationLine(
                calculatedContentItem.previous.cornerPoints.lowerRightCorner,
                calculatedContentItem.current.cornerPoints.lowerLeftCorner
            );
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
        if (!y) {
            return;
        }

        const lineArray: number[] = [];
        const lineSpaceFactor = 1.5; // factor to adjust the space between lines

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
        if (Number.isNaN(value)) {
            return;
        }
        return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
    }
}
