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

@Component({
    selector: 'awg-bibliography-detail',
    templateUrl: './bibliography-detail.component.html',
    styleUrls: ['./bibliography-detail.component.css']
})
export class BibliographyDetailComponent implements OnInit, OnDestroy {
    @Input()
    objId: string;

    bibItemDetail: BibItemDetail = new BibItemDetail();
    subscription: Subscription;

    constructor(private bibliographyService: BibliographyService, private conversionService: ConversionService) {}

    ngOnInit() {
        this.getBibItemDetails(this.objId);
    }

    getBibItemDetails(id: string): void {
        this.subscription = this.bibliographyService.getBibliographyItemDetail(id).subscribe(data => {
            this.bibItemDetail.rawData = { ...data };
            this.bibItemDetail.convertedData = this.conversionService.convertObjectProperties(
                this.bibItemDetail.rawData
            );
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
