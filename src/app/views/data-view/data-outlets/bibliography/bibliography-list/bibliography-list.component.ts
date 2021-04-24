import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SubjectItemJson } from '@awg-shared/api-objects';

/**
 * The BibliographyList component.
 *
 * It contains the bibliography list
 * of the search view of the app with a
 * {@link BibliographyDetailComponent}.
 */
@Component({
    selector: 'awg-bibliography-list',
    templateUrl: './bibliography-list.component.html',
    styleUrls: ['./bibliography-list.component.css'],
})
export class BibliographyListComponent implements OnInit {
    /**
     * Input variable: bibList.
     *
     * It keeps the subject array of bibliography items.
     */
    @Input()
    bibList: SubjectItemJson[];

    /**
     * Output variable: selectItemRequest.
     *
     * It keeps an event emitter for the selected bibliography item.
     */
    @Output()
    selectItemRequest: EventEmitter<SubjectItemJson> = new EventEmitter();

    /**
     * Public variable: selectedBibItem.
     *
     * It keeps the selected bibliography item.
     */
    selectedBibItem: SubjectItemJson = new SubjectItemJson();

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {}

    /**
     * Public method: onItemSelect.
     *
     * It emits a selected bibliography item
     * to the {@link selectItemRequest}.
     *
     * @param {SubjectItemJson} item The given bibliography item.
     *
     * @returns {void} Emits the selected bibliography item.
     */
    onItemSelect(item: SubjectItemJson) {
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
     *
     * @returns {string} The identifier of the item.
     */
    trackById(item): string {
        return item.obj_id;
    }
}
