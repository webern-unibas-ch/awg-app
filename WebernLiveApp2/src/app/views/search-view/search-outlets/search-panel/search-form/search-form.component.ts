import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

import { AppConfig } from '../../../../../app.config';
import { SearchResponseJson } from '../../../../../shared/api-objects';
import { SearchResultStreamerService, SearchService } from '../../../services';


@Component({
    selector: 'awg-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
    @Input() searchval: string;
    @Output() submitRequest: EventEmitter<any> = new EventEmitter();

    url: string = AppConfig.API_ENDPOINT;
    loading: boolean = false;

    searchForm: FormGroup;
    searchValueControl: AbstractControl;
    errorMessage: string = undefined;

    constructor(
        private fb: FormBuilder,
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
            .do( () => {
                console.info('-----> SearchForm# valueChanged <-----');
                this.loading = true;
            })
            .switchMap(value => {
                this.streamerService.updateQuery(value);
                return this.getFulltextSearchData(value);
            })
            .subscribe( data => {
                    this.streamerService.updateSearchResultStream(data);
                    this.loading = false;
                    console.info('-----> SearchForm# updated StreamerService <-----');
                },
                error => {
                    this.errorMessage = <any>error;
                });
    }


    private getFulltextSearchData(value: string): Observable<SearchResponseJson> {
        return this.searchService.getFulltextSearchData(value);
    }

    onSubmit(value: string) {
        console.log(' -----> searchform: clicked SUBMIT: ', value);
        this.submitRequest.emit(value);
    }

}
