import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubjectItemJson, ResourceFullResponseJson } from '../../../../../api-service/api-objects';
import { BibliographyService } from '../bibliography.service';

@Component({
    selector: 'awg-bibliography-list',
    templateUrl: './bibliography-list.component.html',
    styleUrls: ['./bibliography-list.component.css']
})
export class BibliographyListComponent implements OnInit {
    @Input() bibList: SubjectItemJson[];
    @Output() selectItemRequest: EventEmitter<SubjectItemJson> = new EventEmitter();

    private selectedBibItem: SubjectItemJson = new SubjectItemJson();

    constructor() { }

    ngOnInit() {
        console.log('ListComp#bibList' , this.bibList);
    }

    selectItem(item: SubjectItemJson) {
        this.selectedBibItem = item;
        this.selectItemRequest.emit(item);
    }

}
