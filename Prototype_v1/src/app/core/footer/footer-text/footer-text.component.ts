import { Component, Input, OnInit } from '@angular/core';

import { Meta } from '@awg-core/core-models';

@Component({
    selector: 'awg-footer-text',
    templateUrl: './footer-text.component.html',
    styleUrls: ['./footer-text.component.css']
})
export class FooterTextComponent implements OnInit {
    @Input()
    metaData: Meta;

    constructor() {}

    ngOnInit() {}
}
