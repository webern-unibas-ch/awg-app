import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

import { AppConfig } from '../../../../../app.config';
import { ConversionService } from '../../../../../core/services';
import { SearchResponseJson } from '../../../../../shared/api-objects/index';
import { SearchResultStreamerService, SearchService } from '../../../services';
import { SearchResponseWithQuery } from '../../../models';


@Component({
    selector: 'awg-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
    @Input() searchval: string;
    @Output() submitRequest: EventEmitter<any> = new EventEmitter();
    @Output() submitLoadStatus: EventEmitter<boolean> = new EventEmitter();

    url: string = AppConfig.API_ENDPOINT;
    searchResponseWithQuery: SearchResponseWithQuery = new SearchResponseWithQuery();

    searchForm: FormGroup;
    searchValueControl: AbstractControl;
    errorMessage: string = undefined;
    loading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private conversionService: ConversionService,
        private searchService: SearchService,
        private streamerService: SearchResultStreamerService
    ) { }

    ngOnInit() {
        this.buildForm(this.searchval);
    }

    buildForm(searchval: string) {
        this.searchForm = this.fb.group({
            'searchValue': [searchval, Validators.compose([
                Validators.required,
                Validators.minLength(3)
            ])]
        });
        this.searchValueControl = this.searchForm.controls['searchValue'];

        this.searchValueControl.valueChanges
            .filter(x => x.length >= 3)
            .debounceTime(500)
            .distinctUntilChanged()
            .do(() => {
                this.changeLoadStatus(true);
            })
            .switchMap(value => {
                this.searchResponseWithQuery['query'] = value;
                return this.searchService.getFulltextSearchData(value);
            })
            .subscribe((data: SearchResponseJson) => {
                    // snapshot of data
                    let searchResultsData = {...data};

                    // conversion of search results for HTML display
                    searchResultsData = this.conversionService.convertFullTextSearchResults(searchResultsData);

                    this.searchResponseWithQuery['data'] = searchResultsData;

                    // update search data via streamer service
                    this.streamerService.updateSearchResponseStream(this.searchResponseWithQuery);

                    this.changeLoadStatus(false);
                },
                error => {
                    this.errorMessage = <any>error;
                });
    }

    changeLoadStatus(status: boolean) {
        this.loading = status;
        this.onLoadChange(this.loading);
    }

    onLoadChange(status: boolean) {
        this.submitLoadStatus.emit(status);
    }

    // TODO: refactor
    onSubmit(query: string) {
        console.log(' -----> searchform: clicked SUBMIT: ', query);
        this.submitRequest.emit(query);
    }


}
