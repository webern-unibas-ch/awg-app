import { Component, Input, OnInit } from '@angular/core';

import { Logos, Meta } from '@awg-core/core-models';



@Component({
    selector: 'awg-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    @Input() meta: Meta;

    constructor() { }

    ngOnInit() { }

    logos: Logos = {
        unibas: {id: 'unibaslogo', src: 'assets/img/uni.svg', alt: 'Logo Uni Basel', href: 'http://www.unibas.ch'},
        snf: {id: 'snflogo', src: 'assets/img/snf.jpg', alt: 'Logo SNF', href: 'http://www.snf.ch'}
    }

}
