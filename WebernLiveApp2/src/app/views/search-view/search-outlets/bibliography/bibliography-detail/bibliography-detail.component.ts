import { Component, OnInit, Input } from '@angular/core';
import { SubjectItemJson } from '../../../../../api-service/api-objects';

@Component({
    selector: 'awg-bibliography-detail',
    templateUrl: './bibliography-detail.component.html',
    styleUrls: ['./bibliography-detail.component.css']
})
export class BibliographyDetailComponent implements OnInit {
    @Input() bibItem: SubjectItemJson;

    constructor() { }

    ngOnInit() {

    }

}
