import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService, EditionService } from '../services';
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
        private router: Router,
        private route: ActivatedRoute,
        private dataService: DataService,
        private editionService: EditionService
    ) { }

    ngOnInit() {
        this.getData();
        this.scrollTo();
    }

    public getData() {
        this.dataService.getEditionReportData()
            .subscribe((data) => {
                    this.sourceListData = data[0];
                    this.textcriticsData = data[1];
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

    public onOpenEditionDialog(identifier: string) {
        this.editionService.openEditionDialog(identifier);
    }

    public onSheetSelect(id: string) {
        this.router.navigate(['/edition/detail', id]);
    }

    public scrollTo(id?: string) {
        console.log('Report: scrollTo(id): ', id);
        // TODO - HACK: remove click once https://github.com/angular/angular/issues/6595 is fixed
        setTimeout(() => {
            this.route.fragment
                .subscribe(
                    f => {
                        if (!f) { return; }
                        // TODO: rm
                        console.log('Report#fragment(): ', f);
                        const element = document.querySelector('#' + f);
                        if (element) element.scrollIntoView(element);
                    }
                );
        });
    }
}
