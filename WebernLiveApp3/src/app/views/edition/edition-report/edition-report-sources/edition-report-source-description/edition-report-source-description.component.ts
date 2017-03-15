import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'awg-edition-report-source-description',
    templateUrl: './edition-report-source-description.component.html',
    styleUrls: ['./edition-report-source-description.component.css']
})
export class EditionReportSourceDescriptionComponent implements OnInit {

    @Output() openModalRequest: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    openModal(identifier: string) {
        this.openModalRequest.emit(identifier);
    }

}
