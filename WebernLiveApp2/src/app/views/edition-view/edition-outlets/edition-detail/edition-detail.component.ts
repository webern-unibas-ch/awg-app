import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Sheet } from '../../sheet';
import { Textcritics } from '../../textcritics';
import { EditionService } from '../../edition.service';

@Component({
    selector: 'awg-edition-detail',
    templateUrl: './edition-detail.component.html',
    styleUrls: ['./edition-detail.component.css']
})
export class EditionDetailComponent implements OnInit {

    public items: Textcritics[];
    public selectedItem: string;
    public selectedSheet: Sheet;
    public sheetsData: Sheet[];
    public textcriticsData: Textcritics[];

    private errorMessage: string = undefined;
    private showTkA: boolean = false;

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
    }

    onSheetSelect(sheet: Sheet) {
        this._router.navigate(['/edition/detail', sheet.id]);
        this.selectedSheet = sheet;
        this.selectedItem = '';
        this.showTkA = false;
    }

    private getCommentsData() {
        this._editionService.getCommentsData()
            .then((data: Textcritics[]) => {
                    this.textcriticsData = data;
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

    private getSheetsData() {
        this._editionService.getSheetsData()
            .then((data: Sheet[]) => {
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

    private getCommentForItem(field: string, id: string) {
        this.items = [];
        switch (field) {
            case 'measure':
                this.selectedItem = 'm' + id;
                this.items = this.getCommentForItemValue(this.textcriticsData[this.selectedSheet.id], field, id);
                break;
            case 'system':
                this.selectedItem = 's' + id;
                this.items = this.getCommentForItemValue(this.textcriticsData[this.selectedSheet.id], field, id);
                break;
            case 'single':
                this.selectedItem = id;

                this.items.push(this.textcriticsData[this.selectedSheet.id][id]);
                break;
        }
        this.showTkA = (this.items !== []);
    }

    private getCommentForItemValue(item: Textcritics[], field: string, id: string) {
        let arr = [];
        item.forEach((comment) => {
            // trim existing values
            let tkaValue: string = comment[field] ? comment[field].replace("[", "").replace("]", "") : null;
            // check if value matches id
            if (tkaValue == id) {
                arr.push(comment);
            }
        });
        return arr;
    }


}
