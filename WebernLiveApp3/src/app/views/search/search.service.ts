import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { ApiService } from '../../core/services/api-service/api.service';
import { SearchResponseJson } from '../../shared/api-objects';

import { Card } from './cards.model';
import { SEARCHCARDDATA } from './search-card.data';

@Injectable()
export class SearchService extends ApiService {

    private projectId: string = '6';

    /********************************
     *
     * get SearchCardData
     *
     ********************************/

    public getSearchCards(): Promise<Card[]> {
        return Promise.resolve(SEARCHCARDDATA);
    }

    public getSearchCard(label: string): Promise<Card> {
        return this.getSearchCards()
            .then(cards => cards.find(card => card.label === label));
    }

    /********************************
     *
     * fulltext search via SALSAH api
     *
     ********************************/
    getFulltextSearchData(searchString: string): Observable<SearchResponseJson> {
        let queryString: string = '/search/' + searchString;
        let params = new URLSearchParams();
            params.set('searchtype', 'fulltext');
            params.set('filter_by_project', this.projectId);
        return this.httpGet(queryString, { search: params });
    }

}
