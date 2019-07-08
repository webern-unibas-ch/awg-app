import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { distinctUntilChanged, debounceTime, filter, tap } from 'rxjs/operators';

import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'awg-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnChanges {
    @Input()
    searchValue: string;
    @Output()
    searchRequest: EventEmitter<string> = new EventEmitter();

    faSearch = faSearch;

    errorHandler: (ex: any) => void = console.error;

    searchForm: FormGroup;
    searchFormStrings = {
        label: 'Search Input',
        placeholder: 'Volltextsuche in der Webern-Datenbank …',
        errorMessage: 'Es wird ein Suchbegriff mit mindestens 3 Zeichen benötigt!'
    };

    constructor(private fb: FormBuilder) {}

    // check for input changes
    ngOnChanges(changes: SimpleChanges) {
        this.setSearchValue();
    }

    setSearchValue() {
        try {
            if (this.searchValue === undefined || this.searchValue === null || this.searchValue.trim() === '') {
                this.buildForm('');
                return;
            }
            this.buildForm(this.searchValue);
        } catch (e) {
            if (this.errorHandler === undefined) {
                throw e;
            } else {
                this.errorHandler(e);
            }
        }
    }

    // build search form
    buildForm(searchValue: string) {
        this.searchForm = this.fb.group({
            searchValueControl: [searchValue || '', Validators.compose([Validators.required, Validators.minLength(3)])]
        });

        this.checkForUserInputChange();
    }

    // check for changing search values
    checkForUserInputChange(): void {
        this.searchForm
            .get('searchValueControl')
            .valueChanges.pipe(
                filter(x => x.length >= 3),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((query: string) => this.onSearch(query));
    }

    // emit query to search panel
    onSearch(query: string) {
        this.searchRequest.emit(query);
    }
}
