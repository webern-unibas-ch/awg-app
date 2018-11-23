import { Component, Input, OnInit } from '@angular/core';

import { Meta } from '@awg-core/core-models';

@Component({
    selector: 'awg-footer-declaration',
    templateUrl: './footer-declaration.component.html',
    styleUrls: ['./footer-declaration.component.css']
})
export class FooterDeclarationComponent implements OnInit {
    @Input()
    metaData: Meta;

    constructor() {}

    ngOnInit() {}
}
