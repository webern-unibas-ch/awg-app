import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ConversionService } from '@awg-core/services/conversion-service';
import { ResourceDetailGroupedIncomingLinks } from '@awg-views/data-view/models';

@Component({
    selector: 'awg-resource-detail-html-content-linkedobjects',
    templateUrl: './linkedobjects.component.html',
    styleUrls: ['./linkedobjects.component.css']
})
export class ResourceDetailHtmlContentLinkedobjectsComponent implements OnInit {
    @Input()
    incoming: ResourceDetailGroupedIncomingLinks;
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();

    constructor(private conversionService: ConversionService) {}

    ngOnInit() {}

    getNestedArraysLength(obj: ResourceDetailGroupedIncomingLinks): number {
        // sum up length of all arrays nested in linked objects object
        return this.conversionService.getNestedArraysLength(obj);
    }

    navigateToResource(id?: string): void {
        if (id) {
            id.toString();
        }
        this.resourceRequest.emit(id);
    }
}
