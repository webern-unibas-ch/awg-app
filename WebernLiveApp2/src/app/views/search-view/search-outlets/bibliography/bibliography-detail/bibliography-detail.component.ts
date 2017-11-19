import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { ResourceFullResponseJson } from '../../../../../shared/api-objects';

import { BibliographyService } from '../../../services';
import { ConversionService } from '../../../../../core/services/conversion-service/conversion.service';

@Component({
    selector: 'awg-bibliography-detail',
    templateUrl: './bibliography-detail.component.html',
    styleUrls: ['./bibliography-detail.component.css']
})
export class BibliographyDetailComponent implements OnInit, OnDestroy {
    @Input() objId: string;

    // TODO#change to Type: BibEntry
    convertedBibItemDetail: any;
    sub: Subscription;

    constructor(
        private bibliographyService: BibliographyService,
        private conversionService: ConversionService
    ) { }

    ngOnInit() {
        this.getBibItemDetails(this.objId);
    }

    getBibItemDetails(id: string): void {
        this.sub = this.bibliographyService.getBibliographyItemDetail(id)
            .subscribe(data => {
                let bibItemDetailBody: ResourceFullResponseJson = new ResourceFullResponseJson();
                if (data['body']) { bibItemDetailBody = data['body']; }
                this.convertedBibItemDetail = this.conversionService.convertObjectProperties(bibItemDetailBody);
                console.log('convertedItem: ', this.convertedBibItemDetail);
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
