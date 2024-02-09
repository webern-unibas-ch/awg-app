import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { faSearch } from '@fortawesome/free-solid-svg-icons';

/**
 * The FulltextSearchForm component.
 *
 * It contains the search form section for the fulltext search
 * of the data (search) view of the app with a reactive form group.
 */
@Component({
    selector: 'awg-fulltext-search-form',
    templateUrl: './fulltext-search-form.component.html',
    styleUrls: ['./fulltext-search-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FulltextSearchFormComponent implements OnInit, OnChanges, OnDestroy {
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
     * Public variable: fulltextSearchForm.
     *
     * It keeps the reactive form group: fulltextSearchForm.
     */
    fulltextSearchForm: FormGroup;

    /**
     * Public variable: fulltextSearchFormStrings.
     *
     * It keeps the default texts for the search form.
     */
    fulltextSearchFormStrings = {
        label: 'Input für Volltextsuche',
        placeholder: 'Volltextsuche in der Webern-Datenbank …',
        errorMessage: 'Es wird ein Suchbegriff mit mindestens 3 Zeichen benötigt!',
    };

    /**
     * Private variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * Constructor of the FulltextSearchFormComponent.
     *
     * It declares a private FormBuilder instance.
     *
     * @param {FormBuilder} formBuilder Instance of the FormBuilder.
     */
    constructor(private formBuilder: FormBuilder) {}

    /**
     * Getter for the search value control value.
     */
    get searchvalControl() {
        return this.fulltextSearchForm.get('searchvalControl');
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.createFulltextSearchForm();
        this.listenToUserInputChange();
    }

    /**
     * Angular life cycle hook: ngOnChanges.
     *
     * It checks for changes of the given input.
     */
    ngOnChanges(changes: SimpleChanges) {
        if (
            changes['searchValue'] &&
            typeof changes['searchValue'].currentValue === 'string' &&
            !changes['searchValue'].isFirstChange()
        ) {
            this.setSearchvalFromInput();
        }
    }

    /**
     * Public method: createFulltextSearchForm.
     *
     * It creates the search form using the reactive FormBuilder
     * with a formGroup and a search value control.
     *
     * @returns {void} Creates the search form.
     */
    createFulltextSearchForm(): void {
        this.fulltextSearchForm = this.formBuilder.group({
            searchvalControl: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        });
    }

    /**
     * Public method: isFulltextSearchInputInvalid.
     *
     * It checks if the searchval control has a missing input, any errors, or is too short,
     * and returns a boolean flag.
     *
     * @returns {boolean} The result of the check.
     */
    isFulltextSearchInputInvalid(): boolean {
        return !!(this.searchvalControl.hasError('required') || this.searchvalControl.hasError('minlength'));
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
        this.searchvalControl.valueChanges
            .pipe(
                // At least 3 characters
                filter(x => x.length >= 3),
                // Do not check changes before half a second
                debounceTime(500),
                // Do not check unchanged values
                distinctUntilChanged(),
                takeUntil(this._destroyed$)
            )
            .subscribe({
                next: (query: string) => this.onSearch(query),
            });
    }

    /**
     * Public method: setSearchvalFromInput.
     *
     * It sets the value of the search value control
     * from the searchValue input.
     *
     * Needed to catch search values given in the URL.
     *
     * @returns {void} Sets the search value control.
     */
    setSearchvalFromInput(): void {
        this.searchvalControl.setValue(this.searchValue);
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
        if (!query) {
            return;
        }
        if (this.fulltextSearchForm.valid) {
            this.searchRequest.emit(query);
        }
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     */
    ngOnDestroy() {
        // Emit truthy value to end all subscriptions
        this._destroyed$.next(true);

        // Now let's complete the subject itself
        this._destroyed$.complete();
    }
}
