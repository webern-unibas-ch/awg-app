import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Textcritics } from '../../models';

@Component({
    selector: 'awg-edition-report-textcritics',
    templateUrl: './edition-report-textcritics.component.html',
    styleUrls: ['./edition-report-textcritics.component.css']
})
export class EditionReportTextcriticsComponent implements OnInit {
    @Input() comments: Textcritics[];
    @Output() openDialogRequest: EventEmitter<any> = new EventEmitter();

    public groupStatus: any = {
        isOpen: false
    };

    constructor() { }

    ngOnInit() {
    }

    openEditionDialog(identifier: string) {
        this.openDialogRequest.emit(identifier);
    }

    // TODO: self-sanitize content of comments (loaded from textcritics.json)

}
