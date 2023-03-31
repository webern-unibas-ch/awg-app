import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { faPlus, faRefresh, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';

import {
    PropertyTypesInResourceClassResponseJson,
    ResourceTypesInVocabularyResponseJson,
    ResTypeItemJson,
} from '@awg-shared/api-objects';
import { PropertyDefinitionJson } from '@awg-shared/api-objects/resource-response-formats/src/property-definition-json';
import { SEARCH_COMPOP_SETS_LIST, VALUETYPE_LIST } from '@awg-views/data-view/data';
import { ExtendedSearchParams, SearchCompop } from '@awg-views/data-view/models';
import { DataApiService } from '@awg-views/data-view/services';

/**
 * The ExtendedSearchForm component.
 *
 * It contains the search form section for the extended search
 * of the data (search) view of the app with a reactive form group.
 */
@Component({
    selector: 'awg-extended-search-form',
    templateUrl: './extended-search-form.component.html',
    styleUrls: ['./extended-search-form.component.scss'],
})
export class ExtendedSearchFormComponent implements OnInit, OnDestroy {
    /**
     * Output variable: searchRequest.
     *
     * It keeps an event emitter for the extended search params.
     */
    @Output()
    searchRequest: EventEmitter<ExtendedSearchParams> = new EventEmitter();

    /**
     * Public variable: faPlus.
     *
     * It instantiates fontawesome's faPlus icon.
     */
    faPlus = faPlus;

    /**
     * Public variable: faRefresh.
     *
     * It instantiates fontawesome's faRefresh icon.
     */
    faRefresh = faRefresh;

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

    /**
     * Public variable: extendedSearchParams.
     *
     * It keeps the extended search params.
     */
    extendedSearchParams: ExtendedSearchParams = new ExtendedSearchParams();

    /**
     * Public variable: propertyListsResponse.
     *
     * It keeps the API response for the propertyLists query.
     */
    propertyListsResponse: PropertyTypesInResourceClassResponseJson;

    /**
     * Public variable: restypesResponse.
     *
     * It keeps the API response for the restypes query.
     */
    restypesResponse: ResourceTypesInVocabularyResponseJson;

    /**
     * Public variable: selectedResourcetype.
     *
     * It keeps the selected resource type of the search form.
     */
    selectedResourcetype: ResTypeItemJson;

    /**
     * Public variable: selectedProperties.
     *
     * It keeps the selected properties of the search form.
     */
    selectedProperties: string[];

    /**
     * Public variable: selectedCompopSets.
     *
     * It keeps the selected sets of comparison operators of the search form.
     */
    selectedCompopSets: SearchCompop[][] = [[]];

    /**
     * Public variable: defaultFormString.
     *
     * It keeps the default string value for the search form inputs.
     */
    defaultFormString = '---';

    /**
     * Public variable: extendedSearchFormStrings.
     *
     * It keeps the default text strings for the search form.
     */
    extendedSearchFormStrings = {
        label: 'Search Input',
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
     * Constructor of the ExtendedSearchFormComponent.
     *
     * It declares private instances of the DataApiService and the  FormBuilder.
     *
     * @param {DataApiService} dataApiService Instance of the DataApiService.
     * @param {FormBuilder} formBuilder Instance of the FormBuilder.
     */
    constructor(private dataApiService: DataApiService, private formBuilder: FormBuilder) {}

    /**
     * Getter for the resource type control value.
     */
    get restypeControl(): FormControl<string | null> {
        return this.extendedSearchForm.get('restypeControl') as FormControl<string | null>;
    }

    /**
     * Getter for the properties control value.
     */
    get propertiesControls(): FormArray {
        return this.extendedSearchForm.get('propertiesControls') as FormArray;
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
        this.createExtendedSearchForm();
        this.getResourcetypes();
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
            propertyIdControl: [{ value: '', disabled: true }, [Validators.required]],
            compopControl: [{ value: '', disabled: true }, [Validators.required]],
            searchvalControl: [{ value: '', disabled: true }, [this._validateSearchval()]],
        });

        if (!this._isResourecetypeMissing()) {
            group.controls.propertyIdControl.enable();
        }

        this.propertiesControls.push(group);
    }

    /**
     * Public method: removePropertiesControl.
     *
     * It removes a single property control at a given index from the propertiesControls FormArray.
     *
     * @param {number} index The given array index.
     *
     * @returns {void} Removes the property control from the FormArray.
     */
    removePropertiesControl(index: number): void {
        if (index > -1) {
            this.propertiesControls.removeAt(index);
        }
    }

    /**
     * Public method: getCompopControlAtIndex.
     *
     * It gets a compop control from the propertiesControls FormArray at a given index.
     *
     * @param {number} index The given array index.
     *
     * @returns {FormControl} The compopo control.
     */
    getCompopControlAtIndex(index: number): FormControl {
        this.listenToUserCompopChange(index);
        return this._getFormArrayControlAtIndex('compopControl', index);
    }

    /**
     * Public method: getCompopSetByValueType.
     *
     * It filters the list of compop sets by a given value type id and gui element id.
     *
     * @params {string} valueTypeId The given value type id.
     * @params {string} guiElementId The given gui element id.
     *
     * @returns {SearchCompop[]} The compop set.
     */
    getCompopSetByValueType(valueTypeId: string, guiElementId: string): SearchCompop[] {
        const COMPOPSET_LOOKUP = {
            /* eslint-disable @typescript-eslint/naming-convention */
            '1': 5, // TEXT
            '6-14': 5, // RESPTR with GUI element 14
            '14': 5, // RICHTEXT

            '2': 4, // INTEGER
            '3': 4, // FLOAT

            '4': 3, // DATE
            '5': 3, // PERIOD

            '13': 2, // ICONCLASS

            '6-3': 1, // RESPTR with GUI element 3
            '6-6': 1, // RESPTR with GUI element 6
            '7': 1, // SELECTION
            '11': 1, // COLOR
            '12': 1, // HLIST
            '15': 1, // GEONAMES
            /* eslint-enable @typescript-eslint/naming-convention */
        };

        const valueType = VALUETYPE_LIST.typeList.find(type => type.id === valueTypeId);
        if (!valueType) {
            return [];
        }

        const compopLookupKey = valueTypeId === '6' ? `${valueTypeId}-${guiElementId}` : valueTypeId;
        const compopIndex = COMPOPSET_LOOKUP[compopLookupKey] ?? 0;

        return SEARCH_COMPOP_SETS_LIST.compopList[compopIndex].compopSet;
    }

    /**
     * Public method: getPropertyIdControlAtIndex.
     *
     * It gets a property id control from the propertiesControls FormArray at a given index.
     *
     * @param {number} index The given array index.
     *
     * @returns {FormControl} The property id control.
     */
    getPropertyIdControlAtIndex(index: number): FormControl {
        this.listenToUserPropertyChange(index);
        return this._getFormArrayControlAtIndex('propertyIdControl', index);
    }

    /**
     * Public method: getPropertyListEntryById.
     *
     * It finds a property with the given id in the list of properties of the propertyLists response.
     *
     * @params {string} propertyId The given property id.
     *
     * @returns {PropertyDefinitionJson} The property list entry, or undefined if not found.
     */
    getPropertyListEntryById(propertyId: string): PropertyDefinitionJson {
        return this.propertyListsResponse.properties.find(property => property.id === propertyId);
    }

    /**
     * Public method: getPropertyLists.
     *
     * It gets the list of properties of a given resource type id from the data API service.
     *
     * @params {string} restypeId The given resource type id.
     *
     * @returns {void} Sets the propertyListsResponse data.
     */
    getPropertyLists(restypeId: string): void {
        this.dataApiService
            .getPropertyListsByResourceType(restypeId)
            .pipe(takeUntil(this._destroyed$))
            .subscribe({
                next: (properyListsResponse: PropertyTypesInResourceClassResponseJson) => {
                    this.propertyListsResponse = properyListsResponse;
                },
                error: err => {
                    console.error(err);
                },
            });
    }

    /**
     * Public method: getResourcetypes.
     *
     * It gets the list of resourcetypes from the data API service.
     *
     * @returns {void} Sets the restypesResponse data.
     */
    getResourcetypes(): void {
        this.dataApiService
            .getResourceTypes()
            .pipe(takeUntil(this._destroyed$))
            .subscribe({
                next: (restypesResponse: ResourceTypesInVocabularyResponseJson) => {
                    this.restypesResponse = restypesResponse;
                    this.listenToUserResourcetypeChange();
                },
                error: err => {
                    console.error(err);
                },
            });
    }

    /**
     * Public method: getSearchvalControlAtIndex.
     *
     * It gets a searchval control from the propertiesControls FormArray at a given index.
     *
     * @param {number} index The given array index.
     *
     * @returns {FormControl} The searchval control.
     */
    getSearchvalControlAtIndex(index: number): FormControl {
        return this._getFormArrayControlAtIndex('searchvalControl', index);
    }

    /**
     * Public method: isAddButtonDisabled.
     *
     * It checks if the add button at a given index is to be disabled and returns an empty string or null depending on the check (needed to populate "attr.disabled" input of the HTML element).
     *
     * @param {number} index The given array index.
     *
     * @returns {string | null} The result of the check.
     */
    isAddButtonDisabled(index: number): boolean {
        return (
            this._isPropertyIdOrCompopMissing(index) ||
            this._isNotLastProperty(index) ||
            (!this._isCompopExists(index) && this._isSearchvalMissingOrTooShort(index))
        );
    }

    /**
     * Public method: listenToUserResourcetypeChange.
     *
     * It listens to the user's changes in the restype control,
     * sets the selected resource type, and triggers the
     * getPropertyLists method with the restype id.
     *
     * @returns {void} Listens to changing restype input.
     */
    listenToUserResourcetypeChange(): void {
        this.restypeControl.valueChanges.pipe(takeUntil(this._destroyed$)).subscribe({
            next: (resourcetypeId: string) => {
                this.selectedResourcetype = this.restypesResponse.resourcetypes.find(r => r.id === resourcetypeId);

                this._clearPropertiesControls(); // Remove all previous property input fields

                if (this.selectedResourcetype) {
                    this.getPropertyLists(this.selectedResourcetype.id);
                }
            },
        });
    }

    /**
     * Public method: listenToUserPropertyChange.
     *
     * It listens to the user's changes in the property id control,
     * and sets the selected compopSet accordingly to the selected property.
     *
     * @returns {void} Listens to changing property id input.
     */
    listenToUserPropertyChange(index: number): void {
        this._getFormArrayControlAtIndex('propertyIdControl', index)
            ?.valueChanges.pipe(takeUntil(this._destroyed$))
            .subscribe({
                next: (propertyId: string) => {
                    const propertyListEntry = this.getPropertyListEntryById(propertyId);
                    if (!propertyListEntry) {
                        return;
                    }
                    const guiElementId = propertyListEntry.guielement_id;
                    const valueTypeId = propertyListEntry.valuetype_id;

                    // Enable compop control and set value to default
                    this._getFormArrayControlAtIndex('compopControl', index).enable();
                    this._getFormArrayControlAtIndex('compopControl', index).setValue('');

                    // Disable searchval control and set value to default
                    this._getFormArrayControlAtIndex('searchvalControl', index).disable();
                    this._getFormArrayControlAtIndex('searchvalControl', index).setValue('');

                    this.selectedCompopSets[index] = this.getCompopSetByValueType(valueTypeId, guiElementId);
                },
            });
    }

    /**
     * Public method: listenToUserCompopChange.
     *
     * It listens to the user's changes in the compop control,
     * and activates the searchval control accordingly to the selected compop.
     *
     * @returns {void} Listens to changing compop input.
     */
    listenToUserCompopChange(index: number): void {
        this._getFormArrayControlAtIndex('compopControl', index)
            ?.valueChanges.pipe(takeUntil(this._destroyed$))
            .subscribe({
                next: (compop: string) => {
                    if (compop && compop !== 'EXISTS') {
                        // Enable searchval control
                        this.getSearchvalControlAtIndex(index).enable();
                    } else if (compop && compop === 'EXISTS') {
                        // Disable searchval control and set value to default
                        this.getSearchvalControlAtIndex(index).disable();
                        this.getSearchvalControlAtIndex(index).setValue('');
                    }
                },
            });
    }

    /**
     * Public method: onReset.
     *
     * It triggers an alert dialog before resetting the form.
     *
     * @returns {void} Resets the form.
     */
    onReset(): void {
        alert('Gesamte Suchmaske zurücksetzen?');
        this._resetForm();
    }

    /**
     * Public method: onSearch.
     *
     * It emits a search query to the {@link searchRequest}
     * when the search form is valid.
     *
     * @returns {void} Emits the search query.
     */
    onSearch(): void {
        if (this.extendedSearchForm.valid) {
            this.extendedSearchParams = {
                filterByRestype: this.extendedSearchForm.value.restypeControl,
                propertyId: [],
                compop: [],
                searchval: [],
            };

            this.extendedSearchForm.value.propertiesControls?.forEach(property => {
                this.extendedSearchParams.propertyId.push(property.propertyIdControl);
                this.extendedSearchParams.compop.push(property.compopControl);
                this.extendedSearchParams.searchval.push(property.searchvalControl);
            });

            this.searchRequest.emit(this.extendedSearchParams);
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

    /**
     * Private method: _clearPropertiesControls.
     *
     * It clears all properties controls from the propertiesControls FormArray, and adds back an empty property input after clearing.
     *
     * @returns {void} Clears the properties controls.
     */
    private _clearPropertiesControls(): void {
        this.propertiesControls.clear();
        this.addPropertiesControl(); // Add back first line of property inputs after clearing
    }

    /**
     * Private method: _getFormArrayControlAtIndex.
     *
     * It gets a control from the propertiesControls FormArray at a given index.
     *
     * @param {string} controlName The given control name.
     * @param {number} index The given array index.
     *
     * @returns {FormControl} The properties control.
     */
    private _getFormArrayControlAtIndex(controlName: string, index: number): FormControl {
        const formArrayControl = this.propertiesControls.controls.at(index);
        if (!formArrayControl) {
            return null;
        }
        return formArrayControl.get(controlName) as FormControl;
    }

    /**
     * Private method: _isCompopExists.
     *
     * It checks if the compop control at a given index has the value 'EXISTS'.
     *
     * @param {number} index The given array index.
     *
     * @returns {boolean} The result of the check.
     */
    private _isCompopExists(index: number): boolean {
        return this._getFormArrayControlAtIndex('compopControl', index).value === 'EXISTS';
    }

    /**
     * Private method: _isCompopMissing.
     *
     * It checks if the compop control at a given index does not have a value yet.
     *
     * @param {number} index The given array index.
     *
     * @returns {boolean} The result of the check.
     */
    private _isCompopMissing(index: number): boolean {
        return this._isFormControlValueMissing('compopControl', index);
    }

    /**
     * Private method: _isFormControlValueMissing.
     *
     * It checks if a given control of the form array at a given index does not have a value yet.
     *
     * @param {string} controlName The given array index.
     * @param {number} index The given array index.
     *
     * @returns {boolean} The result of the check.
     */
    private _isFormControlValueMissing(controlName: string, index: number): boolean {
        const formControlValue = this._getFormArrayControlAtIndex(controlName, index)?.value;
        return !formControlValue || formControlValue === this.defaultFormString;
    }

    /**
     * Private method: _isNotLastProperty.
     *
     * It checks if an index is not at the last position of the properties FormArray.
     *
     * @param {number} index The given array index.
     *
     * @returns {boolean} The result of the check.
     */
    private _isNotLastProperty(index: number): boolean {
        const arrayLength = this.propertiesControls.controls.length;
        return arrayLength - 1 > index;
    }

    /**
     * Private method: _isPropertyIdMissing.
     *
     * It checks if the property id control at a given index does not have a value yet.
     *
     * @param {number} index The given array index.
     *
     * @returns {boolean} The result of the check.
     */
    private _isPropertyIdMissing(index: number): boolean {
        return this._isFormControlValueMissing('propertyIdControl', index);
    }

    /**
     * Private method: _isPropertyIdOrCompopMissing.
     *
     * It checks if the propoerty id or compop control at a given index do not have a value yet.
     *
     * @param {number} index The given array index.
     *
     * @returns {boolean} The result of the check.
     */
    private _isPropertyIdOrCompopMissing(index: number): boolean {
        return this._isPropertyIdMissing(index) || this._isCompopMissing(index);
    }

    /**
     * Private method: _isResourecetypeMissing.
     *
     * It checks if the resourcetype control does not have a value yet.
     *
     * @returns {boolean} The result of the check.
     */
    private _isResourecetypeMissing(): boolean {
        const resourceValue = this.restypeControl.value;
        return !resourceValue || resourceValue === this.defaultFormString;
    }

    /**
     * Private method: _isSearchvalMissing.
     *
     * It checks if the searchval control at a given index does not have a value yet.
     *
     * @param {number} index The given array index.
     *
     * @returns {boolean} The result of the check.
     */
    private _isSearchvalMissing(index: number): boolean {
        return this._isFormControlValueMissing('searchvalControl', index);
    }

    /**
     * Private method: _isSearchvalMissingOrTooShort.
     *
     * It checks if the searchval control at a given index does not have a value yet
     * or if the value is shorter than 3 characters.
     *
     * @param {number} index The given array index.
     *
     * @returns {boolean} The result of the check.
     */
    private _isSearchvalMissingOrTooShort(index: number): boolean {
        return this._isSearchvalMissing(index) || this._isSearchvalTooShort(index);
    }

    /**
     * Private method: _isSearchvalTooShort.
     *
     * It checks if the searchval control at a given index has a value that is shorter than 3 characters.
     *
     * @param {number} index The given array index.
     *
     * @returns {boolean} The result of the check.
     */
    private _isSearchvalTooShort(index: number): boolean {
        return this.getSearchvalControlAtIndex(index).value.length < 3;
    }

    /**
     * Private method: _resetForm.
     *
     * It resets the complete extended search from.
     *
     * @returns {void} Resets the form.
     */
    private _resetForm(): void {
        return this.extendedSearchForm.reset();
    }

    /**
     * Private method: _validateSearchval.
     *
     * It creates a custom Validator for the searchval control.
     *
     * @returns {ValidatorFn} The custom validator function, or null.
     */
    private _validateSearchval(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            const compopValue = control.parent.get('compopControl').value;

            if (compopValue === 'EXISTS') {
                // If compopControl value is EXISTS, return null so searchvalControl is not required
                return null;
            }

            if (!value || value.length < 3) {
                return { minlength: true };
            }
            return null;
        };
    }
}
