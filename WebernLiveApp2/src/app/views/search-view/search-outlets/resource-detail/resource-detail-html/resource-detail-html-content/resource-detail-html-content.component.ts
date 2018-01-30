import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResourceDetailContent } from '../../../../models';

@Component({
    selector: 'awg-resource-detail-html-content',
    templateUrl: './resource-detail-html-content.component.html',
    styleUrls: [
        './resource-detail-html-content.component.css',
        '../resource-detail-html.component.css',
    ]
})
export class ResourceDetailHtmlContentComponent implements OnInit {
    @Input() content: ResourceDetailContent;
    @Input() resourceUrl: string;
    @Output() resourceRequest: EventEmitter<string> = new EventEmitter();

    public metaBreakLine: string = 'Versionsdatum';

    constructor() { }

    ngOnInit() {
        console.warn('CONTENT: ', this.content);
    }

    getFacetContentSize(obj) {
        // sum up length of all arrays nested in object
        let size: number = 0;
        Object.keys(obj).forEach(key => {
            size += obj[key].length;
        });
        return size;
    }

    navigateToResource(id?: string) {
        if (id) { id.toString(); }
        this.resourceRequest.emit(id);
    }

}
