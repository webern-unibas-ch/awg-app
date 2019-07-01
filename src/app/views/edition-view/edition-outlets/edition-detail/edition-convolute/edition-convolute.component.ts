import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Folio, EditionSvgSheet } from '@awg-views/edition-view/models';
import { faSquare } from '@fortawesome/free-solid-svg-icons/faSquare';

@Component({
    selector: 'awg-edition-convolute',
    templateUrl: './edition-convolute.component.html',
    styleUrls: ['./edition-convolute.component.css']
})
export class EditionConvoluteComponent implements OnInit {
    @Input()
    convoluteData: Folio[];
    @Input()
    selectedSvgFile: EditionSvgSheet;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgFileRequest: EventEmitter<string> = new EventEmitter();

    faSquare = faSquare;

    selectedConvoluteLabel: string;
    convoluteLabel = {
        A: 'A Skizzen (Basel, Paul Sacher Stiftung)',
        B_H: 'B–H (siehe Kritischer Bericht)'
    };

    folioLegend = [
        {
            color: 'olivedrab',
            label: 'aktuell ausgewählt'
        },
        {
            color: 'orange',
            label: 'auswählbar'
        },
        {
            color: 'grey',
            label: '(momentan noch) nicht auswählbar'
        }
    ];

    constructor() {}

    ngOnInit() {
        this.selectedConvoluteLabel = this.convoluteLabel.A;
    }

    selectConvolute(convoluteLabel: string) {
        this.selectedConvoluteLabel = convoluteLabel;
    }

    // request function to emit modal id
    openModal(id: string) {
        this.openModalRequest.emit(id);
    }

    // request function to emit selected sheet id
    selectSvgFile(id: string) {
        this.selectSvgFileRequest.emit(id);
    }
}
