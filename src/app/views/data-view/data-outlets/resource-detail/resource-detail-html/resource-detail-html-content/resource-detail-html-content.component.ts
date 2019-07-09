import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ResourceDetailContent } from '@awg-views/data-view/models';

@Component({
    selector: 'awg-resource-detail-html-content',
    templateUrl: './resource-detail-html-content.component.html',
    styleUrls: ['./resource-detail-html-content.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceDetailHtmlContentComponent {
    @Input()
    content: ResourceDetailContent;
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();

    navigateToResource(id?: string): void {
        if (!id) {
            return;
        }
        id = id.toString();
        this.resourceRequest.emit(id);
    }
}
