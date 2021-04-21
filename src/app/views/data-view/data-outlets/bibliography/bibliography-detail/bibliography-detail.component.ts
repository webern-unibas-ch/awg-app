import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';
import { BibliographyService } from '@awg-views/data-view/services';
import { ConversionService } from '@awg-core/services';
import { BibEntry } from '../bibliography-entry.model';

/**
 * The BibliographyDetail component.
 *
 * It contains the bibliography item detail
 * of the search view of the app.
 */
@Component({
    selector: 'awg-bibliography-detail',
    templateUrl: './bibliography-detail.component.html',
    styleUrls: ['./bibliography-detail.component.css']
})
export class BibliographyDetailComponent implements OnInit {
    /**
     * Input variable: objId.
     *
     * It keeps the id of a resource object.
     */
    @Input()
    objId: string;

    /**
     * Public variable: bibEntry$.
     *
     * Observable that keeps the bibEntry for the bibliography detail.
     */
    bibEntry$: Observable<BibEntry>;

    /**
     * Constructor of the BibliographyDetailComponent.
     *
     * It declares a private BibliographyService instance
     * to get the bibliography item detail
     * and a private ConversionService instance.
     *
     * @param {BibliographyService} bibliographyService Instance of the BibliographyService.
     * @param {ConversionService} conversionService Instance of the ConversionService.
     */
    constructor(private bibliographyService: BibliographyService, private conversionService: ConversionService) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getBibEntry(this.objId);
    }

    /**
     * Public method: getBibEntry.
     *
     * It calls the BibliographyService to provide
     * the data for the bibliography entry.
     *
     * @returns {void} Sets the bibEntry observable.
     */
    getBibEntry(id: string): void {
        this.bibEntry$ = this.bibliographyService
            .getBibliographyItemDetail(id)
            .pipe(map((data: ResourceFullResponseJson) => this.conversionService.convertObjectProperties(data)));
    }
}
