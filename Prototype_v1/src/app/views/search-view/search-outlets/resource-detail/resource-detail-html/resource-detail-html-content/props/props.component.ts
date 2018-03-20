import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ResourceDetailProps } from '../../../../../models';

@Component({
    selector: 'awg-resource-detail-html-content-props',
    templateUrl: './props.component.html',
    styleUrls: ['./props.component.css']
})
export class ResourceDetailHtmlContentPropsComponent implements OnInit {
    @Input() props: ResourceDetailProps[];
    @Output() resourceRequest: EventEmitter<string> = new EventEmitter();

    metaBreakLine: string = 'Versionsdatum';

    constructor() { }

    ngOnInit() {
    }

    navigateToResource(id?: string): void {
        if (id) { id.toString(); }
        this.resourceRequest.emit(id);
    }

}
