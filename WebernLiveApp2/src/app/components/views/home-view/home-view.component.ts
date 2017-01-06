import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'awg-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.css']
})
export class HomeViewComponent implements OnInit {
    version_date_ed: string = '29. Januar 2016';
    editors: string = '<a href="http://anton-webern.ch/index.php?id=3" target="_blank">Thomas Ahrend</a>';

    constructor() { }

    ngOnInit() {
    }

}
