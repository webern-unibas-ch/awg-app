import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sheet } from '../../../sheet';

@Component({
    selector: 'awg-edition-svg-panel',
    templateUrl: './edition-svg-panel.component.html',
    styleUrls: ['./edition-svg-panel.component.css']
})
export class EditionSvgPanelComponent implements OnInit {
    @Input() selectedSheet: Sheet;
    @Input() selectedTextcriticId: string;
    @Output() selectSheetRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectTextcriticRequest: EventEmitter<any> = new EventEmitter();

    // init sheets
    // TODO: other solution possible?
    sheet2: string ='Aa:SkI/2';
    sheet3: string ='Aa:SkI/3';
    sheet4: string ='Aa:SkI/4';
    sheet5: string ='Aa:SkI/5';

    constructor() { }

    ngOnInit() {
    }

    isSelectedTextcritic(id: string) {
        return id === this.selectedTextcriticId;
    }

    isSelectedSheet(id: string) {
        return id === this.selectedSheet.id;
    };

    selectTextcritic(field: string, id: string) {
        this.selectTextcriticRequest.emit({field, id});
    }

    selectSheet(id: string) {
        this.selectSheetRequest.emit(id);
    }

}
