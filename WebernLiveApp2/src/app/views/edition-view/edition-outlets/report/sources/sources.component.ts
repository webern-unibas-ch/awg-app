import {Component, Input, OnInit} from '@angular/core';
import { Source } from '../../../source';

@Component({
    selector: 'awg-sources',
    templateUrl: './sources.component.html',
    styleUrls: ['./sources.component.css']
})
export class SourcesComponent implements OnInit {
    @Input() sourceList: Source[];

    constructor() { }

    ngOnInit() {
    }

}
