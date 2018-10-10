import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SourceList, TextcriticsList } from '@awg-views/edition-view/models';
import { DataService } from '@awg-views/edition-view/services';

@Component({
    selector: 'awg-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
    reportTitle = 'Kritischer Bericht';
    reportId = 'report';

    scrollPosition: [number, number];

    sourceListData: SourceList;
    textcriticsData: TextcriticsList;
    private errorMessage: string = undefined;

    constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService) {}

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.dataService.getEditionReportData().subscribe(
            (data: [SourceList, TextcriticsList]) => {
                this.sourceListData = data[0];
                this.textcriticsData = data[1];
            },
            error => {
                this.errorMessage = <any>error;
            }
        );
    }

    onSvgFileSelect(id: string) {
        this.router.navigate(['/edition/detail', id]);
    }
}
