import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Textcritics } from '../../models';

@Component({
    selector: 'awg-edition-report-textcritics',
    templateUrl: './edition-report-textcritics.component.html',
    styleUrls: ['./edition-report-textcritics.component.css']
})
export class EditionReportTextcriticsComponent implements OnInit {
    @Input() comments: Textcritics[];
    @Output() openModalRequest: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    openModal(identifier: string) {
        this.openModalRequest.emit(identifier);
    }

    // TODO: self-sanitize content of comments (loaded from textcritics.json)

}
