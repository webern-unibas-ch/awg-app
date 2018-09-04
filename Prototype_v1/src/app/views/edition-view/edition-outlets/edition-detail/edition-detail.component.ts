import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Sheet, Textcritics } from '@awg-views/edition-view/models';
import { DataService, EditionService } from '@awg-views/edition-view/services';

@Component({
    selector: 'awg-edition-detail',
    templateUrl: './edition-detail.component.html',
    styleUrls: ['./edition-detail.component.css']
})
export class EditionDetailComponent implements OnInit {

    sheetsData: Sheet[];
    textcriticsData: Textcritics[];

    selectedSheet: Sheet;
    selectedTextcriticId: string;
    selectedTextcritics: Textcritics[];

    errorMessage: string = undefined;
    showTkA: boolean = false;

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
                    this.sheetsData = data[0];
                    this.textcriticsData = data[1];
                    if (this.sheetsData) { this.getRouteParams(); }
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }


    private getRouteParams(): void {
        this.route.params.forEach((params: Params) => {
            // if there is no id in route params
            // take first entry of sheets object as default
            let sheetId: string = params['id'] ? params['id'] : Object.keys(this.sheetsData)[0];
            this.selectedSheet = this.sheetsData[sheetId];
        });
    }

    onSheetSelect(id: string): void {
        this.selectedSheet = this.sheetsData[id];
        this.selectedTextcriticId = '';
        this.showTkA = false;
        this.router.navigate(['/edition/detail', id]);
    }

    onTextcriticSelect($event): void {
        if (!this.textcriticsData && !this.selectedSheet) { return; }
        let res = this.editionService.getCommentsForItem(this.textcriticsData[this.selectedSheet.id], $event.field, $event.id);
        this.selectedTextcritics = res[0];
        this.selectedTextcriticId = res[1];
        this.showTkA = (this.selectedTextcritics !== []);
    }

}
