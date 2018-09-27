import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Folio, Sheet, Textcritics} from "@awg-views/edition-view/models";

@Component({
    selector: 'awg-edition-accolade',
    templateUrl: './edition-accolade.component.html',
    styleUrls: ['./edition-accolade.component.css']
})
export class EditionAccoladeComponent implements OnInit {
    @Input() sheetsData: Sheet[];
    @Input() selectedSheet: Sheet;
    @Input() selectedTextcritics: Textcritics[];
    @Input() selectedTextcriticId: string;
    @Input() showTkA: boolean;
    @Output() openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectSheetRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectTextcriticRequest: EventEmitter<{field: string, id: string}> = new EventEmitter();

    showAccoladePanel: boolean = true;

    constructor() { }

    ngOnInit() {
    }

    // request function to emit modal id
    openModal(id: string) {
        this.openModalRequest.emit(id);
    }


    // request function to emit selected sheet id
    selectSheet(id: string) {
        this.selectSheetRequest.emit(id);
    }

    // request function to emit selected textcritic's field & id
    selectTextcritic($event) {
        this.selectTextcriticRequest.emit($event);
    }


    // helper function to toggle panel
    togglePanel(): boolean {
        return this.showAccoladePanel = !this.showAccoladePanel;
    }

}
