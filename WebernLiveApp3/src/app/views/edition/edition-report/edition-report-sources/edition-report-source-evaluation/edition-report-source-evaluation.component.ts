import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'awg-edition-report-source-evaluation',
    templateUrl: './edition-report-source-evaluation.component.html',
    styleUrls: ['./edition-report-source-evaluation.component.css']
})
export class EditionReportSourceEvaluationComponent implements OnInit {
    @Output() openDialogRequest: EventEmitter<string> = new EventEmitter();
    @Output() scrollRequest: EventEmitter<string> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    openEditionDialog(identifier: string) {
        this.openDialogRequest.emit(identifier);
    }

    scrollTo(id: string) {
        this.scrollRequest.emit(id);
    }
}
