import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Source, Textcritics } from '../../models';
import { DataService, EditionService } from '../../services';

@Component({
    selector: 'awg-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
    public reportTitle = 'Kritischer Bericht';
    public reportId = 'report';

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

    public onSheetSelect(id: string) {
        this.router.navigate(['/edition/detail', id]);
    }

    private scrollTo(id?: string) {
        console.log('Report: scrollTo(id): ', id);
        // TODO - HACK: remove click once https://github.com/angular/angular/issues/6595 is fixed
        setTimeout(() => {
            this.route.fragment.subscribe(f => {
                        if (!f) { return; }
                        const element = document.querySelector('#' + f);
                        if (element) element.scrollIntoView();
                    }
                );
        });
    }

}
