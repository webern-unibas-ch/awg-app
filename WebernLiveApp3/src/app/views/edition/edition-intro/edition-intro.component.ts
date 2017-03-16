import { Component, OnInit } from '@angular/core';

import { EditionService } from '../edition.service';

@Component({
    selector: 'awg-edition-intro',
    templateUrl: './edition-intro.component.html',
    styleUrls: ['./edition-intro.component.css']
})
export class EditionIntroComponent implements OnInit {

    constructor(
        private editionService: EditionService
    ) { }

    ngOnInit() {
    }

    public openEditionDialog(identifier: string) {
        this.editionService.openEditionDialog(identifier);
    }

}
