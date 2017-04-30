import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ResourceFullResponseJson } from '../../../../../shared/api-objects';
import { BibliographyService } from '../bibliography.service';
import { ConversionService } from '../../../../../core/services/conversion-service/conversion.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'awg-bibliography-detail',
    templateUrl: './bibliography-detail.component.html',
    styleUrls: ['./bibliography-detail.component.css']
})
export class BibliographyDetailComponent implements OnInit {
    @Input() objId: string;

    // TODO#change to Type: Bibentry
    convertedBibItemDetail: any;
    sub: Subscription;

    constructor(
        private _bibliographyService: BibliographyService,
        private _conversionService: ConversionService
    ) { }

    ngOnInit() {
        this.getBibItemDetails(this.objId);
    }

    getBibItemDetails(id: string): void {
        this.sub = this._bibliographyService.getBibliographyItemDetail(id)
            .subscribe((bibItemDetail: ResourceFullResponseJson) => {
                this.convertedBibItemDetail = this.convertBibResponse(bibItemDetail);
            })
    }

    private convertBibResponse(bibItemDetail: ResourceFullResponseJson) {
        return this._conversionService.convertObjectProperties(bibItemDetail);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
