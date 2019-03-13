import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {
    ConvoluteFolio,
    EditionSvgFile,
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
    convoluteData: ConvoluteFolio[];

    svgFileData: EditionSvgFile[];
    selectedSvgFile: EditionSvgFile;

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
            (data: [ConvoluteFolio[], EditionSvgFile[], TextcriticsList]) => {
                this.convoluteData = data[0]['convolute'];
                this.svgFileData = data[1];
                this.textcriticsData = data[2];
                if (this.svgFileData) {
                    this.getRouteParams();
                }
            },
            error => {
                this.errorMessage = <any>error;
            }
        );
    }

    private getRouteParams(): void {
        this.route.params.forEach((params: Params) => {
            // if there is no id in route params
            // take first entry of svg file object as default
            const fileId: string = params['id'] ? params['id'] : Object.keys(this.svgFileData)[0];
            this.selectedSvgFile = this.svgFileData[fileId];
        });
    }

    onSvgFileSelect(id: string): void {
        this.selectedSvgFile = this.svgFileData[id];
        this.showTkA = false;
        this.router.navigate(['/edition/detail', id]);
    }

    onTextcriticSelect($event: EditionSvgOverlay): void {
        if (!this.textcriticsData && !this.selectedSvgFile) {
            return;
        }

        // shortcut
        const textcritics = this.textcriticsData[this.selectedSvgFile.id];

        this.selectedOverlay = $event;
        this.selectedTextcritics = this.editionService.getTextcritics(textcritics, this.selectedOverlay);
        this.showTkA = this.selectedTextcritics !== [];
    }
}
