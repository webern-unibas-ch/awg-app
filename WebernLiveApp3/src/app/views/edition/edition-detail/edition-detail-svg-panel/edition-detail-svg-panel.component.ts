import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Sheet } from '../../models';

@Component({
    selector: 'awg-edition-detail-svg-panel',
    templateUrl: './edition-detail-svg-panel.component.html',
    styleUrls: ['./edition-detail-svg-panel.component.css']
})
export class EditionDetailSvgPanelComponent implements OnInit {
    @Input() sheets: Sheet[];
    @Input() selectedSheet: Sheet;
    @Input() selectedItem: string;
    @Output() selectSheetRequest: EventEmitter<Sheet> = new EventEmitter();
    @Output() selectItemRequest: EventEmitter<any> = new EventEmitter();

    // init sheets
    // TODO: other solution possible?
    sheet2: string ='Aa:SkI/2';
    sheet3: string ='Aa:SkI/3';
    sheet4: string ='Aa:SkI/4';
    sheet5: string ='Aa:SkI/5';

    constructor() { }

    ngOnInit() {
    }

    isSelectedSheet(id: string) {
        return id === this.selectedSheet.id;
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
