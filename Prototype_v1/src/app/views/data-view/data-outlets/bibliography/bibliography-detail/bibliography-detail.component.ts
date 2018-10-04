import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subscription } from 'rxjs';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';

import { BibliographyService } from '@awg-views/data-view/services';
import { ConversionService } from '@awg-core/services/conversion-service/conversion.service';

@Component({
    selector: 'awg-bibliography-detail',
    templateUrl: './bibliography-detail.component.html',
    styleUrls: ['./bibliography-detail.component.css']
})
export class BibliographyDetailComponent implements OnInit, OnDestroy {
    @Input() objId: string;

    // TODO#change to Type: BibEntry
    convertedBibItemDetail: any;
    bibItemDetailSubscription: Subscription;

    constructor(
        private bibliographyService: BibliographyService,
        private conversionService: ConversionService
    ) { }

    ngOnInit() {
        this.getBibItemDetails(this.objId);
    }

    getBibItemDetails(id: string): void {
        this.bibItemDetailSubscription = this.bibliographyService.getBibliographyItemDetail(id)
            .subscribe(data => {
                const bibItemDetailBody: ResourceFullResponseJson = {...data};
                this.convertedBibItemDetail = this.conversionService.convertObjectProperties(bibItemDetailBody);
                console.log('convertedItem: ', this.convertedBibItemDetail);
            });
    }

    ngOnDestroy() {
        if (this.bibItemDetailSubscription) {
            this.bibItemDetailSubscription.unsubscribe();
        }
    }

}
