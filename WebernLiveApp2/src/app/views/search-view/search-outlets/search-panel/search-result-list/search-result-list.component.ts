import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SearchResponseJson } from '../../../../../shared/api-objects';


@Component({
    selector: 'awg-search-result-list',
    templateUrl: './search-result-list.component.html',
    styleUrls: ['./search-result-list.component.css']
})
export class SearchResultListComponent implements OnChanges {
    @Input() searchData: SearchResponseJson;
    @Input() searchUrl: string;
    @Input() filteredOut: number;

    public currentId: string;
    public resText: string;

    constructor(
        private router: Router
    ) { }

    ngOnChanges() {
        this.prepareResultText();
    }

    prepareResultText() {
        if (this.searchData['subjects']) {
            const length = this.searchData.subjects.length;
            this.resText = length + ` `;
            this.resText += (length === 1) ? `zugängliches Resultat` : `zugängliche Resultate`;
            this.resText += ` von ${this.searchData.nhits}`;
            if (this.filteredOut > 0) {
                const duplString: string = (this.filteredOut === 1) ? `Duplikat` : `Duplikate`;
                this.resText += ` (${this.filteredOut} ${duplString} entfernt)`;
            }
            this.resText += `:`;
        } else {
            this.resText = `Die Abfrage ${this.searchUrl} ist leider fehlgeschlagen. Wiederholen Sie die Abfrage zu einem späteren Zeitpunkt oder überprüfen sie die Suchbegriffe.`;
        }
    }

    activeDetail(id: string) {
        return this.currentId === id;
    }

    showDetail(id: string) {
        this.currentId = id;
        this.router.navigate(['/resource', this.currentId]);
    }

}
