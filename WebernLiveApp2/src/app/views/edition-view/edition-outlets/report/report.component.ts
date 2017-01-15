import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditionService } from '../../edition.service';

@Component({
    selector: 'awg-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

    public reportTitle: string = 'Kritischer Bericht';
    public reportId: string = 'report';

    public sourceListData: string;
    public textcriticsData: string;
    private errorMessage: string = undefined;

    constructor(
        private _route: ActivatedRoute,
        private _editionService: EditionService
    ) { }

    ngOnInit() {
        this.getSourceList();
        this.getComments();
        this.scrollTo();
    }

    private getSourceList() {
        this._editionService.getJsonData('/sourcelist.json')
            .subscribe(
                (data) => {
                    this.sourceListData = data;
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

    private getComments() {
        this._editionService.getJsonData('/textcritics.json')
            .subscribe(
                (data) => {
                    this.textcriticsData = data;
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
                        console.log('Report: fragment(): ', f);
                        const element = document.querySelector('#' + f);
                        if (element) element.scrollIntoView(element);
                    }
                );
        });
    }

}
