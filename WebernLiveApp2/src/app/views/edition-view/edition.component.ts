import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'awg-edition-view',
    templateUrl: './edition.component.html',
    styleUrls: ['./edition.component.css']
})
export class EditionViewComponent implements OnInit {

    public editionTitle = 'Beispieledition ausgewählter Skizzen zu <em>Vier Lieder</em> op. 12, Nr. 1';
    public editionId = 'edition';

    constructor() { }

    ngOnInit() {
    }

}
