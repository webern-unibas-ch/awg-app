import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {
    Folio,
    EditionSvgSheet,
    EditionSvgOverlay,
    Textcritics,
    TextcriticsList
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

@Component({
    selector: 'awg-edition-detail',
    templateUrl: './edition-detail.component.html',
    styleUrls: ['./edition-detail.component.css']
})
export class EditionDetailComponent implements OnInit {
    convoluteData: Folio[];

    svgSheetsData: EditionSvgSheet[];
    selectedSvgSheet: EditionSvgSheet;

    textcriticsData: TextcriticsList;
    selectedTextcritics: Textcritics[];
    selectedOverlay: EditionSvgOverlay;

    errorMessage: string = undefined;
    showTkA = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private editionDataService: EditionDataService,
        private editionService: EditionService
    ) {}

    ngOnInit() {
        this.getEditionDetailData();
    }

    // get edition data
    getEditionDetailData() {
        this.editionDataService.getEditionDetailData().subscribe(
            (data: [Folio[], EditionSvgSheet[], TextcriticsList]) => {
                this.convoluteData = data[0]['convolute'];
                this.svgSheetsData = data[1];
                this.textcriticsData = data[2];
                if (this.svgSheetsData) {
                    this.getRouteParams();
                }
            },
            error => {
                this.errorMessage = error as any;
            }
        );
    }

    private getRouteParams(): void {
        this.route.params.forEach((params: Params) => {
            // if there is no id in route params
            // take first entry of svg sheets data as default
            const fileId: string = params['id'] ? params['id'] : Object.keys(this.svgSheetsData)[0];
            this.selectedSvgSheet = this.svgSheetsData[fileId];
        });
    }

    onSvgSheetSelect(id: string): void {
        this.selectedSvgSheet = this.svgSheetsData[id];
        this.showTkA = false;
        this.router.navigate(['/edition/detail', id]);
    }

    onTextcriticSelect($event: EditionSvgOverlay): void {
        if (!this.textcriticsData && !this.selectedSvgSheet) {
            return;
        }

        // shortcut
        const textcritics = this.textcriticsData[this.selectedSvgSheet.id];

        this.selectedOverlay = $event;
        this.selectedTextcritics = this.editionService.getTextcritics(textcritics, this.selectedOverlay);
        this.showTkA = this.selectedTextcritics !== [];
    }
}
