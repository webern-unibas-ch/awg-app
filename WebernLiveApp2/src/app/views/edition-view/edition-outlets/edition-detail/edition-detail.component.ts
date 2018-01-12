import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Sheet, Textcritics } from '../../models';
import { DataService, EditionService } from '../../services';

@Component({
    selector: 'awg-edition-detail',
    templateUrl: './edition-detail.component.html',
    styleUrls: ['./edition-detail.component.css']
})
export class EditionDetailComponent implements OnInit {

    public sheetsData: Sheet[];
    public textcriticsData: Textcritics[];

    public selectedSheet: Sheet;
    public selectedTextcriticId: string;
    public selectedTextcritics: Textcritics[];

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

    public getData() {
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


    private getRouteParams() {
        this.route.params.forEach((params: Params) => {
            // if there is no id in route params
            // take first entry of sheets object as default
            let sheetId: string = params['id'] ? params['id'] : Object.keys(this.sheetsData)[0];
            this.selectedSheet = this.sheetsData[sheetId];
        });
    }

    public onSheetSelect(id: string) {
        this.router.navigate(['/edition/detail', id]);
        this.selectedSheet = this.sheetsData[id];
        this.selectedTextcriticId = '';
        this.showTkA = false;
    }

    public onTextcriticSelect($event) {
        if (!this.textcriticsData && !this.selectedSheet) return;
        let res = this.editionService.getCommentsForItem(this.textcriticsData[this.selectedSheet.id], $event.field, $event.id);
        this.selectedTextcritics = res[0];
        this.selectedTextcriticId = res[1];
        this.showTkA = (this.selectedTextcritics !== []);
    }

}
