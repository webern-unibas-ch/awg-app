import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Textcritics } from '../../models/index';

@Component({
    selector: 'awg-edition-tka-table',
    templateUrl: './edition-tka-table.component.html',
    styleUrls: ['./edition-tka-table.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditionTkaTableComponent implements OnInit {
    @Input()
    selectedTextcritics: Textcritics[];
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

    ref: EditionTkaTableComponent;

    constructor() {
        this.ref = this;
    }

    ngOnInit() {}

    openModal(id: string) {
        this.openModalRequest.emit(id);
    }

    selectSvgSheet(id: string): void {
        this.selectSvgSheetRequest.emit(id);
    }
}
