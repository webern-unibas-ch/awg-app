import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ConvoluteFolio, EditionSvgFile, Textcritics } from '@awg-views/edition-view/models';
import { DataService, EditionService } from '@awg-views/edition-view/services';

@Component({
    selector: 'awg-edition-detail',
    templateUrl: './edition-detail.component.html',
    styleUrls: ['./edition-detail.component.css']
})
export class EditionDetailComponent implements OnInit {

    convoluteData: ConvoluteFolio[];

    svgFileData: EditionSvgFile[];
    selectedSvgFile: EditionSvgFile;

    textcriticsData: Textcritics[];
    selectedTextcritics: Textcritics[];
    selectedTextcriticId: string;

    errorMessage: string = undefined;
    showTkA: boolean = false;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataService: DataService,
        private editionService: EditionService
    ) { }

    ngOnInit() {
        this.getEditionDetailData();
    }


    // get edition data
    getEditionDetailData() {
        this.dataService.getEditionDetailData()
            .subscribe((data: [ConvoluteFolio[], EditionSvgFile[], Textcritics[]]) => {
                    this.convoluteData = data[0]['convolute'];
                    this.svgFileData = data[1];
                    this.textcriticsData = data[2];
                    if (this.svgFileData) { this.getRouteParams(); }
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
        this.selectedTextcriticId = '';
        this.showTkA = false;
        this.router.navigate(['/edition/detail', id]);
    }


    onTextcriticSelect($event): void {
        if (!this.textcriticsData && !this.selectedSvgFile) { return; }
        const res = this.editionService.getTextcritics(this.textcriticsData[this.selectedSvgFile.id], $event.field, $event.id);
        this.selectedTextcritics = res[0];
        this.selectedTextcriticId = res[1];
        this.showTkA = (this.selectedTextcritics !== []);
    }

}
