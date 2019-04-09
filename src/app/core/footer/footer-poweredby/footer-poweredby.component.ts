import { Component, Input, OnInit } from '@angular/core';

import { Logos } from '@awg-core/core-models';

@Component({
    selector: 'awg-footer-poweredby',
    templateUrl: './footer-poweredby.component.html',
    styleUrls: ['./footer-poweredby.component.css']
})
export class FooterPoweredbyComponent implements OnInit {
    @Input()
    logos: Logos;

    constructor() {}

    ngOnInit() {}
}
