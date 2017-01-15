import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Sheet } from '../../sheet';
import { EditionService } from '../../edition.service';

@Component({
    selector: 'awg-edition-detail',
    templateUrl: './edition-detail.component.html',
    styleUrls: ['./edition-detail.component.css']
})
export class EditionDetailComponent implements OnInit {

    public items: Array<string>;
    public selectedItem: string;
    public selectedSheet: Sheet;
    public sheetsData: string;
    public textcriticsData: string;

    private errorMessage: string = undefined;
    private showTkA: boolean;

    // init sheets
    sheet2: string ='Aa:SkI/2';
    sheet3: string ='Aa:SkI/3';
    sheet4: string ='Aa:SkI/4';
    sheet5: string ='Aa:SkI/5';
    sheet: string = this.sheet2;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _editionService: EditionService
    ) { }

    ngOnInit() {
        this.getSheetsData();
        this.getCommentsData();
    }

    onItemSelect($event) {
        this.getCommentForItem($event.field, $event.id);
        this.showTkA = true;
    }

    onSheetSelect(sheet: Sheet) {
        this._router.navigate(['/edition/detail', sheet.id]);
        this.selectedSheet = sheet;
        this.selectedItem = '';
        this.showTkA = false;
    }

    private getCommentsData() {
        this._editionService.getJsonData('/textcritics.json')
            .subscribe(
                (data) => {
                    this.showTkA = false;
                    this.textcriticsData = data;
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

    private getSheetsData() {
        this._editionService.getJsonData('/sheets.json')
            .subscribe(
                (data) => {
                    this.sheetsData = data;
                    this.getRouteParams();
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

    private getRouteParams() {
        this._route.params.forEach((params: Params) => {
            // if there is no id in route params
            // take first entry of sheets object as default
            let sheetId: string = params['id'] ? params['id'] : Object.keys(this.sheetsData)[0];
            this.selectedSheet = this.sheetsData[sheetId];
        })
    }

    private getCommentForItem(field, id) {
        this.items = [];
        switch (field) {
            case 'measure':
                this.selectedItem = 'm' + id;
                this.items = this.getCommentForItemValue(this.textcriticsData[this.sheet], field, id);
                break;
            case 'system':
                this.selectedItem = 's' + id;
                this.items = this.getCommentForItemValue(this.textcriticsData[this.sheet], field, id);
                break;
            case 'single':
                this.selectedItem = id;
                this.items.push(this.textcriticsData[this.sheet][id]);
        }
    }

    private getCommentForItemValue(item, field, id) {
        let arr = [];
        item.forEach((entry) => {
            // trim values
            let tkaValue = entry[field].replace("[", "").replace("]", "");
            // check if value matches id
            if (tkaValue == id) {
                arr.push(entry);
            }
        });
        return arr;
    }


}
