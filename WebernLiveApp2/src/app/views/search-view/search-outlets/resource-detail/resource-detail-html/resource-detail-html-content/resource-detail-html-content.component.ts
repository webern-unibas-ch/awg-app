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

    metaBreakLine: string = 'Versionsdatum';
    currentImageIndex: number = 0;

    constructor() { }

    ngOnInit() {
        console.warn('CONTENT: ', this.content);
    }

    getFacetContentSize(obj: any): number {
        // sum up length of all arrays nested in object
        let size: number = 0;
        Object.keys(obj).forEach(key => {
            size += obj[key].length;
        });
        return size;
    }


    navigateToResource(id?: string): void {
        if (id) { id.toString(); }
        this.resourceRequest.emit(id);
    }


    navigateToSearchResults(): void {
        // TODO navigation to image or connected objects details
        console.log('ResourceDetailHtmlContent# got navigation request');
    }

    pageThumbsLeft() {
        // TODO:   offset
        console.log('ResourceDetailHtmlContent# got pageThumbsLeft request');
    }

    pageThumbsRight() {
        // TODO: offset
        console.log('ResourceDetailHtmlContent# got pageThumbsRight request');
    }

    setImage(index: number): void {
        console.log('ResourceDetailHtmlContent# clicked setImage with image:  ', index);
        this.currentImageIndex = index;
    }

}
