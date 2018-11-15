import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subscription } from 'rxjs';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';

import { BibliographyService } from '@awg-views/data-view/services';
import { ConversionService } from '@awg-core/services/conversion-service/conversion.service';

class BibItemDetail {
    subscription: Subscription;
    body: ResourceFullResponseJson;
    converted: any; // TODO#change to Type: BibEntry
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

    constructor(private bibliographyService: BibliographyService, private conversionService: ConversionService) {}

    ngOnInit() {
        this.getBibItemDetails(this.objId);
    }

    getBibItemDetails(id: string): void {
        this.bibItemDetail.subscription = this.bibliographyService.getBibliographyItemDetail(id).subscribe(data => {
            this.bibItemDetail.body = { ...data };
            this.bibItemDetail.converted = this.conversionService.convertObjectProperties(this.bibItemDetail.body);
        });
    }

    ngOnDestroy() {
        if (this.bibItemDetail.subscription) {
            this.bibItemDetail.subscription.unsubscribe();
        }
    }
}
