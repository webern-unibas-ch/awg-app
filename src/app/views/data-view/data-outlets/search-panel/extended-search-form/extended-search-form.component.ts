import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

import { ResourceTypesInVocabularyResponseJson, ResTypeItemJson } from '@awg-shared/api-objects';

import { SearchParams, SearchParamsViewTypes } from '@awg-views/data-view/models';
import { DataApiService } from '@awg-views/data-view/services';

@Component({
    selector: 'awg-extended-search-form',
    templateUrl: './extended-search-form.component.html',
    styleUrls: ['./extended-search-form.component.css'],
})
export class ExtendedSearchFormComponent implements OnInit {
    searchParams: SearchParams = {
        query: '',
        nRows: '25',
        startAt: '0',
        view: SearchParamsViewTypes.table,
    };

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
    get resourcetypeControl() {
        return this.extendedSearchForm.get('resourcetypeControl');
    }

    /**
     * Getter for the properties control value.
     */
    get propertiesControls(): FormArray {
        return this.extendedSearchForm.get('propertiesControls') as FormArray;
    }

    /**
     * (Functional) Getter for the searchValue control value.
     */
    getSearchValueControlAtIndex(index: number) {
        return <FormControl>this.propertiesControls.controls[index].get('searchValueControl');
    }

    ngOnInit(): void {
        this.createFormGroup();
        this.getResourcetypes();
    }

    /**
     * Public method: createFormGroup.
     *
     * It creates the search form using the reactive FormBuilder
     * with a formGroup and a resource type control and properties control.
     *
     * For the mechanism of FormArray with dynamic fields, see https://www.digitalocean.com/community/tutorials/angular-reactive-forms-formarray-dynamic-fields
     *
     * @returns {void} Creates the search form.
     */
    createFormGroup(): void {
        this.extendedSearchForm = this.formBuilder.group({
            resourcetypeControl: [this.defaultFormString, Validators.required],
            propertiesControls: this.formBuilder.array([]),
        });
        this.addPropertyControl();
    }

    getResourcetypes(): void {
        this.dataApiService.getExtendedSearchTree().subscribe(
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
        this.resourcetypeControl.valueChanges.subscribe((resourcetypeId: string) => {
            this.selectedResourcetype = this.restypesResponse.resourcetypes.find(r => r.id === resourcetypeId);

            this.clearPropertyControls(); // Remove all previous property input fields

            console.log(resourcetypeId);
            console.log(this.selectedResourcetype);
        });
    }

    /**
     * Public method: addPropertyControl.
     *
     * It creates a FormGroup for the properties controls using the reactive FormBuilder
     * with a property control, compop control, and a searchValue control, an pushes this FormGroup to the propertiesControls FormArray.
     *
     * @returns {void} Creates the form group and adds it to the FormArray.
     */
    addPropertyControl(): void {
        const group = this.formBuilder.group({
            propertyControl: ['', Validators.required],
            compopControl: ['', Validators.required],
            searchValueControl: ['', Validators.minLength(3)],
        });

        this.propertiesControls.push(group);
    }

    clearPropertyControls() {
        this.propertiesControls.clear();
        this.addPropertyControl(); // Add back first line of property inputs after clearing
    }

    removePropertyControl(index: number): void {
        if (index > -1) {
            this.propertiesControls.removeAt(index);
        }
    }

    onSearch(): void {
        console.warn('Submitted form', this.extendedSearchForm.value);

        /* TODO
        this.dataApiService.getExtendedSearchData(this.searchParams).subscribe(
            (searchResponse: SearchResponseJson) => {
                this.results = searchResponse;
                console.log(this.results);
            },
            error => {
                console.error(error as any);
            }
        );*/
    }

    isAddButtonDisabled(index: number): string | null {
        const compopValue = this._getFormArrayControlValueAtIndex('compopControl', index);

        return this._isPropertyAndCompopMissing(index) ||
            (compopValue !== 'EXISTS' && this._isSearchValueMissing(index)) ||
            this.getSearchValueControlAtIndex(index).errors?.minlength ||
            this._isNotLastProperty(index)
            ? ''
            : null;
    }

    isPropertyControlDisabled(): string | null {
        return this._isResourecetypeMissing() ? '' : null; // Mechanism needed to populate "attr.disabled", cf. https://stackoverflow.com/a/49087915
    }

    isCompopControlDisabled(): string | null {
        return this.isPropertyControlDisabled();
    }

    isSearchValueControlDisabled(index: number): string | null {
        const compopValue = this._getFormArrayControlValueAtIndex('compopControl', index);
        return this._isResourecetypeMissing() || this._isPropertyAndCompopMissing(index) || compopValue === 'EXISTS'
            ? ''
            : null;
    }

    getSearchValuePlaceholder(index: number): string {
        let placeholder = 'Suchbegriff';
        if (this.isSearchValueControlDisabled(index)) {
            placeholder = '---';
        }
        return placeholder;
    }

    private _getFormArrayControlValueAtIndex(controlName: string, index: number): unknown {
        return this.propertiesControls.controls[index].get(controlName).value;
    }

    private _isNotLastProperty(index: number): boolean {
        // Check if index is not at last position of FormArray
        const arrayLength = this.propertiesControls.controls.length;
        return arrayLength - 1 > index;
    }

    private _isResourecetypeMissing(): boolean {
        const resourceValue = this.resourcetypeControl.value;
        return !resourceValue || resourceValue === this.defaultFormString;
    }

    private _isPropertyAndCompopMissing(index: number): boolean {
        const propertyValue = this._getFormArrayControlValueAtIndex('propertyControl', index);
        const compopValue = this._getFormArrayControlValueAtIndex('compopControl', index);

        const propertyMissing = !propertyValue || propertyValue === this.defaultFormString;
        const compopMissing = !compopValue || compopValue === this.defaultFormString;

        return propertyMissing || compopMissing;
    }

    private _isSearchValueMissing(index: number): boolean {
        const searchValue = this._getFormArrayControlValueAtIndex('searchValueControl', index);
        const searchValueMissing = !searchValue || searchValue === this.defaultFormString;

        return searchValueMissing;
    }
}
