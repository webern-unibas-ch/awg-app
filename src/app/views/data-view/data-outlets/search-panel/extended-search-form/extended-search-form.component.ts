import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';

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
    extendedSearchForm: UntypedFormGroup;

    /**
     * Public variable: extendedSearchParams.
     *
     * It keeps the extended search params.
     */
    extendedSearchParams: ExtendedSearchParams = new ExtendedSearchParams();

    /**
     * Public variable: restypesResponse.
     *
     * It keeps the API response for the restypes query.
     */
    restypesResponse: ResourceTypesInVocabularyResponseJson;

    /**
     * Public variable: propertyListsResponse.
     *
     * It keeps the API response for the propertyLists query.
     */
    propertyListsResponse: PropertyTypesInResourceClassResponseJson;

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
     * Public variable: searchFormString.
     *
     * It keeps the default text strings for the search form.
     */
    searchFormStrings = {
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
    constructor(private dataApiService: DataApiService, private formBuilder: UntypedFormBuilder) {}

    /**
     * Getter for the resource type control value.
     */
    get restypeControl(): UntypedFormControl {
        return this.extendedSearchForm.get('restypeControl') as UntypedFormControl;
    }

    /**
     * Getter for the properties control value.
     */
    get propertiesControls(): UntypedFormArray {
        return this.extendedSearchForm.get('propertiesControls') as UntypedFormArray;
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
            propertyIdControl: ['', [Validators.required]],
            compopControl: ['', [Validators.required]],
            searchvalControl: [''],
        });

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
     * Public method: getCompopoControlAtIndex.
     *
     * It gets a compop control from the propertiesControls FormArray at a given index.
     *
     * @param {number} index The given array index.
     *
     * @returns {FormControl} The compopo control.
     */
    getCompopoControlAtIndex(index: number): UntypedFormControl {
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
        let compopSet: SearchCompop[] = [];
        const valueType = VALUETYPE_LIST.typeList.filter(vt => vt.id === valueTypeId);

        if (!valueType || valueType.length !== 1 || !valueType[0].id) {
            return [];
        } else {
            const id = valueType[0].id;

            if (id === '1' || (id === '6' && guiElementId === '14') || id === '14') {
                // 1 TEXT, 6 RESPTR if gui 14, 14 RICHTEXT
                compopSet = SEARCH_COMPOP_SETS_LIST.compopList[5].compopSet;
            } else if (id === '2' || id === '3') {
                // 2 INTEGER, 3 FLOAT
                compopSet = SEARCH_COMPOP_SETS_LIST.compopList[4].compopSet;
            } else if (id === '4' || id === '5') {
                // 4 DATE, 5 PERIOD
                compopSet = SEARCH_COMPOP_SETS_LIST.compopList[3].compopSet;
            } else if (id === '13') {
                // 13 ICONCLASS
                compopSet = SEARCH_COMPOP_SETS_LIST.compopList[2].compopSet;
            } else if (
                (id === '6' && (guiElementId === '3' || guiElementId === '6')) ||
                id === '7' ||
                id === '11' ||
                id === '12' ||
                id === '15'
            ) {
                // 6 RESPTR if gui 3 or 6 (not 14), 7 SELECTION, 11 COLOR, 12 HLIST, 15 GEONAMES
                compopSet = SEARCH_COMPOP_SETS_LIST.compopList[1].compopSet;
            } else {
                // Minimal set for all other cases
                compopSet = SEARCH_COMPOP_SETS_LIST.compopList[0].compopSet;
            }
        }
        return compopSet;
    }

    /**
     * Public method: getPopertyListEntryById.
     *
     * It filters the list of properties in the propertyLists response by a given id.
     *
     * @params {string} propertyId The given property id.
     *
     * @returns {PropertyDefinitionJson} The property list entry.
     */
    getPopertyListEntryById(propertyId: string): PropertyDefinitionJson[] {
        return this.propertyListsResponse.properties.filter(property => property.id === propertyId);
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
    getPropertyIdControlAtIndex(index: number): UntypedFormControl {
        this.listenToUserPropertyChange(index);
        return this._getFormArrayControlAtIndex('propertyIdControl', index);
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
    getSearchvalControlAtIndex(index: number): UntypedFormControl {
        if (this.isSearchvalControlDisabled(index) === '') {
            this._getFormArrayControlAtIndex('searchvalControl', index).setValue('');
        }
        return this._getFormArrayControlAtIndex('searchvalControl', index);
    }

    /**
     * Public method: getSearchvalPlaceholder.
     *
     * It gets a placeholder for the searchval control from the propertiesControls FormArray at a given index.
     *
     * @param {number} index The given array index.
     *
     * @returns {string} The searchval control placeholder.
     */
    getSearchvalPlaceholder(index: number): string {
        let placeholder = 'Suchbegriff';
        if (this.isSearchvalControlDisabled(index)) {
            placeholder = this.defaultFormString;
        }
        return placeholder;
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
    isAddButtonDisabled(index: number): string | null {
        const compopValue = this.getCompopoControlAtIndex(index).value;

        return this._isPropertyIdOrCompopMissing(index) ||
            (compopValue !== 'EXISTS' && this._isSearchvalMissing(index)) ||
            this.getSearchvalControlAtIndex(index).errors?.['minlength'] ||
            this._isNotLastProperty(index)
            ? ''
            : null;
    }

    /**
     * Public method: isCompopControlDisabled.
     *
     * It checks if the compop control at a given index is to be  disabled and returns an empty string or null depending on the check (needed to populate "attr.disabled" input of the HTML element).
     *
     * @param {number} index The given array index.
     *
     * @returns {string | null} The result of the check.
     */
    isCompopControlDisabled(index: number): string | null {
        return this.isPropertyIdControlDisabled() || this._isPropertyIdMissing(index) ? '' : null;
    }

    /**
     * Public method: isPropertyIdControlDisabled.
     *
     * It checks if the first property id control is to be  disabled (only when resource type is missing) and returns an empty string or null depending on the check (needed to populate "attr.disabled" input of the HTML element).
     *
     * @returns {string | null} The result of the check.
     */
    isPropertyIdControlDisabled(): string | null {
        return this._isResourecetypeMissing() ? '' : null; // Mechanism needed to populate "attr.disabled", cf. https://stackoverflow.com/a/49087915
    }

    /**
     * Public method: isSearchvalControlDisabled.
     *
     * It checks if the search value control at a given index is to be  disabled and returns an empty string or null depending on the check (needed to populate "attr.disabled" input of the HTML element).
     *
     * @param {number} index The given array index.
     *
     * @returns {string | null} The result of the check.
     */
    isSearchvalControlDisabled(index: number): string | null {
        const compopValue = this.getCompopoControlAtIndex(index).value;
        return this._isResourecetypeMissing() || this._isPropertyIdOrCompopMissing(index) || compopValue === 'EXISTS'
            ? ''
            : null;
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
            error: err => {
                console.error(err);
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
            .valueChanges.pipe(takeUntil(this._destroyed$))
            .subscribe({
                next: (propertyId: string) => {
                    const propertyListEntry = this.getPopertyListEntryById(propertyId)[0];
                    const guiElementId = propertyListEntry.guielement_id;
                    const valueTypeId = propertyListEntry.valuetype_id;

                    this.getCompopoControlAtIndex(index).setValue('');
                    this.getSearchvalControlAtIndex(index).setValue('');

                    this.selectedCompopSets[index] = this.getCompopSetByValueType(valueTypeId, guiElementId);
                },
                error: err => {
                    console.error(err);
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

            this.extendedSearchForm.value.propertiesControls.forEach(property => {
                this.extendedSearchParams.propertyId.push(property.propertyIdControl);
                this.extendedSearchParams.compop.push(property.compopControl);
                this.extendedSearchParams.searchval.push(property.searchvalControl);
            });

            this.searchRequest.emit(this.extendedSearchParams);

            // .this._resetForm();
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
    private _getFormArrayControlAtIndex(controlName: string, index: number): UntypedFormControl {
        return this.propertiesControls.controls[index].get(controlName) as UntypedFormControl;
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
     * Private method: _isPropertyIdOrCompopMissing.
     *
     * It checks if the propoerty id or ompop control at a given index do not have a value yet.
     *
     * @param {number} index The given array index.
     *
     * @returns {boolean} The result of the check.
     */
    private _isPropertyIdOrCompopMissing(index: number): boolean {
        return this._isPropertyIdMissing(index) || this._isCompopMissing(index);
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
        const formControlValue = this._getFormArrayControlAtIndex(controlName, index).value;
        return !formControlValue || formControlValue === this.defaultFormString;
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
}
