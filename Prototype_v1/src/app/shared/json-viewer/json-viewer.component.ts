import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'awg-json-viewer',
    templateUrl: './json-viewer.component.html',
    styleUrls: ['./json-viewer.component.css']
})
export class JsonViewerComponent implements OnInit {
    @Input()
    jsonViewerData: any;
    @Input()
    jsonViewerHeader: string;

    constructor() {}

    ngOnInit() {}
}
