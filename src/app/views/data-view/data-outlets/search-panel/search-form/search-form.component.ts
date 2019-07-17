import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { faSearch } from '@fortawesome/free-solid-svg-icons';

/**
 * The SearchForm component.
 *
 * It contains the search form section
 * of the data (search) view of the app
 * with a reactive form group.
 */
@Component({
    selector: 'awg-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormComponent implements OnChanges {
    /**
     * Input variable: searchValue.
     *
     * It keeps the search value from the search panel parent.
     */
    @Input()
    searchValue: string;

    /**
     * Output variable: searchRequest.
     *
     * It keeps an event emitter for the search string.
     */
    @Output()
    searchRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Public variable: faSearch.
     *
     * It instantiates fontawesome's faSearch icon.
     */
    faSearch = faSearch;

    /**
     * Public variable: searchForm.
     *
     * It keeps the reactive form group: searchForm.
     */
    searchForm: FormGroup;

    /**
     * Public variable: searchFormString.
     *
     * It keeps the default texts for the search form.
     */
    searchFormStrings = {
        label: 'Search Input',
        placeholder: 'Volltextsuche in der Webern-Datenbank …',
        errorMessage: 'Es wird ein Suchbegriff mit mindestens 3 Zeichen benötigt!'
    };

    /**
     * Getter for the search value control value.
     */
    get searchValueControl() {
        return this.searchForm.get('searchValueControl');
    }

    /**
     * Constructor of the SearchFormComponent.
     *
     * It declares a private FormBuilder instance
     * and initializes the form group.
     *
     * @param {FormBuilder} formBuilder Instance of the FormBuilder.
     */
    constructor(private formBuilder: FormBuilder) {
        this.createFormGroup();
        this.listenToUserInputChange();
    }

    /**
     * Angular life cycle hook: ngOnChanges.
     *
     * It checks for changes of the given input.
     */
    ngOnChanges() {
        this.setSearchValueFromInput();
    }

    /**
     * Public method: createFormGroup.
     *
     * It creates the search form using the reactive FormBuilder
     * with a formGroup and a search value control.
     *
     * @returns {void} Creates the search form.
     */
    createFormGroup(): void {
        this.searchForm = this.formBuilder.group({
            searchValueControl: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
        });
    }

    /**
     * Public method: listenToUserInputChange.
     *
     * It listens to the user's input changes
     * in the search value control and triggers
     * the onSearch method with the new search value.
     *
     * @returns {void} Listens to changing search values.
     */
    listenToUserInputChange(): void {
        this.searchValueControl.valueChanges
            .pipe(
                // at least 3 characters
                filter(x => x.length >= 3),
                // do not check changes before half a second
                debounceTime(500),
                // do not check unchanged values
                distinctUntilChanged()
            )
            .subscribe((query: string) => this.onSearch(query));
    }

    /**
     * Public method: setSearchValueFromInput.
     *
     * It sets the value of the search value control
     * from the searchValue input.
     *
     * Needed to catch search values given in the URL.
     *
     * @returns {void} Sets the search value control.
     */
    setSearchValueFromInput(): void {
        this.searchValueControl.setValue(this.searchValue);
    }

    /**
     * Public method: onSearch.
     *
     * It emits a search query to the {@link searchRequest}.
     *
     * @param {string} query The given search query.
     * @returns {void} Emits the search query.
     */
    onSearch(query: string): void {
        this.searchRequest.emit(query);
    }
}
