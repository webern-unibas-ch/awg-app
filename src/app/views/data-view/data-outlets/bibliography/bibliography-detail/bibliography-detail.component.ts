import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subscription } from 'rxjs';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';

import { BibliographyService } from '@awg-views/data-view/services';
import { ConversionService } from '@awg-core/services/conversion-service/conversion.service';

/**
 * The BibItemDetail class.
 *
 * It is used in the context of the bibliography
 * to store the data of the details of a single
 * bibliographic item.
 */
class BibItemDetail {
    /**
     * The raw data response for a bib item detail.
     */
    rawData: ResourceFullResponseJson;

    /**
     * The converted data for a bib item detail.
     * @todo Change to Type: BibEntry.
     */
    convertedData: any;
}

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
export class BibliographyDetailComponent implements OnInit, OnDestroy {
    /**
     * Input variable: objId.
     *
     * It keeps the id of a resource object.
     */
    @Input()
    objId: string;

    /**
     * Public variable: bibItemDetail.
     *
     * It keeps the bibliography item detail.
     */
    bibItemDetail: BibItemDetail = new BibItemDetail();

    /**
     * Public variable: bibItemDetailSubscription.
     *
     * It keeps the subscription for the bibliography item detail data.
     */
    bibItemDetailSubscription: Subscription;

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
        this.getBibItemDetails(this.objId);
    }

    /**
     * Public method: getBibItemDetails.
     *
     * It calls the BibliographyService to provide
     * the bibliography item details.
     *
     * @returns {void} Sets the bibItemDetail variable.
     */
    getBibItemDetails(id: string): void {
        this.bibItemDetailSubscription = this.bibliographyService.getBibliographyItemDetail(id).subscribe(data => {
            this.bibItemDetail.rawData = { ...data };
            this.bibItemDetail.convertedData = this.conversionService.convertObjectProperties(
                this.bibItemDetail.rawData
            );
        });
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     *
     * Destroys subscriptions.
     */
    ngOnDestroy() {
        if (this.bibItemDetailSubscription) {
            this.bibItemDetailSubscription.unsubscribe();
        }
    }
}
