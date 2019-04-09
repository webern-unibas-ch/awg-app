import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ConversionService } from '@awg-core/services/conversion-service';
import { ResourceDetailGroupedIncomingLinks } from '@awg-views/data-view/models';

@Component({
    selector: 'awg-resource-detail-html-content-linkedobjects',
    templateUrl: './linkedobjects.component.html',
    styleUrls: ['./linkedobjects.component.css']
})
export class ResourceDetailHtmlContentLinkedobjectsComponent implements OnInit, OnChanges {
    @Input()
    incoming: ResourceDetailGroupedIncomingLinks;
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();

    totalNumber = 0;

    constructor(private conversionService: ConversionService) {}

    ngOnInit() {
        this.updateTotalNumber();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['incoming'].isFirstChange()) {
            this.updateTotalNumber();
        }
    }

    navigateToResource(id?: string): void {
        if (!id) {
            return;
        }
        id = id.toString();
        this.resourceRequest.emit(id);
    }

    updateTotalNumber() {
        this.totalNumber = this.getNestedArraysTotalItems(this.incoming);
    }

    private getNestedArraysTotalItems(obj: ResourceDetailGroupedIncomingLinks): number {
        // sum up length of all arrays nested in linked objects object
        return this.conversionService.getNestedArraysTotalItems(obj);
    }
}
