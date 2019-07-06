import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SubjectItemJson } from '@awg-shared/api-objects';

@Component({
    selector: 'awg-bibliography-list',
    templateUrl: './bibliography-list.component.html',
    styleUrls: ['./bibliography-list.component.css']
})
export class BibliographyListComponent implements OnInit {
    @Input()
    bibList: SubjectItemJson[];
    @Output()
    selectItemRequest: EventEmitter<SubjectItemJson> = new EventEmitter();
    selectedBibItem: SubjectItemJson = new SubjectItemJson();

    constructor() {}

    ngOnInit() {}

    selectItem(item: SubjectItemJson) {
        this.selectedBibItem = item;
        this.selectItemRequest.emit(item);
    }

    /**
     * Public method: trackById.
     *
     * It returns a unique identifier of a given item.
     * Angular uses the value returned from
     * tracking function to track items identity.
     *
     * @param {string} item The given item.
     * @returns {string} The identifier of the item.
     */
    trackById(item): string {
        return item.obj_id;
    }
}
