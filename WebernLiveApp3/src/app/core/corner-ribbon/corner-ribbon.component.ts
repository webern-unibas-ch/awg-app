import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'awg-corner-ribbon',
    templateUrl: './corner-ribbon.component.html',
    styleUrls: ['./corner-ribbon.component.css']
})
export class CornerRibbonComponent implements OnInit {
    public cornerRibbonLabel: string = 'beta';

    constructor() { }

    ngOnInit() {
    }

}
