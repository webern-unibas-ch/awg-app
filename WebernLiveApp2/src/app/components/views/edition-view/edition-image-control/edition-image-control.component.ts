import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'awg-edition-image-control',
    templateUrl: './edition-image-control.component.html',
    styleUrls: ['./edition-image-control.component.css']
})
export class EditionImageControlComponent implements OnInit {
    @Input() sheet: string;
    @Input() sheets: string[];

    constructor() { }

    ngOnInit() {
        console.log('sheets: ', this.sheets);
    }

    isActiveSheet(id: string) {
        console.log('FUNC activeSheet called from ImageControl:');
        return this.sheet == id;
    }

    selectSVG(id) {
        // TODO: turn into real function
        console.log('FUNC selectSVG called from ImageControl with id:', id);
    }

}
