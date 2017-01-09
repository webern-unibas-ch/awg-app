import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'awg-edition-heading',
    templateUrl: './edition-heading.component.html',
    styleUrls: ['./edition-heading.component.css']
})
export class EditionHeadingComponent implements OnInit {
    @Input() editionTitle: string;

    constructor() { }

    ngOnInit() {
    }

}
