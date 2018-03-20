import { Component, Input, OnInit } from '@angular/core';

import { Card } from '../cards.model';
import { SearchService } from '../search.service';

@Component({
    selector: 'awg-search-overview',
    templateUrl: './search-overview.component.html',
    styleUrls: ['./search-overview.component.css']
})
export class SearchOverviewComponent implements OnInit {

    searchOverviewCards: Card[];
    resolution: string = '180x135';

    constructor(
        private searchService: SearchService
    ) { }

    ngOnInit() {
        this.getSearchCards();
    }

    private getSearchCards() {
        this.searchService.getSearchCards()
            .then(cards => {
                this.searchOverviewCards = cards;
                this.searchOverviewCards.forEach(card => {
                    card.image += this.resolution;
                });
            });
    };

}
