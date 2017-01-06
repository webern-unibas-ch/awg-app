import { Component, Input, OnInit } from '@angular/core';
import { MetaData } from '../../../shared/metadata';

@Component({
    selector: 'awg-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    @Input() meta: MetaData;

    constructor() { }

    ngOnInit() {
    }

}
