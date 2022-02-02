import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';

import { ResourceTypesInVocabularyResponseJson, ResTypeItemJson, SearchResponseJson } from '@awg-shared/api-objects';

import {
    ExtendedSearchParams,
    ExtendedSearchParamsProperties,
    SearchResultsViewTypes,
} from '@awg-views/data-view/models';
import { DataApiService } from '@awg-views/data-view/services';

@Component({
    selector: 'awg-extended-search-form',
    templateUrl: './extended-search-form.component.html',
    styleUrls: ['./extended-search-form.component.css'],
})
export class ExtendedSearchFormComponent implements OnInit {
    /**
     * Output variable: searchRequest.
     *
     * It keeps an event emitter for the extended search params.
     */
    @Output()
    searchRequest: EventEmitter<ExtendedSearchParams> = new EventEmitter();

    extendedSearchParams: ExtendedSearchParams = new ExtendedSearchParams();

    compops = [
        { id: 'EXISTS', label: 'EXISTS' },
        { id: 'EQ', label: '=' },
        { id: '!EQ', label: '!=' },
        { id: 'GT', label: '>' },
        { id: 'GT_EQ', label: '>=' },
        { id: 'LT', label: '>' },
        { id: 'LT_EQ', label: '>=' },
    ];

    defaultFormString = '---';

    displaySearchValue = false;

    /**
     * Public variable: faPlus.
     *
     * It instantiates fontawesome's faPlus icon.
     */
    faPlus = faPlus;

    /**
     * Public variable: faSearch.
     *
     * It instantiates fontawesome's faSearch icon.
     */
    faSearch = faSearch;

    /**
     * Public variable: faTrash.
     *
     * It instantiates fontawesome's faTrash icon.
     */
    faTrash = faTrash;

    /**
     * Public variable: extendedSearchForm.
     *
     * It keeps the reactive form group: extendedSearchForm.
     */
    extendedSearchForm: FormGroup;

    restypesResponse: ResourceTypesInVocabularyResponseJson;
    selectedResourcetype: ResTypeItemJson;
    selectedProperties: string[];

    // TODO: move to separate class / service?
    /**
     * Public variable: searchFormString.
     *
     * It keeps the default texts for the search form.
     */
    searchFormStrings = {
        label: 'Search Input',
        placeholder: 'Volltextsuche in der Webern-Datenbank …',
        errorMessage: 'Es wird ein Suchbegriff mit mindestens 3 Zeichen benötigt!',
    };

    constructor(private dataApiService: DataApiService, private formBuilder: FormBuilder) {}

    /**
     * Getter for the resource type control value.
     */
    get restypeControl() {
        return this.extendedSearchForm.get('restypeControl');
    }

    /**
     * Getter for the properties control value.
     */
    get propertiesControls(): FormArray {
        return this.extendedSearchForm.get('propertiesControls') as FormArray;
    }

    ngOnInit(): void {
        this.createExtendedSearchForm();
        this.getResourcetypes();
    }

    /**
     * Makes the field required if the predicate function returns true
     */
    _requiredIfValidator(predicate) {
        return formControl => {
            if (!formControl.parent) {
                return null;
            }
            if (predicate()) {
                return Validators.required(formControl);
            }
            return null;
        };
    }

    /**
     * Public method: createExtendedSearchForm.
     *
     * It creates the search form using the reactive FormBuilder
     * with a formGroup and a resource type control and properties control.
     *
     * For the mechanism of FormArray with dynamic fields, see https://www.digitalocean.com/community/tutorials/angular-reactive-forms-formarray-dynamic-fields
     *
     * @returns {void} Creates the search form.
     */
    createExtendedSearchForm(): void {
        this.extendedSearchForm = this.formBuilder.group({
            restypeControl: ['', Validators.required],
            propertiesControls: this.formBuilder.array([]),
        });
        this.addPropertiesControl();
    }

    /**
     * Public method: addPropertiesControl.
     *
     * It creates a single property control using a reactive FormGroup
     * with a property control, compop control, and a searchValue control, and pushes this FormGroup to the propertiesControls FormArray.
     *
     * @returns {void} Creates the form group and adds it to the FormArray.
     */
    addPropertiesControl(): void {
        const group = this.formBuilder.group({
            propertyIdControl: ['', [Validators.required]],
            compopControl: ['', [Validators.required]],
            searchvalControl: [''],
        });

        this.propertiesControls.push(group);
    }

    removePropertiesControl(index: number): void {
        if (index > -1) {
            this.propertiesControls.removeAt(index);
        }
    }

    clearPropertiesControls() {
        this.propertiesControls.clear();
        this.addPropertiesControl(); // Add back first line of property inputs after clearing
    }

    getResourcetypes(): void {
        this.dataApiService.getExtendedSearchResourcetypes().subscribe(
            (restypesResponse: ResourceTypesInVocabularyResponseJson) => {
                this.restypesResponse = restypesResponse;
                console.log(this.restypesResponse);

                this.listenToUserResourcetypeChange();
            },
            error => {
                console.error(error as any);
            }
        );
    }

    listenToUserResourcetypeChange(): void {
        this.restypeControl.valueChanges.subscribe((resourcetypeId: string) => {
            this.selectedResourcetype = this.restypesResponse.resourcetypes.find(r => r.id === resourcetypeId);

            this.clearPropertiesControls(); // Remove all previous property input fields

            console.log(resourcetypeId);
            console.log(this.selectedResourcetype);
        });
    }

    onReset(): void {
        alert('Gesamte Suchmaske zurücksetzen?');
        this._resetForm();
    }

    onSearch(): void {
        if (this.extendedSearchForm.valid) {
            this.extendedSearchParams = {
                filterByRestype: this.extendedSearchForm.value.restypeControl,
                propertyId: [],
                compop: [],
                searchval: [],
            };

            this.extendedSearchForm.value.propertiesControls.forEach((property, index) => {
                this.extendedSearchParams.propertyId.push(property.propertyIdControl);
                this.extendedSearchParams.compop.push(property.compopControl);
                this.extendedSearchParams.searchval.push(property.searchvalControl);
            });

            this.searchRequest.emit(this.extendedSearchParams);

            this._resetForm();
        }
    }

    isAddButtonDisabled(index: number): string | null {
        const compopValue = this._getFormArrayControlAtIndex('compopControl', index).value;

        return this._isPropertyIdAndCompopMissing(index) ||
            (compopValue !== 'EXISTS' && this._isSearchvalMissing(index)) ||
            this.getSearchvalControlAtIndex(index).errors?.minlength ||
            this._isNotLastProperty(index)
            ? ''
            : null;
    }

    isPropertyIdControlDisabled(): string | null {
        return this._isResourecetypeMissing() ? '' : null; // Mechanism needed to populate "attr.disabled", cf. https://stackoverflow.com/a/49087915
    }

    isCompopControlDisabled(): string | null {
        return this.isPropertyIdControlDisabled();
    }

    isSearchvalControlDisabled(index: number): string | null {
        const compopValue = this._getFormArrayControlAtIndex('compopControl', index).value;
        return this._isResourecetypeMissing() || this._isPropertyIdAndCompopMissing(index) || compopValue === 'EXISTS'
            ? ''
            : null;
    }

    getSearchvalControlAtIndex(index: number) {
        return this._getFormArrayControlAtIndex('searchvalControl', index);
    }

    getSearchvalPlaceholder(index: number): string {
        let placeholder = 'Suchbegriff';
        if (this.isSearchvalControlDisabled(index)) {
            placeholder = '---';
        }
        return placeholder;
    }

    private _getFormArrayControlAtIndex(controlName: string, index: number): any {
        return this.propertiesControls.controls[index].get(controlName);
    }

    private _isNotLastProperty(index: number): boolean {
        // Check if index is not at last position of FormArray
        const arrayLength = this.propertiesControls.controls.length;
        return arrayLength - 1 > index;
    }

    private _isResourecetypeMissing(): boolean {
        const resourceValue = this.restypeControl.value;
        return !resourceValue || resourceValue === this.defaultFormString;
    }

    private _isPropertyIdAndCompopMissing(index: number): boolean {
        const propertyValue = this._getFormArrayControlAtIndex('propertyIdControl', index).value;
        const compopValue = this._getFormArrayControlAtIndex('compopControl', index).value;

        const propertyMissing = !propertyValue || propertyValue === this.defaultFormString;
        const compopMissing = !compopValue || compopValue === this.defaultFormString;

        return propertyMissing || compopMissing;
    }

    private _isSearchvalMissing(index: number): boolean {
        const searchval = this._getFormArrayControlAtIndex('searchvalControl', index);
        return !searchval || searchval === this.defaultFormString;
    }

    private _resetForm() {
        return this.extendedSearchForm.reset();
    }
}
