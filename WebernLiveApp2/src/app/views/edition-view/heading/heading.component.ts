import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'awg-heading',
    templateUrl: './heading.component.html',
    styleUrls: ['./heading.component.css']
})
export class HeadingComponent implements OnInit {
    @Input() title: string;
    @Input() id: string;

    constructor() { }

    ngOnInit() {
    }

}
