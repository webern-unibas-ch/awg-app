import { Component, Input, OnInit } from '@angular/core';

import { Meta } from '@awg-core/core-models';

@Component({
    selector: 'awg-footer-copyright',
    templateUrl: './footer-copyright.component.html',
    styleUrls: ['./footer-copyright.component.css']
})
export class FooterCopyrightComponent implements OnInit {
    @Input()
    metaData: Meta;

    constructor() {}

    ngOnInit() {}
}
