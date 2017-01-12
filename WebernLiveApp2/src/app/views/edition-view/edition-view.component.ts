import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'awg-edition-view',
    templateUrl: './edition-view.component.html',
    styleUrls: ['./edition-view.component.css']
})
export class EditionViewComponent implements OnInit {

    public editionTitle: string = 'Beispieledition ausgewählter Skizzen zu <em>Vier Lieder</em> op. 12, Nr. 1';

    constructor() { }

    ngOnInit() {
    }

}
