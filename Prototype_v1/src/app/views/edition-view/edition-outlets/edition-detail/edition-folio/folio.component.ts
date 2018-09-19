import { Component, Input, OnInit } from '@angular/core';

import { FolioData, FolioFormatOptions } from '@awg-views/edition-view/models';


@Component({
    selector: 'awg-edition-folio',
    templateUrl: './folio.component.html',
    styleUrls: ['./folio.component.css']
})
export class FolioComponent implements OnInit {
    @Input() folioData: FolioData[];

    folioFormatOptions: FolioFormatOptions = new FolioFormatOptions();

    constructor( ) { }

    ngOnInit() {
        this.initSvgInput();
    }

    initSvgInput() {
        this.folioFormatOptions.factor = 1;
        this.folioFormatOptions.formatX = 180;
        this.folioFormatOptions.formatY = 267;
        this.folioFormatOptions.initialOffsetX = 50;
        this.folioFormatOptions.initialOffsetY = 35;
        this.folioFormatOptions.numberOfSheets = this.folioData.length;
    }

}
