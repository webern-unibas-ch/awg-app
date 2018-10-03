import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Sheet, SvgOverlay, Textcritics } from '../models';
import { DataService, EditionService } from '../services';

@Component({
    selector: 'awg-edition-detail',
    templateUrl: './edition-detail.component.html',
    styleUrls: ['./edition-detail.component.css']
})
export class EditionDetailComponent implements OnInit {

    public overlayData: SvgOverlay[];
    public sheetsData: Sheet[];
    public textcriticsData: Textcritics[];

    public overlays: SvgOverlay[];
    public selectedSheet: Sheet;
    public textcritics: Textcritics[];
    public selectedTextcriticId: string;

    private errorMessage: string = undefined;
    private showTkA: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataService: DataService,
        private editionService: EditionService
    ) { }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.dataService.getEditionDetailData()
            .subscribe((data) => {
                    this.overlayData = data[0];
                    this.sheetsData = data[1];
                    this.textcriticsData = data[2];
                    if (this.sheetsData && this.overlayData) this.getRouteParams();
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

    private getRouteParams() {
        this.route.params.forEach((params: Params) => {
            // if there is no id in route params
            // take first entry of sheets object as default
            let sheetId: string = params['id'] ? params['id'] : Object.keys(this.sheetsData)[0];
            this.selectedSheet = this.sheetsData[sheetId];
            this.overlays = this.overlayData[sheetId];
            console.log('EdDetail#getRouteParams, overlays: ', this.overlays);
        })
    }


    onOpenEditionDialog(identifier: string) {
        this.editionService.openEditionDialog(identifier);
    }


    onSheetSelect(id: string) {
        this.router.navigate(['/edition/detail', id]);
        this.selectedSheet = this.sheetsData[id];
        this.overlays = this.overlayData[id];
        this.selectedTextcriticId = '';
        this.showTkA = false;
    }


    onTextcriticSelect($event) {
        if (!this.textcriticsData && !this.selectedSheet) return;
        let res = this.editionService.getCommentsForItem(this.textcriticsData[this.selectedSheet.id], $event.field, $event.id);
        this.textcritics = res[0];
        this.selectedTextcriticId = res[1];
        this.showTkA = (this.textcritics !== []);
    }

}
