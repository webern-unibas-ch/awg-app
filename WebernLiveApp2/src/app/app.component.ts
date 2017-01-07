import { Component, OnInit } from '@angular/core';
import { MetaData } from './shared/metadata';

@Component({
    selector: 'awg-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public metaData: MetaData;

    ngOnInit() {
        this.metaData = {
            page: {
                year_start: 2015,
                year_recent: (new Date()).getFullYear(),
                // TODO: change to 0.1.0 with current date
                version: '0.0.9', //RELEASE 21.11.2016
                version_release_date: '21. November 2016'
            },
            edition: {
                editors: '<a href="http://anton-webern.ch/index.php?id=3" target="_blank">Thomas Ahrend</a>',
                lastModified: '29. Januar 2016'
            }
        };
        // TODO: rm
        console.info('metaData: ', this.metaData);
    }

}
