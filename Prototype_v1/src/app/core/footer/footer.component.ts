import { Component, Input, OnInit } from '@angular/core';

import { Meta } from '@awg-core/core-models';

@Component({
    selector: 'awg-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    @Input() meta: Meta;

    constructor() { }

    ngOnInit() { }

}
