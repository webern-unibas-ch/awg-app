import { Component, Input, OnInit } from '@angular/core';

import { Logo } from '@awg-core/core-models';

@Component({
    selector: 'awg-footer-logo',
    templateUrl: './footer-logo.component.html',
    styleUrls: ['./footer-logo.component.css']
})
export class FooterLogoComponent implements OnInit {
    @Input()
    logo: Logo;

    constructor() {}

    ngOnInit() {}
}
