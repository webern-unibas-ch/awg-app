import { Component, OnInit, Input } from '@angular/core';
import { ResourceFullResponseJson } from '../../../../../shared/api-objects';
import { BibliographyService } from '../bibliography.service';

@Component({
    selector: 'awg-bibliography-detail',
    templateUrl: './bibliography-detail.component.html',
    styleUrls: ['./bibliography-detail.component.css']
})
export class BibliographyDetailComponent implements OnInit {
    @Input() objId: string;

    bibItemDetail: ResourceFullResponseJson;

    constructor(private _bibliographyService: BibliographyService) { }

    ngOnInit() {
        this.getBibItemDetails(this.objId);
    }

    getBibItemDetails(id: string): void {
        this._bibliographyService.getBibliographyItemDetail(id)
            .subscribe((bibItemDetail: ResourceFullResponseJson) => {
                this.bibItemDetail = bibItemDetail;
            })
    }

}
