import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sheet } from '../../../sheet';

@Component({
    selector: 'awg-edition-svg-panel',
    templateUrl: './edition-svg-panel.component.html',
    styleUrls: ['./edition-svg-panel.component.css']
})
export class EditionSvgPanelComponent implements OnInit {
    @Input() sheets: Sheet[];
    @Input() selectedSheet: Sheet;
    @Input() selectedItem: string;
    @Output() selectSheetRequest: EventEmitter<any> = new EventEmitter();
    @Output() selectItemRequest: EventEmitter<any> = new EventEmitter();

    // init sheets
    // TODO: necessary?
    sheet2: string ='Aa:SkI/2';
    sheet3: string ='Aa:SkI/3';
    sheet4: string ='Aa:SkI/4';
    sheet5: string ='Aa:SkI/5';
    sheet: string = this.sheet2;

    constructor() { }

    ngOnInit() {
    }

    isSelectedSheet(sheet: Sheet) {
        return sheet.id === this.selectedSheet.id;
    }

    isSelectedItem(id: string) {
        return id === this.selectedItem;
    };

    selectItem(field: string, id: string) {
        this.selectItemRequest.emit({field, id});
    }

    selectSheet(sheet: Sheet) {
        this.selectSheetRequest.emit(sheet);
    }

}
