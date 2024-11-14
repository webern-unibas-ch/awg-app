import { Component, inject, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConversionService } from '@awg-core/services';
import { ResourceFullResponseJson } from '@awg-shared/api-objects';
import { BibliographyService } from '@awg-views/data-view/services';
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
    styleUrls: ['./bibliography-detail.component.scss'],
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
     * Private readonly injection variable: _bibliographyService.
     *
     * It keeps the instance of the injected BibliographyService.
     */
    private readonly _bibliographyService = inject(BibliographyService);

    /**
     * Private readonly injection variable: _conversionService.
     *
     * It keeps the instance of the injected ConversionService.
     */
    private readonly _conversionService = inject(ConversionService);

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
        this.bibEntry$ = this._bibliographyService
            .getBibliographyItemDetail(id)
            .pipe(map((data: ResourceFullResponseJson) => this._conversionService.convertObjectProperties(data)));
    }
}
