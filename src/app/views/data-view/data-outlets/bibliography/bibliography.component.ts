import { Component, inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SearchResponseJson, SubjectItemJson } from '@awg-shared/api-objects';
import { BibliographyService } from '@awg-views/data-view/services';

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
    styleUrls: ['./bibliography.component.scss'],
    standalone: false,
})
export class BibliographyComponent implements OnInit {
    /**
     * Public variable: bibList$.
     *
     * Observable that keeps the subject array of bibliography items.
     */
    bibList$: Observable<SearchResponseJson>;

    /**
     * Public variable: nhits.
     *
     * It keeps the result number of a
     * bibliography search response.
     */
    nhits: string | number;

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
     * Private readonly injection variable: _bibliographyService.
     *
     * It keeps the instance of the injected BibliographyService.
     */
    private readonly _bibliographyService = inject(BibliographyService);

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
        // TODO: handle request with more than 1000 entries
        this.bibList$ = this._bibliographyService.getBibliographyList().pipe(
            tap((data: SearchResponseJson) => {
                this.nhits = data.nhits;
                this.isBibListLoaded = true;
            })
        );
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
