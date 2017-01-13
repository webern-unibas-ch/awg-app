import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Sheet } from '../../../sheet';

@Component({
    selector: 'awg-edition-sheet-control',
    templateUrl: './edition-sheet-control.component.html',
    styleUrls: ['./edition-sheet-control.component.css']
})
export class EditionSheetControlComponent implements OnInit {
    @Input() sheets: Sheet[];
    @Output() selectSheetRequest: EventEmitter<any> = new EventEmitter();

    private selectedSheet: Sheet;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router
    ) {}

    ngOnInit() {
        this._route.params.forEach((params: Params) => {
            // if there is no id in route params
            // take first entry of sheets object as default
            let sheetId: string = params['id'] ? params['id'] : Object.keys(this.sheets)[0];
            this.selectedSheet = this.sheets[sheetId];
        })
    }

    private isSelectedSheet(sheet: Sheet) {
        return sheet.id === this.selectedSheet.id;
    }

    private selectSheet(sheet: Sheet) {
        this.selectedSheet = sheet;
        this.selectSheetRequest.emit(sheet);
    }

    /**
     * not needed at the moment / store for later use

        private goToOverview() {
            let sheetId: string = this.selectedSheet ? this.selectedSheet.id : null;
            this._router.navigate(['edition', 'intro', {id: sheetId}]);
        }
    */

}
