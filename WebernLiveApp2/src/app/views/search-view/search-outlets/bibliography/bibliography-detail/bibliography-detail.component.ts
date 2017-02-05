import { Component, OnInit, Input } from '@angular/core';
import { ResourceFullResponseJson } from '../../../../../shared/api-objects';
import { BibliographyService } from '../bibliography.service';
import { ConversionService } from '../../../../../core/services/conversion-service/conversion.service';

@Component({
    selector: 'awg-bibliography-detail',
    templateUrl: './bibliography-detail.component.html',
    styleUrls: ['./bibliography-detail.component.css']
})
export class BibliographyDetailComponent implements OnInit {
    @Input() objId: string;

    bibItemDetail: ResourceFullResponseJson;
    convertedDetail: any; // TODO

    constructor(
        private _bibliographyService: BibliographyService,
        private _conversionService: ConversionService
    ) { }

    ngOnInit() {
        this.getBibItemDetails(this.objId);
    }

    getBibItemDetails(id: string): void {
        this._bibliographyService.getBibliographyItemDetail(id)
            .subscribe((bibItemDetail: ResourceFullResponseJson) => {
                this.bibItemDetail = bibItemDetail;

            })
    }

    convertBibResponse(bibItemDetail: ResourceFullResponseJson) {
        let selectionObj: Array<string>;
        // TODO
        this.convertedDetail = this._conversionService.convertObjectProperties(bibItemDetail, selectionObj);
    }

}
