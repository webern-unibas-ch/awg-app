import { Component, Input, OnInit } from '@angular/core';
import { MetaData } from '../metadata';

@Component({
    selector: 'awg-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    @Input() meta: MetaData;
    private year_start: number;
    private year_recent: number;
    private version: string;
    private version_release_date: string;

    constructor() { }

    ngOnInit() {
        this.year_start = this.meta.page.year_start;
        this.year_recent = this.meta.page.year_recent;
        this.version = this.meta.page.version;
        this.version_release_date = this.meta.page.version_release_date;
    }

}
