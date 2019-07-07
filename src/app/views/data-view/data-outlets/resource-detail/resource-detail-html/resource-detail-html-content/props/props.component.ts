import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ResourceDetailProperty } from '@awg-views/data-view/models';

@Component({
    selector: 'awg-resource-detail-html-content-props',
    templateUrl: './props.component.html',
    styleUrls: ['./props.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceDetailHtmlContentPropsComponent implements OnInit {
    @Input()
    props: ResourceDetailProperty[];
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();

    metaBreakLine = 'Versionsdatum';

    constructor() {}

    ngOnInit() {}

    navigateToResource(id?: string): void {
        if (!id) {
            return;
        }
        id = id.toString();
        this.resourceRequest.emit(id);
    }
}
