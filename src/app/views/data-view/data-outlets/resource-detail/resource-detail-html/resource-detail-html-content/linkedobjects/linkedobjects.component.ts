import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ConversionService } from '@awg-core/services/conversion-service';
import { ResourceDetailGroupedIncomingLinks } from '@awg-views/data-view/models';

@Component({
    selector: 'awg-resource-detail-html-content-linkedobjects',
    templateUrl: './linkedobjects.component.html',
    styleUrls: ['./linkedobjects.component.css']
})
export class ResourceDetailHtmlContentLinkedobjectsComponent implements OnChanges {
    @Input()
    incoming: ResourceDetailGroupedIncomingLinks;
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();

    totalNumber: number;

    errorHandler: (ex: any) => void = console.error;

    constructor(private conversionService: ConversionService) {}

    ngOnChanges(changes: SimpleChanges) {
        this.updateTotalNumber();
    }

    navigateToResource(id?: string): void {
        if (!id) {
            return;
        }
        id = id.toString();
        this.resourceRequest.emit(id);
    }

    updateTotalNumber(): void {
        try {
            // check for input variable to be unset
            if (this.incoming === undefined || this.incoming === null) {
                this.totalNumber = 0;
                return;
            }
            // if input variable i set, update total number
            this.totalNumber = this.getNestedArraysTotalItems(this.incoming);
        } catch (e) {
            if (this.errorHandler === undefined) {
                throw e;
            } else {
                this.errorHandler(e);
            }
        }
    }

    /**
     * Private  method: getNestedArraysTotalItems.
     *
     * It sums up the total items (length) of all
     * arrays nested in an ResourceDetailGroupedIncomingLinks
     * object.
     *
     * @param {ResourceDetailGroupedIncomingLinks} obj The given grouped incoming links object.
     * @returns {number} The number of total items (length) of the nested array.
     */
    private getNestedArraysTotalItems(obj: ResourceDetailGroupedIncomingLinks): number {
        let totalItems = 0;
        // iterate over object keys
        Object.keys(obj).forEach(key => {
            // sum up length of array nested in object
            totalItems += obj[key].length;
        });
        return totalItems;
    }
}
