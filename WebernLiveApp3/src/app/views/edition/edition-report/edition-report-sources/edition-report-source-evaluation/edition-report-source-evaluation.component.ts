import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'awg-edition-report-source-evaluation',
    templateUrl: './edition-report-source-evaluation.component.html',
    styleUrls: ['./edition-report-source-evaluation.component.css']
})
export class EditionReportSourceEvaluationComponent implements OnInit {
    @Output() openModalRequest: EventEmitter<any> = new EventEmitter();
    @Output() scrollRequest: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    openModal(identifier: string) {
        this.openModalRequest.emit(identifier);
    }

    scrollTo(id: string) {
        this.scrollRequest.emit(id);
    }
}
