import { Component, Input, OnInit } from '@angular/core';
import { Source } from '../../../../source';

@Component({
    selector: 'awg-source-list',
    templateUrl: './source-list.component.html',
    styleUrls: ['./source-list.component.css']
})
export class SourceListComponent implements OnInit {
    @Input() sourceList: Source[];

    constructor() { }

    ngOnInit() {
    }

}
