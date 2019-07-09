import { Component, OnInit } from '@angular/core';

import { BibliographyService } from '@awg-views/data-view/services';
import { SearchResponseJson, SubjectItemJson } from '@awg-shared/api-objects';

/**
 * The Bibliography component.
 *
 * It contains the bibliography section
 * of the search view of the app
 * with a {@link BibliographySearchComponent} and
 * a {@link BibliographyListComponent} .
 */
@Component({
    selector: 'awg-bibliography',
    templateUrl: './bibliography.component.html',
    styleUrls: ['./bibliography.component.css']
})
export class BibliographyComponent implements OnInit {
    /**
     * Public variable: bibListResponse.
     *
     * It keeps the whole list of bibliography items
     * from a search response.
     */
    bibListResponse: SearchResponseJson = new SearchResponseJson();

    /**
     * Public variable: bibList.
     *
     * It keeps the subject array of bibliography items.
     */
    bibList: SubjectItemJson[];

    /**
     * Public variable: selectedBibItem.
     *
     * It keeps the selected bibliography item.
     */
    selectedBibItem: SubjectItemJson;

    /**
     * Public variable: isBibListLoaded.
     *
     * If the blist of bibliography items is loaded.
     */
    isBibListLoaded = false;

    /**
     * Constructor of the BibliographyComponent.
     *
     * It declares a private BibliographyService instance
     * to get the list of bibliography items.
     *
     * @param {BibliographyService} bibliographyService Instance of the BibliographyService.
     */
    constructor(private bibliographyService: BibliographyService) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getBibList();
    }

    /**
     * Public method: getBibList.
     *
     * It calls the BibliographyService to provide
     * the bibliography items.
     *
     * @returns {void} Sets the bibListResponse variable.
     */
    getBibList(): void {
        this.bibliographyService.getBibliographyList().subscribe((data: SearchResponseJson) => {
            this.bibListResponse = { ...data };

            // TODO: handle request with more than 1000 entries
            console.log('BibComp # bibListResponse', this.bibListResponse);

            this.bibList = this.bibListResponse.subjects.slice(1, 20);
            this.isBibListLoaded = true;
        });
    }

    /**
     * Public method: onItemSelect.
     *
     * It sets a given bibliography item
     * as {@link selectedBibItem}.
     *
     * @param {SubjectItemJson} item The given bibliography item.
     * @returns {void} Sets the selectedBibItem variable.
     */
    onItemSelect(item: SubjectItemJson): void {
        this.selectedBibItem = item;
    }
}
