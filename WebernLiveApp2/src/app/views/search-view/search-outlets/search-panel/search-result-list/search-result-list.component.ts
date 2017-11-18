import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SearchResponseJson } from '../../../../../shared/api-objects';


@Component({
    selector: 'awg-search-result-list',
    templateUrl: './search-result-list.component.html',
    styleUrls: ['./search-result-list.component.css']
})
export class SearchResultListComponent implements OnInit {
    @Input() searchData: SearchResponseJson;
    @Input() searchUrl: string;

    public currentId: string;
    public resText: string;

    constructor(
        private router: Router
    ) { }

    ngOnInit() {
        this.prepareResultText();
    }

    activeDetail(id: string) {
        return this.currentId === id;
    }

    prepareResultText() {
        if (this.searchData['subjects']) {
            const length = this.searchData.subjects.length;
            this.resText = length + ` `;
            this.resText += (length === 1) ? `zugängliches Resultat` : `zugängliche Resultate`;
            this.resText += ` von ${this.searchData.nhits}:`;
        } else {
            this.resText = `Die Abfrage ${this.searchUrl} ist leider fehlgeschlagen. Wiederholen Sie die Abfrage zu einem späteren Zeitpunkt oder überprüfen sie die Suchbegriffe.`;
        }
    }

    showDetail(id: string) {
        this.currentId = id;
        this.router.navigate(['/search/detail', this.currentId]);
    }

}
