import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EditionService } from '../edition.service';
import { Source, Textcritics } from '../models';

@Component({
    selector: 'awg-edition-report',
    templateUrl: './edition-report.component.html',
    styleUrls: ['./edition-report.component.css']
})
export class EditionReportComponent implements OnInit {

    public reportTitle: string = 'Kritischer Bericht';
    public reportId: string = 'report';

    public sourceListData: Source[];
    public textcriticsData: Textcritics[];
    private errorMessage: string = undefined;

    constructor(
        private _route: ActivatedRoute,
        private _editionService: EditionService
    ) { }

    ngOnInit() {
        this.getSourceListAndCommentsData();
        this.scrollTo();
    }

    private getSourceListAndCommentsData() {
        this._editionService.getSourceListAndCommentsData()
            .subscribe((data) => {
                    this.sourceListData = data[0];
                    this.textcriticsData = data[1];
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

    private scrollTo(id?: string) {
        console.log('Report: scrollTo(id): ', id);
        // TODO - HACK: remove click once https://github.com/angular/angular/issues/6595 is fixed
        setTimeout(() => {
            this._route.fragment
                .subscribe(
                    f => {
                        if (!f) { return; };
                        console.log('Report#fragment(): ', f);
                        const element = document.querySelector('#' + f);
                        if (element) element.scrollIntoView(element);
                    }
                );
        });
    }

}
