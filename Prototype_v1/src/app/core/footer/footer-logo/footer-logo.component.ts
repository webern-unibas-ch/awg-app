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

    pullSm8Class = '';

    constructor() {}

    ngOnInit() {
        if (this.logo.id === 'unibaslogo') {
            this.pullSm8Class = ' col-sm-pull-8';
        }
    }
}
