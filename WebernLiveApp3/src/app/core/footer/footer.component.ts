import { Component, Input, OnInit } from '@angular/core';

import { MetaModel } from '../meta.model';

@Component({
    selector: 'awg-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    @Input() meta: MetaModel;

    constructor() { }

    ngOnInit() {
    }

}
