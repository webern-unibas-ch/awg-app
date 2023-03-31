import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';

import { click, clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import {
    mockPropertyTypesInResourceClassResponseJson,
    mockResourceTypesInVocabularyResponseJson,
} from '@testing/mock-data';
import { mockConsole } from '@testing/mock-helper';

import { ExtendedSearchParams, SearchCompop, SearchCompopSetsList } from '@awg-app/views/data-view/models';
import {
    PropertyTypesInResourceClassResponseJson,
    ResourceTypesInVocabularyResponseJson,
} from '@awg-shared/api-objects';
import { SEARCH_COMPOP_SETS_LIST } from '@awg-views/data-view/data';
import { DataApiService } from '@awg-views/data-view/services';

import { ExtendedSearchFormComponent } from './extended-search-form.component';

// Helper functions for ExtendedSearchFormComponent
function selectOptionById(selectId: string, optionIndex: number, de: DebugElement) {
    const optionDe = getAndExpectDebugElementByCss(de, `select#${selectId}`, 1, 1);
    const optionEl = optionDe[0].nativeElement as HTMLSelectElement;
    optionEl.value = optionEl.options[optionIndex].value;
    optionEl.dispatchEvent(new Event('change'));
}

function setInputValueById(inputId: string, inputValue: string, de: DebugElement) {
    const inputDe = getAndExpectDebugElementByCss(de, `input#${inputId}`, 1, 1);
    const inputEl = inputDe[0].nativeElement as HTMLInputElement;
    inputEl.value = inputValue;
    inputEl.dispatchEvent(new Event('input'));
}

function selectRestype(restypeIndex: number, de: DebugElement) {
    selectOptionById('awg-extended-search-resourcetype-input', restypeIndex, de);
}

function selectPropertyIdAtIndex(propertyIndex: number, index: number, de: DebugElement) {
    selectOptionById(`awg-extended-search-property-${index}`, propertyIndex, de);
}

function selectCompopAtIndex(compopIndex: number, index: number, de: DebugElement) {
    selectOptionById(`awg-extended-search-compop-${index}`, compopIndex, de);
}

function enterSearchvalAtIndex(searchval: string, index: number, de: DebugElement) {
    setInputValueById(`awg-extended-search-value-${index}`, searchval, de);
}

describe('ExtendedSearchFormComponent', () => {
    let component: ExtendedSearchFormComponent;
    let fixture: ComponentFixture<ExtendedSearchFormComponent>;
    let compDe: DebugElement;

    let formBuilder: FormBuilder;
    let dataApiService: DataApiService;

    let addPropertiesControlSpy: Spy;
    let alertSpy: Spy;
    let clearPropertiesControlsSpy: Spy;
    let createExtendedSearchFormSpy: Spy;
    let getCompopSetByValueTypeSpy: Spy;
    let getPropertyListsSpy: Spy;
    let getPropertyListEntryByIdSpy: Spy;
    let getResourcetypesSpy: Spy;
    let isCompopMissingSpy: Spy;
    let isFormControlValueMissingSpy: Spy;
    let isPropertyIdMissingSpy: Spy;
    let isPropertyIdOrCompopMissingSpy: Spy;
    let isResourecetypeMissingSpy: Spy;
    let isSearchvalMissingSpy: Spy;
    let isSearchvalTooShortSpy: Spy;
    let listenToUserResourcetypeChangeSpy: Spy;
    let listenToUserPropertyChangeSpy: Spy;
    let listenToUserCompopChangeSpy: Spy;
    let onResetSpy: Spy;
    let onSearchSpy: Spy;
    let resetFormSpy: Spy;
    let searchRequestEmitSpy: Spy;

    let consoleErrorSpy: Spy;
    let dataApiServiceGetResourcetypesSpy: Spy;
    let dataApiServiceGetPropertyListsSpy: Spy;

    let expectedResourceTypesResponse: ResourceTypesInVocabularyResponseJson;
    let expectedPropertyListsResponse: PropertyTypesInResourceClassResponseJson;

    let expectedExtendedSearchFormStrings: {
        label: string;
        placeholder: string;
        errorMessage: string;
    };
    let expectedSearchCompopSetsList: SearchCompopSetsList;
    let expectedValueTypeIds: string[];
    let expectedEmptyPropertiesControlValue: {
        propertyIdControl: string;
        compopControl: string;
        searchvalControl: string;
    };

    let expectedPlusIcon: IconDefinition;
    let expectedSearchIcon: IconDefinition;
    let expectedTrashIcon: IconDefinition;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, HttpClientTestingModule, ReactiveFormsModule],
            declarations: [ExtendedSearchFormComponent],
            providers: [FormBuilder, DataApiService],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExtendedSearchFormComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        formBuilder = TestBed.inject(FormBuilder);
        dataApiService = TestBed.inject(DataApiService);

        // Test data
        expectedResourceTypesResponse = mockResourceTypesInVocabularyResponseJson;
        expectedPropertyListsResponse = mockPropertyTypesInResourceClassResponseJson;
        expectedExtendedSearchFormStrings = {
            label: 'Search Input',
            placeholder: 'Volltextsuche in der Webern-Datenbank …',
            errorMessage: 'Es wird ein Suchbegriff mit mindestens 3 Zeichen benötigt!',
        };

        expectedSearchCompopSetsList = SEARCH_COMPOP_SETS_LIST;
        expectedValueTypeIds = ['1', '2', '3', '4', '5', '6', '7', '11', '12', '13', '14', '15'];
        expectedEmptyPropertiesControlValue = { propertyIdControl: '', compopControl: '', searchvalControl: '' };

        expectedPlusIcon = faPlus;
        expectedSearchIcon = faSearch;
        expectedTrashIcon = faTrash;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        addPropertiesControlSpy = spyOn(component, 'addPropertiesControl').and.callThrough();
        alertSpy = spyOn(window, 'alert').and.callFake(mockConsole.log);
        clearPropertiesControlsSpy = spyOn<any>(component, '_clearPropertiesControls').and.callThrough();
        consoleErrorSpy = spyOn(console, 'error').and.callFake(mockConsole.log);
        createExtendedSearchFormSpy = spyOn(component, 'createExtendedSearchForm').and.callThrough();
        getCompopSetByValueTypeSpy = spyOn(component, 'getCompopSetByValueType').and.callThrough();
        getPropertyListsSpy = spyOn(component, 'getPropertyLists').and.callThrough();
        getPropertyListEntryByIdSpy = spyOn(component, 'getPropertyListEntryById').and.callThrough();
        getResourcetypesSpy = spyOn(component, 'getResourcetypes').and.callThrough();
        isCompopMissingSpy = spyOn<any>(component, '_isCompopMissing').and.callThrough();
        isFormControlValueMissingSpy = spyOn<any>(component, '_isFormControlValueMissing').and.callThrough();
        isPropertyIdMissingSpy = spyOn<any>(component, '_isPropertyIdMissing').and.callThrough();
        isPropertyIdOrCompopMissingSpy = spyOn<any>(component, '_isPropertyIdOrCompopMissing').and.callThrough();
        isResourecetypeMissingSpy = spyOn<any>(component, '_isResourecetypeMissing').and.callThrough();
        isSearchvalMissingSpy = spyOn<any>(component, '_isSearchvalMissing').and.callThrough();
        isSearchvalTooShortSpy = spyOn<any>(component, '_isSearchvalTooShort').and.callThrough();
        listenToUserResourcetypeChangeSpy = spyOn(component, 'listenToUserResourcetypeChange').and.callThrough();
        listenToUserPropertyChangeSpy = spyOn(component, 'listenToUserPropertyChange').and.callThrough();
        listenToUserCompopChangeSpy = spyOn(component, 'listenToUserCompopChange').and.callThrough();
        onResetSpy = spyOn(component, 'onReset').and.callThrough();
        onSearchSpy = spyOn(component, 'onSearch').and.callThrough();
        resetFormSpy = spyOn<any>(component, '_resetForm').and.callThrough();
        searchRequestEmitSpy = spyOn(component.searchRequest, 'emit').and.callThrough();

        // Spies on dataApiService functions
        dataApiServiceGetResourcetypesSpy = spyOn(dataApiService, 'getResourceTypes').and.returnValue(
            observableOf(expectedResourceTypesResponse)
        );
        dataApiServiceGetPropertyListsSpy = spyOn(dataApiService, 'getPropertyListsByResourceType').and.returnValue(
            observableOf(expectedPropertyListsResponse)
        );
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `extendedSearchForm`', () => {
            expect(component.extendedSearchForm).toBeUndefined();
        });

        it('... should not have `propertyListsResponse`', () => {
            expect(component.propertyListsResponse).toBeUndefined();
        });

        it('... should not have `restypesResponse`', () => {
            expect(component.restypesResponse).toBeUndefined();
        });

        it('... should not have `selectedResourcetype`', () => {
            expect(component.selectedResourcetype).toBeUndefined();
        });

        it('... should not have `selectedProperties`', () => {
            expect(component.selectedProperties).toBeUndefined();
        });

        it('... should have `faPlus` icon', () => {
            expectToEqual(component.faPlus, expectedPlusIcon);
        });

        it('... should have `faSearch` icon', () => {
            expectToEqual(component.faSearch, expectedSearchIcon);
        });

        it('... should have `faTrash` icon', () => {
            expectToEqual(component.faTrash, expectedTrashIcon);
        });

        it('... should have `defaultFormString`', () => {
            expectToEqual(component.defaultFormString, '---');
        });

        it('... should have `extendedSearchFormStrings`', () => {
            expectToEqual(component.extendedSearchFormStrings, expectedExtendedSearchFormStrings);
        });

        it('... should have empty `extendedSearchParams`', () => {
            expectToEqual(component.extendedSearchParams, new ExtendedSearchParams());
        });

        it('... should have empty `selectedCompopSets`', () => {
            expectToEqual(component.selectedCompopSets, [[]]);
        });

        describe('VIEW', () => {
            it('... should not have a form yet', () => {
                const formDe = getAndExpectDebugElementByCss(compDe, 'form', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should trigger the `createExtendedSearchForm()` method', () => {
            expectSpyCall(createExtendedSearchFormSpy, 1, undefined);
        });

        it('... should trigger the `getResourcetypes()` method', () => {
            expectSpyCall(getResourcetypesSpy, 1, undefined);
        });

        it('... should have `extendedSearchForm`', () => {
            expect(component.extendedSearchForm).toBeDefined();
            expect(component.extendedSearchForm).toBeInstanceOf(FormGroup);
        });

        describe('#createExtendedSearchForm()', () => {
            it('... should have a method `createExtendedSearchForm()`', () => {
                expect(component.createExtendedSearchForm).toBeDefined();
            });

            it('... should have been triggered on init', () => {
                expectSpyCall(createExtendedSearchFormSpy, 1, undefined);
            });

            it('... should create the extended searchForm', () => {
                expect(component.extendedSearchForm).toBeDefined();
                expect(component.extendedSearchForm).toBeInstanceOf(FormGroup);
                expect(component.extendedSearchForm.controls).toBeDefined();
            });

            it('... should create the extended searchForm with FormControl `restypeControl`', () => {
                expect(component.extendedSearchForm.controls).toBeDefined();

                expect(component.extendedSearchForm.controls['restypeControl']).toBeDefined();
                expect(component.extendedSearchForm.controls['restypeControl']).toBeInstanceOf(
                    FormControl<string | null>
                );
            });

            it('... should create the extended searchForm with empty restypeControl value', () => {
                expect(component.extendedSearchForm.controls['restypeControl'].value).toBeFalsy();
            });

            it('... should get the empty restypeControl from its getter', () => {
                expect(component.restypeControl).toBeDefined();
                expect(component.restypeControl).toBeInstanceOf(FormControl);

                expect(component.restypeControl.value).toBeFalsy();
            });

            it('... should trigger the `addPropertiesControl` method', () => {
                expectSpyCall(addPropertiesControlSpy, 1, undefined);
            });

            it('... should create the extended searchForm with FormArray `propertiesControls`', () => {
                expect(component.extendedSearchForm.controls).toBeDefined();

                expect(component.extendedSearchForm.controls['propertiesControls']).toBeDefined();
                expect(component.extendedSearchForm.controls['propertiesControls']).toBeInstanceOf(FormArray);
            });

            it('... should create the extended searchForm with propertiesControls array with default empty properties control value', () => {
                expectToEqual(component.extendedSearchForm.controls['propertiesControls'].value, [
                    expectedEmptyPropertiesControlValue,
                ]);
            });

            it('... should get the empty propertiesControls from its getter', () => {
                expect(component.propertiesControls).toBeDefined();
                expect(component.propertiesControls).toBeInstanceOf(FormArray);

                expectToEqual(component.propertiesControls.value, [expectedEmptyPropertiesControlValue]);
            });
        });

        describe('#addPropertiesControl()', () => {
            it('... should have a method `addPropertiesControl()`', () => {
                expect(component.addPropertiesControl).toBeDefined();
            });

            it('... should trigger on init', () => {
                expectSpyCall(addPropertiesControlSpy, 1, undefined);
            });

            it('... should add a default empty propertiesControl to the propertiesControls array', () => {
                expectSpyCall(addPropertiesControlSpy, 1, undefined);
                expectToEqual(component.propertiesControls.value, [expectedEmptyPropertiesControlValue]);
            });

            it('... should disable all members of propertiesControl by default', () => {
                expectSpyCall(addPropertiesControlSpy, 1, undefined);
                expectToEqual(component.propertiesControls.value, [expectedEmptyPropertiesControlValue]);

                isResourecetypeMissingSpy.and.returnValue(true);

                expect(component.propertiesControls.controls[0]['controls']['propertyIdControl'].disabled).toBeTruthy();
                expect(component.propertiesControls.controls[0]['controls']['compopControl'].disabled).toBeTruthy();
                expect(component.propertiesControls.controls[0]['controls']['searchvalControl'].disabled).toBeTruthy();
            });

            it('... should enable propertyIdControl when resource type is not missing', () => {
                expectSpyCall(addPropertiesControlSpy, 1, undefined);
                expectToEqual(component.propertiesControls.value, [expectedEmptyPropertiesControlValue]);

                isResourecetypeMissingSpy.and.returnValue(false);

                component.addPropertiesControl();

                expect(component.propertiesControls.controls[1]['controls']['propertyIdControl'].disabled).toBeFalsy();
            });

            it('... should add a new empty propertiesControl to the propertiesControls array when called', () => {
                expectSpyCall(addPropertiesControlSpy, 1, undefined);
                expectToEqual(component.propertiesControls.value, [expectedEmptyPropertiesControlValue]);

                component.addPropertiesControl();

                expectSpyCall(addPropertiesControlSpy, 2, undefined);
                expectToEqual(component.propertiesControls.value, [
                    expectedEmptyPropertiesControlValue,
                    expectedEmptyPropertiesControlValue,
                ]);
            });

            it('... should add as many propertiesControls to the propertiesControls array as times called', () => {
                component.propertyListsResponse = expectedPropertyListsResponse;
                isResourecetypeMissingSpy.and.returnValue(false);

                const expectedControlValues = [];

                expectedPropertyListsResponse.properties.forEach((property, index) => {
                    if (!component.propertiesControls['controls'][index]) {
                        component.addPropertiesControl();
                    }
                    const propertyId = property.id;
                    const compop = 'EQUALS';
                    const searchval = `test-${index}`;

                    const propertyIdControl =
                        component.propertiesControls['controls'][index]['controls']['propertyIdControl'];
                    const compopControl = component.propertiesControls['controls'][index]['controls']['compopControl'];
                    const searchvalControl =
                        component.propertiesControls['controls'][index]['controls']['searchvalControl'];

                    propertyIdControl.enable();
                    propertyIdControl.setValue(propertyId);

                    compopControl.enable();
                    compopControl.setValue(compop);

                    searchvalControl.enable();
                    searchvalControl.setValue(searchval);

                    expectedControlValues.push({
                        propertyIdControl: propertyId,
                        compopControl: compop,
                        searchvalControl: searchval,
                    });
                });

                expectSpyCall(addPropertiesControlSpy, expectedControlValues.length, undefined);
                expectToEqual(component.propertiesControls.value, expectedControlValues);
            });
        });

        describe('#removePropertiesControl()', () => {
            it('... should have a method `removePropertiesControl()`', () => {
                expect(component.removePropertiesControl).toBeDefined();
            });

            describe('... should not do anything if', () => {
                it('... the index is out of bounds', () => {
                    expectSpyCall(addPropertiesControlSpy, 1, undefined);
                    expectToEqual(component.propertiesControls.value, [expectedEmptyPropertiesControlValue]);

                    component.addPropertiesControl();
                    component.addPropertiesControl();

                    expectSpyCall(addPropertiesControlSpy, 3, undefined);
                    expectToEqual(component.propertiesControls.value, [
                        expectedEmptyPropertiesControlValue,
                        expectedEmptyPropertiesControlValue,
                        expectedEmptyPropertiesControlValue,
                    ]);

                    component.removePropertiesControl(3);

                    expectToEqual(component.propertiesControls.value, [
                        expectedEmptyPropertiesControlValue,
                        expectedEmptyPropertiesControlValue,
                        expectedEmptyPropertiesControlValue,
                    ]);
                });

                it('... the index is negative', () => {
                    expectSpyCall(addPropertiesControlSpy, 1, undefined);
                    expectToEqual(component.propertiesControls.value, [expectedEmptyPropertiesControlValue]);

                    component.addPropertiesControl();
                    component.addPropertiesControl();

                    expectSpyCall(addPropertiesControlSpy, 3, undefined);
                    expectToEqual(component.propertiesControls.value, [
                        expectedEmptyPropertiesControlValue,
                        expectedEmptyPropertiesControlValue,
                        expectedEmptyPropertiesControlValue,
                    ]);

                    component.removePropertiesControl(-1);

                    expectToEqual(component.propertiesControls.value, [
                        expectedEmptyPropertiesControlValue,
                        expectedEmptyPropertiesControlValue,
                        expectedEmptyPropertiesControlValue,
                    ]);
                });

                it('... the propertiesControls array is already empty', () => {
                    expectSpyCall(addPropertiesControlSpy, 1, undefined);
                    expectToEqual(component.propertiesControls.value, [expectedEmptyPropertiesControlValue]);

                    component.removePropertiesControl(0);

                    expectToEqual(component.propertiesControls.value, []);

                    component.removePropertiesControl(0);

                    expectToEqual(component.propertiesControls.value, []);
                });
            });

            describe('... should remove a propertiesControl from the propertiesControls array', () => {
                it('... with a single entry ', () => {
                    expectSpyCall(addPropertiesControlSpy, 1, undefined);
                    expectToEqual(component.propertiesControls.value, [expectedEmptyPropertiesControlValue]);

                    component.removePropertiesControl(0);

                    expectToEqual(component.propertiesControls.value, []);
                });

                it('... with multiple entries', () => {
                    expectSpyCall(addPropertiesControlSpy, 1, undefined);
                    expectToEqual(component.propertiesControls.value, [expectedEmptyPropertiesControlValue]);

                    component.addPropertiesControl();
                    component.addPropertiesControl();

                    expectSpyCall(addPropertiesControlSpy, 3, undefined);
                    expectToEqual(component.propertiesControls.value, [
                        expectedEmptyPropertiesControlValue,
                        expectedEmptyPropertiesControlValue,
                        expectedEmptyPropertiesControlValue,
                    ]);

                    component.removePropertiesControl(0);

                    expectToEqual(component.propertiesControls.value, [
                        expectedEmptyPropertiesControlValue,
                        expectedEmptyPropertiesControlValue,
                    ]);

                    component.removePropertiesControl(1);
                    expectToEqual(component.propertiesControls.value, [expectedEmptyPropertiesControlValue]);
                });
            });
        });

        describe('#getCompopoControlAtIndex()', () => {
            it('... should have a method `getCompopoControlAtIndex()`', () => {
                expect(component.getCompopControlAtIndex).toBeDefined();
            });

            it('... should trigger the `listenToUserCompopChange` method', () => {
                const index = 0;

                expectSpyCall(listenToUserCompopChangeSpy, 2, index);

                component.getCompopControlAtIndex(index);

                expectSpyCall(listenToUserCompopChangeSpy, 3, index);
            });

            it('... should return the compopoControl at the given index', () => {
                expect(component.getCompopControlAtIndex(0)).toBeInstanceOf(FormControl);
                expectToEqual(component.getCompopControlAtIndex(0).value, '');
            });

            it('... should return null if the index is out of bounds', () => {
                expect(component.getCompopControlAtIndex(100)).toBeNull();
            });
        });

        describe('#getCompopSetByValueType()', () => {
            it('... should have a method `getCompopSetByValueType`', () => {
                expect(component.getCompopSetByValueType).toBeTruthy();
            });

            describe('... should return empty array if', () => {
                it('... there is no value type with the given valuetypeId in the list of value types', () => {
                    // 0 is not an existing value type id
                    expectToEqual(component.getCompopSetByValueType('0', '6'), []);
                });
            });

            it('... should return a COMPOP_SET, i.e., an array of search compops, when given valid inputs', () => {
                for (const valueTypeId of expectedValueTypeIds) {
                    for (const guieElementId of ['3', '6', '14']) {
                        const compopSet = component.getCompopSetByValueType(valueTypeId, guieElementId);

                        expect(typeof compopSet).toBe('object');
                        expect(Array.isArray(compopSet)).toBeTrue();
                        expect(compopSet.length).toBeGreaterThanOrEqual(0);

                        compopSet.forEach(compop => {
                            expect(compop instanceof SearchCompop).toBeTrue();
                        });
                    }
                }
            });

            describe('... should return COMPOP_SET with id 5 if', () => {
                it('... the given valueTypeId is 1', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[5].compopSet;

                    expectToEqual(component.getCompopSetByValueType('1', '0'), expectedCompopSet);
                });

                it('... the given valueTypeId is 6 and the given guiElementId is 14', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[5].compopSet;

                    expectToEqual(component.getCompopSetByValueType('6', '14'), expectedCompopSet);
                });

                it('... the given valueTypeId is 14', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[5].compopSet;

                    expectToEqual(component.getCompopSetByValueType('14', '0'), expectedCompopSet);
                });
            });

            describe('... should return COMPOP_SET with id 4 if', () => {
                it('... the given valueTypeId is 2', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[4].compopSet;

                    expectToEqual(component.getCompopSetByValueType('2', '0'), expectedCompopSet);
                });

                it('... the given valueTypeId is 3', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[4].compopSet;

                    expectToEqual(component.getCompopSetByValueType('3', '0'), expectedCompopSet);
                });
            });

            describe('... should return COMPOP_SET with id 3 if', () => {
                it('... the given valueTypeId is 4', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[3].compopSet;

                    expectToEqual(component.getCompopSetByValueType('4', '0'), expectedCompopSet);
                });

                it('... the given valueTypeId is 5', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[3].compopSet;

                    expectToEqual(component.getCompopSetByValueType('5', '0'), expectedCompopSet);
                });
            });

            describe('... should return COMPOP_SET with id 2 if', () => {
                it('... the given valueTypeId is 13', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[2].compopSet;

                    expectToEqual(component.getCompopSetByValueType('13', '0'), expectedCompopSet);
                });
            });

            describe('... should return COMPOP_SET with id 1 if', () => {
                it('... the given valueTypeId is 6 and the given guiElementId is 3', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[1].compopSet;

                    expectToEqual(component.getCompopSetByValueType('6', '3'), expectedCompopSet);
                });

                it('... the given valueTypeId is 6 and the given guiElementId is 6', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[1].compopSet;

                    expectToEqual(component.getCompopSetByValueType('6', '6'), expectedCompopSet);
                });

                it('... the given valueTypeId is 7', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[1].compopSet;

                    expectToEqual(component.getCompopSetByValueType('7', '0'), expectedCompopSet);
                });

                it('... the given valueTypeId is 11', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[1].compopSet;

                    expectToEqual(component.getCompopSetByValueType('11', '0'), expectedCompopSet);
                });

                it('... the given valueTypeId is 12', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[1].compopSet;

                    expectToEqual(component.getCompopSetByValueType('12', '0'), expectedCompopSet);
                });

                it('... the given valueTypeId is 15', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[1].compopSet;

                    expectToEqual(component.getCompopSetByValueType('15', '0'), expectedCompopSet);
                });
            });

            describe('... should return COMPOP_SET with id 0 if', () => {
                it('... the given valueTypeId is 6 and the given guiElementId is not 3, 6 or 14', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[0].compopSet;

                    expectToEqual(component.getCompopSetByValueType('6', '2'), expectedCompopSet);
                });

                it('... the given valueTypeId is 8', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[0].compopSet;

                    expectToEqual(component.getCompopSetByValueType('8', '0'), expectedCompopSet);
                });

                it('... the given valueTypeId is 9', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[0].compopSet;

                    expectToEqual(component.getCompopSetByValueType('9', '0'), expectedCompopSet);
                });

                it('... the given valueTypeId is 10', () => {
                    const expectedCompopSet = expectedSearchCompopSetsList.compopList[0].compopSet;

                    expectToEqual(component.getCompopSetByValueType('10', '0'), expectedCompopSet);
                });
            });
        });

        describe('#getPropertyIdControlAtIndex()', () => {
            it('... should have a method `getPropertyIdControlAtIndex`', () => {
                expect(component.getPropertyIdControlAtIndex).toBeDefined();
            });

            it('... should trigger the `listenToUserPropertyChange` method', () => {
                const index = 0;

                expectSpyCall(listenToUserPropertyChangeSpy, 2, index);

                component.getPropertyIdControlAtIndex(index);

                expectSpyCall(listenToUserPropertyChangeSpy, 3, index);
            });

            it('... should return the correct propertyIdControl', () => {
                component.propertyListsResponse = expectedPropertyListsResponse;

                expectedPropertyListsResponse.properties.forEach((property, index) => {
                    if (!component.extendedSearchForm.controls['propertiesControls']['controls'][index]) {
                        component.addPropertiesControl();
                    }
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'][
                        'propertyIdControl'
                    ].setValue(property.id);

                    expectToEqual(component.getPropertyIdControlAtIndex(index).value, property.id);
                });
            });

            it('... should return null if the propertyIdControl does not exist', () => {
                expect(component.getPropertyIdControlAtIndex(100)).toBeNull();
            });
        });

        describe('#getPropertyListEntryById()', () => {
            it('... should have a method `getPropertyListEntryById`', () => {
                expect(component.getPropertyListEntryById).toBeDefined();
            });

            it('... should return the correct property with the given id from the propertyListsResponse if found', () => {
                component.propertyListsResponse = expectedPropertyListsResponse;

                expectedPropertyListsResponse.properties.forEach((property, index) => {
                    expectToEqual(
                        component.getPropertyListEntryById(property.id),
                        expectedPropertyListsResponse.properties[index]
                    );
                });
            });

            it('... should return `undefined` if the property with the given id does not exist', () => {
                component.propertyListsResponse = expectedPropertyListsResponse;

                expect(component.getPropertyListEntryById('notExistingId')).toBeUndefined();
            });
        });

        describe('#getPropertyLists()', () => {
            it('... should have a method `getPropertyLists`', () => {
                expect(component.getPropertyLists).toBeDefined();
            });

            it('... should get propertyListsResponse from DataApiService', () => {
                component.getPropertyLists(expectedResourceTypesResponse.resourcetypes[0].id);

                expectSpyCall(dataApiServiceGetPropertyListsSpy, 1, undefined);
                expectToEqual(component.propertyListsResponse, expectedPropertyListsResponse);
            });

            it('... should log an error if the request to DataApiService fails', () => {
                const error = new Error('Error while getting property lists');
                dataApiServiceGetPropertyListsSpy.and.returnValue(observableThrowError(() => error));

                component.getPropertyLists(expectedResourceTypesResponse.resourcetypes[0].id);

                expectSpyCall(consoleErrorSpy, 1, error);
            });
        });

        describe('#getResourcetypes()', () => {
            it('... should have a method `getResourcetypes`', () => {
                expect(component.getResourcetypes).toBeDefined();
            });

            it('... should have been triggered on init', () => {
                expectSpyCall(getResourcetypesSpy, 1, undefined);
            });

            it('... should get restypesResponse from DataApiService', () => {
                expectSpyCall(dataApiServiceGetResourcetypesSpy, 1, undefined);
                expectToEqual(component.restypesResponse, expectedResourceTypesResponse);
            });

            it('... should trigger `listenToUserResourcetypeChange`', () => {
                expectSpyCall(dataApiServiceGetResourcetypesSpy, 1, undefined);
                expectSpyCall(listenToUserResourcetypeChangeSpy, 1, undefined);
            });

            it('... should log an error if the request to DataApiService fails', () => {
                const error = new Error('Error while getting resourcetypes');
                dataApiServiceGetResourcetypesSpy.and.returnValue(observableThrowError(() => error));

                component.getResourcetypes();

                expectSpyCall(consoleErrorSpy, 1, error);
            });
        });

        describe('#getSearchvalControlAtIndex()', () => {
            it('... should have a method `getSearchvalControlAtIndex`', () => {
                expect(component.getSearchvalControlAtIndex).toBeDefined();
            });

            it('... should return the correct searchvalControl if it is found', () => {
                component.extendedSearchForm.controls['propertiesControls']['controls'][0]['controls'][
                    'searchvalControl'
                ].setValue('Test value');

                expectToEqual(component.getSearchvalControlAtIndex(0).value, 'Test value');
            });

            it('... should return null if the searchvalControl does not exist', () => {
                expectToEqual(component.getSearchvalControlAtIndex(100), null);
            });
        });

        describe('#isAddButtonDisabled()', () => {
            it('... should have a method `isAddButtonDisabled`', () => {
                expect(component.isAddButtonDisabled).toBeDefined();
            });

            describe('... should return true if', () => {
                it('... property id or compop is missing', () => {
                    const index = 0;
                    const controls =
                        component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                    isPropertyIdOrCompopMissingSpy.withArgs(index).and.returnValue(true);
                    controls['compopControl'].setValue('EQUALS');
                    controls['searchvalControl'].setValue('abc');
                    // Index 0 is the last property

                    expectToEqual(component.isAddButtonDisabled(0), true);
                });

                it('... compop is not `EXISTS` and searchval is missing', () => {
                    const index = 0;
                    const controls =
                        component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                    isPropertyIdOrCompopMissingSpy.withArgs(index).and.returnValue(false);
                    controls['compopControl'].setValue('EQUALS');
                    controls['searchvalControl'].setValue('');
                    // Index 0 is the last property

                    expectToEqual(component.isAddButtonDisabled(0), true);
                });

                it('... compop is not `EXISTS` and search value is too short', () => {
                    const index = 0;
                    const controls =
                        component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                    isPropertyIdOrCompopMissingSpy.withArgs(index).and.returnValue(false);
                    controls['compopControl'].setValue('EQUALS');
                    controls['searchvalControl'].setValue('a');
                    // Index 0 is the last property

                    expectToEqual(component.isAddButtonDisabled(0), true);
                });

                it('... given index is not the index of the last property', () => {
                    const index = 0;
                    const controls =
                        component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                    component.addPropertiesControl();
                    component.addPropertiesControl();

                    isPropertyIdOrCompopMissingSpy.withArgs(index).and.returnValue(false);
                    controls['compopControl'].setValue('EQUALS');
                    controls['searchvalControl'].setValue('abc');
                    // Index 0 is not the last property

                    expectToEqual(component.isAddButtonDisabled(index), true);
                });

                it('... all of the above', () => {
                    const index = 0;
                    const controls =
                        component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                    component.addPropertiesControl();
                    component.addPropertiesControl();

                    isPropertyIdOrCompopMissingSpy.withArgs(index).and.returnValue(true);
                    controls['compopControl'].setValue('EQUALS');
                    controls['searchvalControl'].setValue('');
                    // Index 0 is not the last property

                    expectToEqual(component.isAddButtonDisabled(index), true);
                });
            });

            describe('... should return false if', () => {
                it('... compop is `EXISTS` and searchval is missing', () => {
                    const index = 0;
                    const controls =
                        component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                    isPropertyIdOrCompopMissingSpy.withArgs(index).and.returnValue(false);
                    controls['compopControl'].setValue('EXISTS');
                    controls['searchvalControl'].setValue('');
                    // Index 0 is the last property

                    expectToEqual(component.isAddButtonDisabled(0), false);
                });

                it('... compop is `EXISTS` and search value is too short', () => {
                    const index = 0;
                    const controls =
                        component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                    isPropertyIdOrCompopMissingSpy.withArgs(index).and.returnValue(false);
                    controls['compopControl'].setValue('EXISTS');
                    controls['searchvalControl'].setValue('a');
                    // Index 0 is the last property

                    expectToEqual(component.isAddButtonDisabled(0), false);
                });

                it('... property id and compop are present, compop is not `EXISTS` and search value is ok, and index is last property', () => {
                    const index = 0;
                    const controls =
                        component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                    isPropertyIdOrCompopMissingSpy.withArgs(index).and.returnValue(false);
                    controls['compopControl'].setValue('EQUALS');
                    controls['searchvalControl'].setValue('abc');
                    // Index 0 is the last property

                    expectToEqual(component.isAddButtonDisabled(0), false);
                });
            });
        });

        describe('#listenToUserResourcetypeChange()', () => {
            it('... should have a method `listenToUserResourcetypeChange`', () => {
                expect(component.listenToUserResourcetypeChange).toBeDefined();
            });

            it('... should call `listenToUserResourcetypeChange` on init', () => {
                expectSpyCall(listenToUserResourcetypeChangeSpy, 1, undefined);
            });

            it('... should set the selectedResourcetype when the user changes the resourcetypeId', () => {
                component.restypesResponse = expectedResourceTypesResponse;

                const expectedResourceType = expectedResourceTypesResponse.resourcetypes[0];
                component.restypeControl.setValue(expectedResourceType.id);

                expectToEqual(component.selectedResourcetype, expectedResourceType);

                const expectedResourceType1 = expectedResourceTypesResponse.resourcetypes[1];
                component.restypeControl.setValue(expectedResourceType1.id);

                expectToEqual(component.selectedResourcetype, expectedResourceType1);
            });

            it('... should trigger the `_clearPropertiesControls` method when the user changes the resourcetypeId', () => {
                component.restypesResponse = expectedResourceTypesResponse;

                const expectedResourceType = expectedResourceTypesResponse.resourcetypes[0];
                component.restypeControl.setValue(expectedResourceType.id);

                expectSpyCall(clearPropertiesControlsSpy, 1, undefined);

                const expectedResourceType1 = expectedResourceTypesResponse.resourcetypes[1];
                component.restypeControl.setValue(expectedResourceType1.id);

                expectSpyCall(clearPropertiesControlsSpy, 2, undefined);

                const expectedResourceTypeNonExisting = 'non-existing';
                component.restypeControl.setValue(expectedResourceTypeNonExisting);

                expectSpyCall(clearPropertiesControlsSpy, 3, undefined);
            });

            it('... should trigger the `getPropertyLists` method when the user changes the resourcetypeId and a resourcetype is selected', () => {
                component.restypesResponse = expectedResourceTypesResponse;

                const expectedResourceType = expectedResourceTypesResponse.resourcetypes[0];
                component.restypeControl.setValue(expectedResourceType.id);

                expectSpyCall(getPropertyListsSpy, 1, undefined);

                const expectedResourceType1 = expectedResourceTypesResponse.resourcetypes[1];
                component.restypeControl.setValue(expectedResourceType1.id);

                expectSpyCall(getPropertyListsSpy, 2, undefined);
            });

            it('... should not trigger the `getPropertyLists` method when the user changes the resourcetypeId and no resourcetype is selected', () => {
                component.restypesResponse = expectedResourceTypesResponse;

                const expectedResourceTypeNonExisting = 'non-existing';
                component.restypeControl.setValue(expectedResourceTypeNonExisting);

                expectSpyCall(getPropertyListsSpy, 0, undefined);
            });
        });

        describe('#listenToUserPropertyChange()', () => {
            it('... should have a method `listenToUserPropertyChange`', () => {
                expect(component.listenToUserPropertyChange).toBeDefined();
            });

            it('... should call `listenToUserPropertyChange` on init', () => {
                expectSpyCall(listenToUserPropertyChangeSpy, 2, undefined);
            });

            it('... should trigger the `getPropertyListEntryById` method when the user changes the propertyId', () => {
                component.propertyListsResponse = expectedPropertyListsResponse;
                expectSpyCall(getPropertyListEntryByIdSpy, 0);

                const index = 0;
                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                const expectedProperty = expectedPropertyListsResponse.properties[0];
                controls['propertyIdControl'].setValue(expectedProperty.id);

                expectSpyCall(getPropertyListEntryByIdSpy, 2, expectedProperty.id);

                const expectedProperty1 = expectedPropertyListsResponse.properties[1];
                controls['propertyIdControl'].setValue(expectedProperty1.id);

                expectSpyCall(getPropertyListEntryByIdSpy, 4, expectedProperty1.id);
            });

            it('... should enable the compop control and set to empty string when the changed propertyId is found', () => {
                component.propertyListsResponse = expectedPropertyListsResponse;

                const index = 0;
                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                controls['compopControl'].setValue('EXISTS');
                expectToEqual(controls['compopControl'].value, 'EXISTS');

                const expectedProperty = expectedPropertyListsResponse.properties[0];
                controls['propertyIdControl'].setValue(expectedProperty.id);

                expectToEqual(controls['compopControl'].disabled, false);
                expectToEqual(controls['compopControl'].enabled, true);
                expectToEqual(controls['compopControl'].value, '');
            });

            it('... should disable the searchval control and set to empty string when the changed propertyId is found', () => {
                component.propertyListsResponse = expectedPropertyListsResponse;

                const index = 0;
                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                controls['searchvalControl'].setValue('some value');
                expectToEqual(controls['searchvalControl'].value, 'some value');

                const expectedProperty = expectedPropertyListsResponse.properties[0];
                controls['propertyIdControl'].setValue(expectedProperty.id);

                expectToEqual(controls['searchvalControl'].disabled, true);
                expectToEqual(controls['searchvalControl'].enabled, false);
                expectToEqual(controls['searchvalControl'].value, '');
            });

            it('... should trigger the `getCompopSetByValueType` method when the changed propertyId is found', () => {
                component.propertyListsResponse = expectedPropertyListsResponse;
                expectSpyCall(getCompopSetByValueTypeSpy, 0);

                const index = 0;
                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                const expectedProperty = expectedPropertyListsResponse.properties[0];
                controls['propertyIdControl'].setValue(expectedProperty.id);

                expectSpyCall(getCompopSetByValueTypeSpy, 2, [
                    expectedProperty.valuetype_id,
                    expectedProperty.guielement_id,
                ]);

                const expectedProperty1 = expectedPropertyListsResponse.properties[1];
                controls['propertyIdControl'].setValue(expectedProperty1.id);

                expectSpyCall(getCompopSetByValueTypeSpy, 4, [
                    expectedProperty1.valuetype_id,
                    expectedProperty1.guielement_id,
                ]);
            });

            it('... should set the selectedCompopSets for the given index when the changed propertyId is found', () => {
                component.propertyListsResponse = expectedPropertyListsResponse;

                const index = 0;
                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                const expectedCompopSet = expectedSearchCompopSetsList.compopList[5].compopSet;
                const expectedProperty = expectedPropertyListsResponse.properties[0];
                controls['propertyIdControl'].setValue(expectedProperty.id);

                expectToEqual(component.selectedCompopSets[index], expectedCompopSet);

                const expectedCompopSet1 = expectedSearchCompopSetsList.compopList[3].compopSet;
                const expectedProperty1 = expectedPropertyListsResponse.properties[1];
                controls['propertyIdControl'].setValue(expectedProperty1.id);

                expectToEqual(component.selectedCompopSets[index], expectedCompopSet1);
            });

            it('... should not change compop control when the changed propertyId is not found', () => {
                component.propertyListsResponse = expectedPropertyListsResponse;

                const index = 0;
                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                controls['compopControl'].setValue('EXISTS');
                expectToEqual(controls['compopControl'].value, 'EXISTS');

                const expectedPropertyNonExisting = 'non-existing';
                controls['propertyIdControl'].setValue(expectedPropertyNonExisting);

                expectToEqual(controls['compopControl'].disabled, true);
                expectToEqual(controls['compopControl'].enabled, false);
                expectToEqual(controls['compopControl'].value, 'EXISTS');
            });

            it('... should not change searchval control when the changed propertyId is not found', () => {
                component.propertyListsResponse = expectedPropertyListsResponse;

                const index = 0;
                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                controls['searchvalControl'].setValue('some value');
                expectToEqual(controls['searchvalControl'].value, 'some value');

                const expectedPropertyNonExisting = 'non-existing';
                controls['propertyIdControl'].setValue(expectedPropertyNonExisting);

                expectToEqual(controls['searchvalControl'].disabled, true);
                expectToEqual(controls['searchvalControl'].enabled, false);
                expectToEqual(controls['searchvalControl'].value, 'some value');
            });

            it('... should not trigger the `getCompopSetByValueType` method when the changed propertyId is not found', () => {
                component.propertyListsResponse = expectedPropertyListsResponse;

                const index = 0;
                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                const expectedPropertyNonExisting = 'non-existing';
                controls['propertyIdControl'].setValue(expectedPropertyNonExisting);

                expectSpyCall(getCompopSetByValueTypeSpy, 0);
            });
        });

        describe('#listenToUserCompopChange()', () => {
            it('... should have a method `listenToUserCompopChange`', () => {
                expect(component.listenToUserCompopChange).toBeDefined();
            });

            it('... should call `listenToUserCompopChange` on init', () => {
                expectSpyCall(listenToUserCompopChangeSpy, 2, undefined);
            });

            it('... should enable the searchval control when the user changes the compop and compop is not `EXISTS`', () => {
                const index = 0;
                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                controls['compopControl'].setValue('EQUALS');

                expectToEqual(controls['searchvalControl'].disabled, false);
                expectToEqual(controls['searchvalControl'].enabled, true);
            });

            it('... should disable the searchval control when the user changes the compop and compop is `EXISTS`', () => {
                const index = 0;
                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                controls['compopControl'].setValue('EXISTS');

                expectToEqual(controls['searchvalControl'].disabled, true);
                expectToEqual(controls['searchvalControl'].enabled, false);
            });

            it('... should set the searchval control to empty string when the user changes the compop and compop is `EXISTS`', () => {
                const index = 0;
                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                controls['compopControl'].setValue('EXISTS');

                expectToEqual(controls['searchvalControl'].value, '');
            });
        });

        describe('#onReset()', () => {
            it('... should have a method `onReset`', () => {
                expect(component.onReset).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                component.restypesResponse = expectedResourceTypesResponse;

                const expectedResourceType = expectedResourceTypesResponse.resourcetypes[0];
                component.restypeControl.setValue(expectedResourceType.id);

                expectToBe(component.restypeControl.valid, true);
                detectChangesOnPush(fixture);

                const btnDes = getAndExpectDebugElementByCss(compDe, 'button#awg-extended-search-reset', 1, 1);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[0], fixture);

                expectSpyCall(onResetSpy, 1);
            }));

            it('... should trigger the `_resetForm` method', () => {
                expectSpyCall(resetFormSpy, 0, undefined);

                component.onReset();

                expectSpyCall(resetFormSpy, 1, undefined);
            });

            it('... should create an alert with a warning', () => {
                expectSpyCall(alertSpy, 0, undefined);

                component.onReset();

                expectSpyCall(alertSpy, 1, 'Gesamte Suchmaske zurücksetzen?');
            });
        });

        describe('#onSearch()', () => {
            it('... should have a method `onSearch`', () => {
                expect(component.onSearch).toBeDefined();
            });

            it('... should trigger on form submit', () => {
                component.restypesResponse = expectedResourceTypesResponse;
                component.propertyListsResponse = expectedPropertyListsResponse;

                selectRestype(1, compDe);
                fixture.detectChanges();

                const index = 0;
                selectPropertyIdAtIndex(1, index, compDe);
                fixture.detectChanges();

                selectCompopAtIndex(1, index, compDe);
                fixture.detectChanges();

                const btnDes = getAndExpectDebugElementByCss(compDe, 'button#awg-extended-search-submit', 1, 1);

                // Trigger click with click helper (needs nativeElement to trigger form submission)
                click(btnDes[0].nativeElement);

                expectSpyCall(onSearchSpy, 1);
            });

            it('... should not do anything if the search form is not valid', () => {
                expectToBe(component.extendedSearchForm.valid, false);

                component.onSearch();

                expectToEqual(component.extendedSearchParams, new ExtendedSearchParams());
                expectSpyCall(searchRequestEmitSpy, 0, undefined);
            });

            describe('... should have no valid extendedSearchForm if', () => {
                it('... the restypeControl is not valid', () => {
                    expectToBe(component.restypeControl.valid, false);

                    const index = 0;
                    const controls = component.propertiesControls['controls'][index]['controls'];
                    expectToBe(controls['propertyIdControl'].disabled, true);
                    expectToBe(controls['propertyIdControl'].valid, false);
                    expectToBe(controls['compopControl'].disabled, true);
                    expectToBe(controls['compopControl'].valid, false);
                    expectToBe(controls['searchvalControl'].disabled, true);
                    expectToBe(controls['searchvalControl'].valid, false);

                    component.onSearch();

                    expectToBe(component.extendedSearchForm.valid, false);
                });

                it('... the restype is valid, but the propertyIdControl is not valid', waitForAsync(() => {
                    component.restypesResponse = expectedResourceTypesResponse;

                    selectRestype(1, compDe);
                    fixture.detectChanges();

                    const index = 0;

                    fixture.whenStable().then(() => {
                        expectToBe(component.restypeControl.valid, true);

                        const controls = component.propertiesControls['controls'][index]['controls'];
                        expectToBe(controls['propertyIdControl'].enabled, true);
                        expectToBe(controls['propertyIdControl'].valid, false);
                        expectToBe(controls['compopControl'].disabled, true);
                        expectToBe(controls['compopControl'].valid, false);
                        expectToBe(controls['searchvalControl'].disabled, true);
                        expectToBe(controls['searchvalControl'].valid, false);

                        component.onSearch();

                        expectToBe(component.extendedSearchForm.valid, false);
                    });
                }));

                it('... the restype and propertyIdControl are valid, but the compopControl is not valid', waitForAsync(() => {
                    component.restypesResponse = expectedResourceTypesResponse;
                    component.propertyListsResponse = expectedPropertyListsResponse;

                    selectRestype(1, compDe);
                    fixture.detectChanges();

                    const index = 0;
                    selectPropertyIdAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        const controls = component.propertiesControls['controls'][index]['controls'];

                        expectToBe(component.restypeControl.valid, true);
                        expectToBe(controls['propertyIdControl'].enabled, true);
                        expectToBe(controls['propertyIdControl'].valid, true);
                        expectToBe(controls['compopControl'].enabled, true);
                        expectToBe(controls['compopControl'].valid, false);
                        expectToBe(controls['searchvalControl'].disabled, true);
                        expectToBe(controls['searchvalControl'].valid, false);

                        component.onSearch();

                        expectToBe(component.extendedSearchForm.valid, false);
                        expectToEqual(component.extendedSearchParams, new ExtendedSearchParams());
                        expectSpyCall(searchRequestEmitSpy, 0, undefined);
                    });
                }));

                it('... the restype, propertyIdControl and compopControl are valid, but compop is not `EXISTS`, and the searchval is missing', waitForAsync(() => {
                    component.restypesResponse = expectedResourceTypesResponse;
                    component.propertyListsResponse = expectedPropertyListsResponse;

                    selectRestype(1, compDe);
                    fixture.detectChanges();

                    const index = 0;
                    selectPropertyIdAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    selectCompopAtIndex(2, index, compDe);
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expectToBe(component.restypeControl.valid, true);

                        const controls = component.propertiesControls['controls'][index]['controls'];
                        expectToBe(controls['propertyIdControl'].enabled, true);
                        expectToBe(controls['propertyIdControl'].valid, true);
                        expectToBe(controls['compopControl'].enabled, true);
                        expectToBe(controls['compopControl'].valid, true);
                        expectToBe(controls['searchvalControl'].enabled, true);
                        expectToBe(controls['searchvalControl'].valid, false);

                        component.onSearch();

                        expectToBe(component.extendedSearchForm.valid, false);
                    });
                }));

                it('... the restype, propertyIdControl and compopControl are valid, but compop is not `EXISTS`, and the searchval is too short', waitForAsync(() => {
                    component.restypesResponse = expectedResourceTypesResponse;
                    component.propertyListsResponse = expectedPropertyListsResponse;

                    selectRestype(1, compDe);
                    fixture.detectChanges();

                    const index = 0;
                    selectPropertyIdAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    selectCompopAtIndex(2, index, compDe);
                    fixture.detectChanges();

                    enterSearchvalAtIndex('a', index, compDe);
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expectToBe(component.restypeControl.valid, true);

                        const controls = component.propertiesControls['controls'][index]['controls'];
                        expectToBe(controls['propertyIdControl'].enabled, true);
                        expectToBe(controls['propertyIdControl'].valid, true);
                        expectToBe(controls['compopControl'].enabled, true);
                        expectToBe(controls['compopControl'].valid, true);
                        expectToBe(controls['searchvalControl'].enabled, true);
                        expectToBe(controls['searchvalControl'].valid, false);

                        component.onSearch();

                        expectToBe(component.extendedSearchForm.valid, false);
                    });
                }));

                it('... the form has a second line of properties, but the second propertyId is invalid', waitForAsync(() => {
                    component.restypesResponse = expectedResourceTypesResponse;
                    component.propertyListsResponse = expectedPropertyListsResponse;

                    selectRestype(1, compDe);
                    fixture.detectChanges();

                    const index = 0;
                    selectPropertyIdAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    selectCompopAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    component.addPropertiesControl();
                    fixture.detectChanges();

                    const index1 = 1;

                    fixture.whenStable().then(() => {
                        expectToBe(component.restypeControl.valid, true);

                        const controls = component.propertiesControls['controls'][index]['controls'];
                        expectToBe(controls['propertyIdControl'].enabled, true);
                        expectToBe(controls['propertyIdControl'].valid, true);
                        expectToBe(controls['compopControl'].enabled, true);
                        expectToBe(controls['compopControl'].valid, true);
                        expectToBe(controls['searchvalControl'].disabled, true);
                        expectToBe(controls['searchvalControl'].valid, false);

                        const controls2 = component.propertiesControls['controls'][index1]['controls'];
                        expectToBe(controls2['propertyIdControl'].enabled, true);
                        expectToBe(controls2['propertyIdControl'].valid, false);
                        expectToBe(controls2['compopControl'].disabled, true);
                        expectToBe(controls2['compopControl'].valid, false);
                        expectToBe(controls2['searchvalControl'].disabled, true);
                        expectToBe(controls2['searchvalControl'].valid, false);

                        component.onSearch();

                        expectToBe(component.extendedSearchForm.valid, false);
                    });
                }));

                it('... the form has a second line of properties, but the second compop is invalid', waitForAsync(() => {
                    component.restypesResponse = expectedResourceTypesResponse;
                    component.propertyListsResponse = expectedPropertyListsResponse;

                    selectRestype(1, compDe);
                    fixture.detectChanges();

                    const index = 0;
                    selectPropertyIdAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    selectCompopAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    component.addPropertiesControl();
                    fixture.detectChanges();

                    const index1 = 1;
                    selectPropertyIdAtIndex(2, index1, compDe);

                    fixture.whenStable().then(() => {
                        expectToBe(component.restypeControl.valid, true);

                        const controls = component.propertiesControls['controls'][index]['controls'];
                        expectToBe(controls['propertyIdControl'].enabled, true);
                        expectToBe(controls['propertyIdControl'].valid, true);
                        expectToBe(controls['compopControl'].enabled, true);
                        expectToBe(controls['compopControl'].valid, true);
                        expectToBe(controls['searchvalControl'].disabled, true);
                        expectToBe(controls['searchvalControl'].valid, false);

                        const controls2 = component.propertiesControls['controls'][index1]['controls'];
                        expectToBe(controls2['propertyIdControl'].enabled, true);
                        expectToBe(controls2['propertyIdControl'].valid, true);
                        expectToBe(controls2['compopControl'].enabled, true);
                        expectToBe(controls2['compopControl'].valid, false);
                        expectToBe(controls2['searchvalControl'].disabled, true);
                        expectToBe(controls2['searchvalControl'].valid, false);

                        component.onSearch();

                        expectToBe(component.extendedSearchForm.valid, false);
                    });
                }));

                it('... the form has a second line of properties, but the compop is not `EXISTS` and the second searchval is missing', waitForAsync(() => {
                    component.restypesResponse = expectedResourceTypesResponse;
                    component.propertyListsResponse = expectedPropertyListsResponse;

                    selectRestype(1, compDe);
                    fixture.detectChanges();

                    const index = 0;
                    selectPropertyIdAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    selectCompopAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    component.addPropertiesControl();
                    fixture.detectChanges();

                    const index1 = 1;
                    selectPropertyIdAtIndex(2, index1, compDe);
                    fixture.detectChanges();

                    selectCompopAtIndex(2, index1, compDe);
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expectToBe(component.restypeControl.valid, true);

                        const controls = component.propertiesControls['controls'][index]['controls'];
                        expectToBe(controls['propertyIdControl'].enabled, true);
                        expectToBe(controls['propertyIdControl'].valid, true);
                        expectToBe(controls['compopControl'].enabled, true);
                        expectToBe(controls['compopControl'].valid, true);
                        expectToBe(controls['searchvalControl'].disabled, true);
                        expectToBe(controls['searchvalControl'].valid, false);

                        const controls2 = component.propertiesControls['controls'][index1]['controls'];
                        expectToBe(controls2['propertyIdControl'].enabled, true);
                        expectToBe(controls2['propertyIdControl'].valid, true);
                        expectToBe(controls2['compopControl'].enabled, true);
                        expectToBe(controls2['compopControl'].valid, true);
                        expectToBe(controls2['searchvalControl'].enabled, true);
                        expectToBe(controls2['searchvalControl'].valid, false);

                        component.onSearch();

                        expectToBe(component.extendedSearchForm.valid, false);
                    });
                }));

                it('... the form has a second line of properties, but the compop is not `EXISTS` and the second searchval is too short', waitForAsync(() => {
                    component.restypesResponse = expectedResourceTypesResponse;
                    component.propertyListsResponse = expectedPropertyListsResponse;

                    selectRestype(1, compDe);
                    fixture.detectChanges();

                    const index = 0;
                    selectPropertyIdAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    selectCompopAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    component.addPropertiesControl();
                    fixture.detectChanges();

                    const index1 = 1;
                    selectPropertyIdAtIndex(2, index1, compDe);
                    fixture.detectChanges();

                    selectCompopAtIndex(2, index1, compDe);
                    fixture.detectChanges();

                    enterSearchvalAtIndex('a', index1, compDe);
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expectToBe(component.restypeControl.valid, true);

                        const controls = component.propertiesControls['controls'][index]['controls'];
                        expectToBe(controls['propertyIdControl'].enabled, true);
                        expectToBe(controls['propertyIdControl'].valid, true);
                        expectToBe(controls['compopControl'].enabled, true);
                        expectToBe(controls['compopControl'].valid, true);
                        expectToBe(controls['searchvalControl'].disabled, true);
                        expectToBe(controls['searchvalControl'].valid, false);

                        const controls2 = component.propertiesControls['controls'][index1]['controls'];
                        expectToBe(controls2['propertyIdControl'].enabled, true);
                        expectToBe(controls2['propertyIdControl'].valid, true);
                        expectToBe(controls2['compopControl'].enabled, true);
                        expectToBe(controls2['compopControl'].valid, true);
                        expectToBe(controls2['searchvalControl'].enabled, true);
                        expectToBe(controls2['searchvalControl'].valid, false);

                        component.onSearch();

                        expectToBe(component.extendedSearchForm.valid, false);
                    });
                }));
            });

            describe('... should have a valid extendedSearchForm if', () => {
                it('... the restype is valid, the propertyIdControl is valid, the compopControl is valid and `EXISTS`', waitForAsync(() => {
                    component.restypesResponse = expectedResourceTypesResponse;
                    component.propertyListsResponse = expectedPropertyListsResponse;

                    selectRestype(1, compDe);
                    fixture.detectChanges();

                    const index = 0;
                    selectPropertyIdAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    selectCompopAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expectToBe(component.restypeControl.valid, true);

                        const controls = component.propertiesControls['controls'][index]['controls'];
                        expectToBe(controls['propertyIdControl'].enabled, true);
                        expectToBe(controls['propertyIdControl'].valid, true);
                        expectToBe(controls['compopControl'].enabled, true);
                        expectToBe(controls['compopControl'].valid, true);
                        expectToBe(controls['searchvalControl'].disabled, true);
                        expectToBe(controls['searchvalControl'].valid, false);

                        component.onSearch();

                        expectToBe(component.extendedSearchForm.valid, true);
                    });
                }));

                it('... the restype is valid, the propertyIdControl is valid, the compopControl is valid and not `EXISTS`, and the searchvalControl is valid', waitForAsync(() => {
                    component.restypesResponse = expectedResourceTypesResponse;
                    component.propertyListsResponse = expectedPropertyListsResponse;

                    selectRestype(1, compDe);
                    fixture.detectChanges();

                    const index = 0;
                    selectPropertyIdAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    selectCompopAtIndex(2, index, compDe);
                    fixture.detectChanges();

                    enterSearchvalAtIndex('abc', index, compDe);
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expectToBe(component.restypeControl.valid, true);

                        const controls = component.propertiesControls['controls'][index]['controls'];
                        expectToBe(controls['propertyIdControl'].enabled, true);
                        expectToBe(controls['propertyIdControl'].valid, true);
                        expectToBe(controls['compopControl'].enabled, true);
                        expectToBe(controls['compopControl'].valid, true);
                        expectToBe(controls['searchvalControl'].enabled, true);
                        expectToBe(controls['searchvalControl'].valid, true);

                        component.onSearch();

                        expectToBe(component.extendedSearchForm.valid, true);
                    });
                }));

                it('... the form has a second line of properties, the second propertyIdControl is valid, and the compopControl is valid and `EXISTS', waitForAsync(() => {
                    component.restypesResponse = expectedResourceTypesResponse;
                    component.propertyListsResponse = expectedPropertyListsResponse;

                    selectRestype(1, compDe);
                    fixture.detectChanges();

                    const index = 0;
                    selectPropertyIdAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    selectCompopAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    component.addPropertiesControl();
                    fixture.detectChanges();

                    const index1 = 1;
                    selectPropertyIdAtIndex(2, index1, compDe);
                    fixture.detectChanges();

                    selectCompopAtIndex(1, index1, compDe);
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expectToBe(component.restypeControl.valid, true);

                        const controls = component.propertiesControls['controls'][index]['controls'];
                        expectToBe(controls['propertyIdControl'].enabled, true);
                        expectToBe(controls['propertyIdControl'].valid, true);
                        expectToBe(controls['compopControl'].enabled, true);
                        expectToBe(controls['compopControl'].valid, true);
                        expectToBe(controls['searchvalControl'].disabled, true);
                        expectToBe(controls['searchvalControl'].valid, false);

                        const controls2 = component.propertiesControls['controls'][index1]['controls'];
                        expectToBe(controls2['propertyIdControl'].enabled, true);
                        expectToBe(controls2['propertyIdControl'].valid, true);
                        expectToBe(controls2['compopControl'].enabled, true);
                        expectToBe(controls2['compopControl'].valid, true);
                        expectToBe(controls2['searchvalControl'].disabled, true);
                        expectToBe(controls2['searchvalControl'].valid, false);

                        component.onSearch();

                        expectToBe(component.extendedSearchForm.valid, true);
                    });
                }));

                it('... the form has a second line of properties, the second propertyIdControl is valid, the compopControl is valid and not `EXISTS`, and the searchvalControl is valid', waitForAsync(() => {
                    component.restypesResponse = expectedResourceTypesResponse;
                    component.propertyListsResponse = expectedPropertyListsResponse;

                    selectRestype(1, compDe);
                    fixture.detectChanges();

                    const index = 0;
                    selectPropertyIdAtIndex(1, index, compDe);
                    fixture.detectChanges();

                    selectCompopAtIndex(2, index, compDe);
                    fixture.detectChanges();

                    enterSearchvalAtIndex('abc', index, compDe);
                    fixture.detectChanges();

                    component.addPropertiesControl();
                    fixture.detectChanges();

                    const index1 = 1;
                    selectPropertyIdAtIndex(2, index1, compDe);
                    fixture.detectChanges();

                    selectCompopAtIndex(2, index1, compDe);
                    fixture.detectChanges();

                    enterSearchvalAtIndex('def', index1, compDe);
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expectToBe(component.restypeControl.valid, true);

                        const controls = component.propertiesControls['controls'][index]['controls'];
                        expectToBe(controls['propertyIdControl'].enabled, true);
                        expectToBe(controls['propertyIdControl'].valid, true);
                        expectToBe(controls['compopControl'].enabled, true);
                        expectToBe(controls['compopControl'].valid, true);
                        expectToBe(controls['searchvalControl'].enabled, true);
                        expectToBe(controls['searchvalControl'].valid, true);

                        const controls2 = component.propertiesControls['controls'][index1]['controls'];
                        expectToBe(controls2['propertyIdControl'].enabled, true);
                        expectToBe(controls2['propertyIdControl'].valid, true);
                        expectToBe(controls2['compopControl'].enabled, true);
                        expectToBe(controls2['compopControl'].valid, true);
                        expectToBe(controls2['searchvalControl'].enabled, true);
                        expectToBe(controls2['searchvalControl'].valid, true);

                        component.onSearch();

                        expectToBe(component.extendedSearchForm.valid, true);
                    });
                }));
            });

            it('... should set the extendedSearchParams if the search form is valid', () => {
                component.restypesResponse = expectedResourceTypesResponse;
                component.propertyListsResponse = expectedPropertyListsResponse;

                selectRestype(1, compDe);
                fixture.detectChanges();

                const index = 0;
                selectPropertyIdAtIndex(1, index, compDe);
                fixture.detectChanges();

                selectCompopAtIndex(1, index, compDe);
                fixture.detectChanges();

                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];
                expectToBe(component.restypeControl.valid, true);
                expectToBe(controls.propertyIdControl.valid, true);
                expectToBe(controls.compopControl.valid, true);
                expectToBe(component.extendedSearchForm.valid, true);

                component.onSearch();

                let expectedSearchParams = new ExtendedSearchParams();
                expectedSearchParams = {
                    filterByRestype: expectedResourceTypesResponse.resourcetypes[0].id,
                    propertyId: [controls.propertyIdControl.value],
                    compop: [controls.compopControl.value],
                    searchval: [undefined],
                };

                expectToEqual(component.extendedSearchParams, expectedSearchParams);
            });

            it('... should emit the search request if the search form is valid', () => {
                component.restypesResponse = expectedResourceTypesResponse;
                component.propertyListsResponse = expectedPropertyListsResponse;

                selectRestype(1, compDe);
                fixture.detectChanges();

                const index = 0;
                selectPropertyIdAtIndex(1, index, compDe);
                fixture.detectChanges();

                selectCompopAtIndex(1, index, compDe);
                fixture.detectChanges();

                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];
                expectToBe(component.restypeControl.valid, true);
                expectToBe(controls.propertyIdControl.valid, true);
                expectToBe(controls.compopControl.valid, true);
                expectToBe(component.extendedSearchForm.valid, true);

                component.onSearch();

                let expectedSearchParams = new ExtendedSearchParams();
                expectedSearchParams = {
                    filterByRestype: expectedResourceTypesResponse.resourcetypes[0].id,
                    propertyId: [controls.propertyIdControl.value],
                    compop: [controls.compopControl.value],
                    searchval: [undefined],
                };

                expectToEqual(component.extendedSearchParams, expectedSearchParams);
                expectSpyCall(searchRequestEmitSpy, 1, expectedSearchParams);
            });
        });

        // Private methods
        describe('#_clearPropertiesControls()', () => {
            it('... should have a method `_clearPropertiesControls`', () => {
                expect((component as any)._clearPropertiesControls).toBeDefined();
            });

            it('... should call the clear method of the propertiesControls', () => {
                const propertiesControlsClearSpy = spyOn(component.propertiesControls, 'clear').and.callThrough();

                (component as any)._clearPropertiesControls();

                expectSpyCall(propertiesControlsClearSpy, 1, undefined);
            });

            it('... should trigger `addPropertiesControl`', () => {
                expectSpyCall(addPropertiesControlSpy, 1, undefined);

                (component as any)._clearPropertiesControls();

                expectSpyCall(addPropertiesControlSpy, 2, undefined);
            });

            it('... should clear the `propertiesControls` array to the default empty properties control value', () => {
                (component as any)._clearPropertiesControls();

                expectToEqual(component.propertiesControls.value, [expectedEmptyPropertiesControlValue]);
            });
        });

        describe('#_getFormArrayControlAtIndex', () => {
            it('... should have a method `_getFormArrayControlAtIndex`', () => {
                expect((component as any)._getFormArrayControlAtIndex).toBeDefined();
            });

            describe('... should return null if', () => {
                it('... the index is out of bounds', () => {
                    const index = 100;

                    expect((component as any)._getFormArrayControlAtIndex('searchvalControl', index)).toBeNull();
                });

                it('... the control does not exist', () => {
                    const index = 0;

                    expect((component as any)._getFormArrayControlAtIndex('invalidControl', index)).toBeNull();
                });
            });

            it('... should return the correct control if it exists', () => {
                component.propertyListsResponse = expectedPropertyListsResponse;
                const expectedPropertyId = 'Test property 0';
                const expectedCompop = 'EXISTS';
                const expectedSearchval = 'Test searchval 0';
                const index = 0;
                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                controls['propertyIdControl'].setValue(expectedPropertyId);
                controls['compopControl'].setValue(expectedCompop);
                controls['searchvalControl'].setValue(expectedSearchval);

                expectToEqual(
                    (component as any)._getFormArrayControlAtIndex('propertyIdControl', index).value,
                    expectedPropertyId
                );
                expectToEqual(
                    (component as any)._getFormArrayControlAtIndex('compopControl', index).value,
                    expectedCompop
                );
                expectToEqual(
                    (component as any)._getFormArrayControlAtIndex('searchvalControl', index).value,
                    expectedSearchval
                );
            });
        });

        describe('#_isCompopExists()', () => {
            it('... should have a method `_isCompopExists`', () => {
                expect((component as any)._isCompopExists).toBeDefined();
            });

            it('... should return true if the compop value is `EXISTS`', () => {
                const index = 0;

                component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'][
                    'compopControl'
                ].setValue('EXISTS');

                expect((component as any)._isCompopExists(index)).toBeTrue();
            });

            it('... should return false if the compop value is not `EXISTS`', () => {
                const index = 0;

                component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'][
                    'compopControl'
                ].setValue('EQUALS');

                expect((component as any)._isCompopExists(index)).toBeFalse();
            });
        });

        describe('#_isCompopMissing()', () => {
            it('... should have a method `_isCompopMissing`', () => {
                expect((component as any)._isCompopMissing).toBeDefined();
            });

            it('... should return true if `_isFormControlValueMissing` returns true', () => {
                const index = 0;

                isFormControlValueMissingSpy.withArgs('compopControl', index).and.returnValue(true);

                expect((component as any)._isCompopMissing(index)).toBeTrue();
            });

            it('... should return false if `_isFormControlValueMissing` returns false', () => {
                const index = 0;

                isFormControlValueMissingSpy.withArgs('compopControl', index).and.returnValue(false);

                expect((component as any)._isCompopMissing(index)).toBeFalse();
            });
        });

        describe('#_isFormControlValueMissing()', () => {
            it('... should have a method `_isFormControlValueMissing`', () => {
                expect((component as any)._isFormControlValueMissing).toBeDefined();
            });

            describe('... should return true if the form control value is', () => {
                it('... null', () => {
                    component.propertyListsResponse = expectedPropertyListsResponse;
                    const index = 0;

                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'][
                        'searchvalControl'
                    ].setValue(null);

                    expect((component as any)._isFormControlValueMissing('searchvalControl', index)).toBeTrue();
                });

                it('... undefined', () => {
                    component.propertyListsResponse = expectedPropertyListsResponse;
                    const index = 0;

                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'][
                        'searchvalControl'
                    ].setValue(undefined);

                    expect((component as any)._isFormControlValueMissing('searchvalControl', index)).toBeTrue();
                });

                it('... an empty string', () => {
                    component.propertyListsResponse = expectedPropertyListsResponse;
                    const index = 0;

                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'][
                        'searchvalControl'
                    ].setValue('');

                    expect((component as any)._isFormControlValueMissing('searchvalControl', index)).toBeTrue();
                });

                it('... the default formString', () => {
                    component.propertyListsResponse = expectedPropertyListsResponse;
                    const index = 0;

                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'][
                        'searchvalControl'
                    ].setValue(component.defaultFormString);

                    expect((component as any)._isFormControlValueMissing('searchvalControl', index)).toBeTrue();
                });
            });

            describe('... should return false if the form control value is', () => {
                it('... a number', () => {
                    const index = 0;

                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'][
                        'searchvalControl'
                    ].setValue(1);

                    expect((component as any)._isFormControlValueMissing('searchvalControl', index)).toBeFalse();
                });

                it('... a string', () => {
                    const index = 0;

                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'][
                        'searchvalControl'
                    ].setValue('test');

                    expect((component as any)._isFormControlValueMissing('searchvalControl', index)).toBeFalse();
                });

                it('... an object', () => {
                    const index = 0;

                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'][
                        'searchvalControl'
                    ].setValue({ id: 1 });

                    expect((component as any)._isFormControlValueMissing('searchvalControl', index)).toBeFalse();
                });

                it('... an empty object', () => {
                    const index = 0;

                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'][
                        'searchvalControl'
                    ].setValue({});

                    expect((component as any)._isFormControlValueMissing('searchvalControl', index)).toBeFalse();
                });

                it('... an empty array', () => {
                    const index = 0;

                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'][
                        'searchvalControl'
                    ].setValue([]);

                    expect((component as any)._isFormControlValueMissing('searchvalControl', index)).toBeFalse();
                });
            });

            it('... should return the correct value for the requested control', () => {
                component.propertyListsResponse = expectedPropertyListsResponse;
                const index = 0;
                const controls =
                    component.extendedSearchForm.controls['propertiesControls']['controls'][index]['controls'];

                controls['propertyIdControl'].setValue('Test property 0');
                controls['compopControl'].setValue('EXISTS');
                controls['searchvalControl'].setValue(null);

                expect((component as any)._isFormControlValueMissing('propertyIdControl', index)).toBeFalse();
                expect((component as any)._isFormControlValueMissing('compopControl', index)).toBeFalse();
                expect((component as any)._isFormControlValueMissing('searchvalControl', index)).toBeTrue();
            });
        });

        describe('#_isNotLastProperty()', () => {
            it('... should have a method `_isNotLastProperty`', () => {
                expect((component as any)._isNotLastProperty).toBeDefined();
            });

            describe('... should return true if the given index is', () => {
                it('... not the last index position in the propertiesControls', () => {
                    const index = 0;
                    const index1 = 1;

                    component.addPropertiesControl();
                    component.addPropertiesControl();

                    expect((component as any)._isNotLastProperty(index)).toBeTrue();
                    expect((component as any)._isNotLastProperty(index1)).toBeTrue();
                });

                it('... less than the length - 1 of the propertiesControls', () => {
                    const index = 1;

                    component.addPropertiesControl();
                    component.addPropertiesControl();

                    expect((component as any)._isNotLastProperty(index)).toBeTrue();
                });

                it('... negative', () => {
                    const index = -1;

                    component.addPropertiesControl();
                    component.addPropertiesControl();

                    expect((component as any)._isNotLastProperty(index)).toBeTrue();
                });
            });

            describe('... should return false if the given index is', () => {
                it('... the last index position in the propertiesControls', () => {
                    const index = 0;

                    expect((component as any)._isNotLastProperty(index)).toBeFalse();

                    // Add tow more properties controls
                    component.addPropertiesControl();
                    component.addPropertiesControl();

                    const index2 = 2;

                    expect((component as any)._isNotLastProperty(index2)).toBeFalse();
                });

                it('... greater than the length - 1 of the propertiesControls', () => {
                    const index = 3;

                    component.addPropertiesControl();
                    component.addPropertiesControl();

                    expect((component as any)._isNotLastProperty(index)).toBeFalse();
                });

                it('... equal to the length - 1 of the propertiesControls', () => {
                    const index = 2;

                    component.addPropertiesControl();
                    component.addPropertiesControl();

                    expect((component as any)._isNotLastProperty(index)).toBeFalse();
                });
            });
        });

        describe('#_isPropertyIdMissing()', () => {
            it('... should have a method `_isPropertyIdMissing`', () => {
                expect((component as any)._isPropertyIdMissing).toBeDefined();
            });

            it('... should return true if `_isFormControlValueMissing` returns true', () => {
                const index = 0;

                isFormControlValueMissingSpy.withArgs('propertyIdControl', index).and.returnValue(true);

                expect((component as any)._isPropertyIdMissing(index)).toBeTrue();
            });

            it('... should return false if `_isFormControlValueMissing` returns false', () => {
                const index = 0;

                isFormControlValueMissingSpy.withArgs('propertyIdControl', index).and.returnValue(false);

                expect((component as any)._isPropertyIdMissing(index)).toBeFalse();
            });
        });

        describe('#_isPropertyIdOrCompopMissing()', () => {
            it('... should have a method `_isPropertyIdOrCompopMissing`', () => {
                expect((component as any)._isPropertyIdOrCompopMissing).toBeDefined();
            });

            describe('... should return true if', () => {
                it('... `_isPropertyIdMissing` returns true', () => {
                    const index = 0;

                    isPropertyIdMissingSpy.withArgs(index).and.returnValue(true);
                    isCompopMissingSpy.withArgs(index).and.returnValue(false);

                    expect((component as any)._isPropertyIdOrCompopMissing(index)).toBeTrue();
                });

                it('... `_isCompopMissing` returns true', () => {
                    const index = 0;

                    isPropertyIdMissingSpy.withArgs(index).and.returnValue(false);
                    isCompopMissingSpy.withArgs(index).and.returnValue(true);

                    expect((component as any)._isPropertyIdOrCompopMissing(index)).toBeTrue();
                });

                it('... `_isPropertyIdMissing` and `_isCompopMissing` both return true', () => {
                    const index = 0;

                    isPropertyIdMissingSpy.withArgs(index).and.returnValue(true);
                    isCompopMissingSpy.withArgs(index).and.returnValue(true);

                    expect((component as any)._isPropertyIdOrCompopMissing(index)).toBeTrue();
                });
            });

            it('... should return false if `_isPropertyIdMissing` and `_isCompopMissing` both return false', () => {
                const index = 0;

                isPropertyIdMissingSpy.withArgs(index).and.returnValue(false);
                isCompopMissingSpy.withArgs(index).and.returnValue(false);

                expect((component as any)._isPropertyIdOrCompopMissing(index)).toBeFalse();
            });
        });

        describe('#_isResourecetypeMissing()', () => {
            it('... should have a method `_isResourecetypeMissing`', () => {
                expect((component as any)._isResourecetypeMissing).toBeDefined();
            });

            describe('... should return true if the restype control value is', () => {
                it('... an empty string', () => {
                    component.extendedSearchForm.controls['restypeControl'].setValue('');

                    expect((component as any)._isResourecetypeMissing()).toBeTrue();
                });

                it('... undefined', () => {
                    component.extendedSearchForm.controls['restypeControl'].setValue(undefined);

                    expect((component as any)._isResourecetypeMissing()).toBeTrue();
                });

                it('... null', () => {
                    component.extendedSearchForm.controls['restypeControl'].setValue(null);

                    expect((component as any)._isResourecetypeMissing()).toBeTrue();
                });

                it('... the default formString', () => {
                    component.extendedSearchForm.controls['restypeControl'].setValue(component.defaultFormString);

                    expect((component as any)._isResourecetypeMissing()).toBeTrue();
                });
            });

            describe('... should return false if the restype control value is', () => {
                it('... a number', () => {
                    component.extendedSearchForm.controls['restypeControl'].setValue(1);

                    expect((component as any)._isResourecetypeMissing()).toBeFalse();
                });

                it('... a string', () => {
                    component.extendedSearchForm.controls['restypeControl'].setValue('1');

                    expect((component as any)._isResourecetypeMissing()).toBeFalse();
                });

                it('... an object', () => {
                    component.extendedSearchForm.controls['restypeControl'].setValue({ id: 1 });

                    expect((component as any)._isResourecetypeMissing()).toBeFalse();
                });

                it('... an empty object', () => {
                    component.extendedSearchForm.controls['restypeControl'].setValue({});

                    expect((component as any)._isResourecetypeMissing()).toBeFalse();
                });

                it('... an empty array', () => {
                    component.extendedSearchForm.controls['restypeControl'].setValue([]);

                    expect((component as any)._isResourecetypeMissing()).toBeFalse();
                });
            });
        });

        describe('#_isSearchvalMissing()', () => {
            it('... should have a method `_isSearchvalMissing`', () => {
                expect((component as any)._isSearchvalMissing).toBeDefined();
            });

            it('... should return true if `_isFormControlValueMissing` returns true', () => {
                const index = 0;

                isFormControlValueMissingSpy.withArgs('searchvalControl', index).and.returnValue(true);

                expect((component as any)._isSearchvalMissing(index)).toBeTrue();
            });

            it('... should return false if `_isFormControlValueMissing` returns false', () => {
                const index = 0;

                isFormControlValueMissingSpy.withArgs('searchvalControl', index).and.returnValue(false);

                expect((component as any)._isSearchvalMissing(index)).toBeFalse();
            });
        });

        describe('#_isSearchvalMissingOrTooShort()', () => {
            it('... should have a method `_isSearchvalMissingOrTooShort`', () => {
                expect((component as any)._isSearchvalMissingOrTooShort).toBeDefined();
            });

            describe('... should return true if', () => {
                it('... `_isSearchvalMissing` returns true', () => {
                    const index = 0;

                    isSearchvalMissingSpy.withArgs(index).and.returnValue(true);
                    isSearchvalTooShortSpy.withArgs(index).and.returnValue(false);

                    expect((component as any)._isSearchvalMissingOrTooShort(index)).toBeTrue();
                });

                it('... `_isSearchvalTooShort` returns true', () => {
                    const index = 0;

                    isSearchvalMissingSpy.withArgs(index).and.returnValue(false);
                    isSearchvalTooShortSpy.withArgs(index).and.returnValue(true);

                    expect((component as any)._isSearchvalMissingOrTooShort(index)).toBeTrue();
                });

                it('... `_isSearchvalMissing` and `_isSearchvalTooShort` both return true', () => {
                    const index = 0;

                    isSearchvalMissingSpy.withArgs(index).and.returnValue(true);
                    isSearchvalTooShortSpy.withArgs(index).and.returnValue(true);

                    expect((component as any)._isSearchvalMissingOrTooShort(index)).toBeTrue();
                });
            });

            it('... should return false if `_isSearchvalMissing` and `_isSearchvalTooShort` both return false', () => {
                const index = 0;

                isSearchvalMissingSpy.withArgs(index).and.returnValue(false);
                isSearchvalTooShortSpy.withArgs(index).and.returnValue(false);

                expect((component as any)._isSearchvalMissingOrTooShort(index)).toBeFalse();
            });
        });

        describe('#_isSearchvalTooShort()', () => {
            it('... should have a method `_isSearchvalTooShort`', () => {
                expect((component as any)._isSearchvalTooShort).toBeDefined();
            });

            it('... should return true if the searchval control at a given index has a value that is shorter than 3 characters', () => {
                component.addPropertiesControl();
                component.addPropertiesControl();

                const controls = component.extendedSearchForm.controls['propertiesControls']['controls'];

                controls[0]['controls']['searchvalControl'].setValue('');
                controls[1]['controls']['searchvalControl'].setValue('a');
                controls[2]['controls']['searchvalControl'].setValue('ab');

                expect((component as any)._isSearchvalTooShort(0)).toBeTrue();
                expect((component as any)._isSearchvalTooShort(1)).toBeTrue();
                expect((component as any)._isSearchvalTooShort(2)).toBeTrue();
            });

            it('... should return false if the searchval control at a given index has a value that is equal or longer than 3 characters', () => {
                component.addPropertiesControl();
                component.addPropertiesControl();

                const controls = component.extendedSearchForm.controls['propertiesControls']['controls'];

                controls[0]['controls']['searchvalControl'].setValue('abc');
                controls[1]['controls']['searchvalControl'].setValue('abcd');
                controls[2]['controls']['searchvalControl'].setValue('abcde');

                expect((component as any)._isSearchvalTooShort(0)).toBeFalse();
                expect((component as any)._isSearchvalTooShort(1)).toBeFalse();
                expect((component as any)._isSearchvalTooShort(2)).toBeFalse();
            });
        });

        describe('#_resetForm()', () => {
            it('... should have a method `_resetForm`', () => {
                expect((component as any)._resetForm).toBeDefined();
            });

            it('... should call `reset` on the extendedSearchForm', () => {
                const extendedSearchFormResetSpy = spyOn(component.extendedSearchForm, 'reset').and.callThrough();

                (component as any)._resetForm();

                expectSpyCall(extendedSearchFormResetSpy, 1, undefined);
            });
        });

        describe('#_validateSearchval()', () => {
            it('... should have a method `_validateSearchval`', () => {
                expect((component as any)._validateSearchval).toBeDefined();
            });

            it('... should allow null searchvalControl when compopControl has value `EXISTS`', () => {
                const controls = component.extendedSearchForm.controls['propertiesControls']['controls'];
                const compopControl = controls[0]['controls']['compopControl'];
                const searchvalControl = controls[0]['controls']['searchvalControl'];
                const validator = (component as any)._validateSearchval();

                compopControl.setValue('EXISTS');

                expect(validator(searchvalControl)).toBeNull();
            });

            it('... should require non-null searchvalControl when compopControl has value other than `EXISTS`', () => {
                const controls = component.extendedSearchForm.controls['propertiesControls']['controls'];
                const compopControl = controls[0]['controls']['compopControl'];
                const searchvalControl = controls[0]['controls']['searchvalControl'];
                const validator = (component as any)._validateSearchval();

                compopControl.setValue('EQ');

                expect(validator(searchvalControl)).not.toBeNull();

                compopControl.setValue('NEQ');

                expect(validator(searchvalControl)).not.toBeNull();

                compopControl.setValue('LT');

                expect(validator(searchvalControl)).not.toBeNull();
            });

            it('... should require searchvalControl to have minimum length of 3 when compopControl has value other than `EXISTS`', () => {
                const controls = component.extendedSearchForm.controls['propertiesControls']['controls'];
                const compopControl = controls[0]['controls']['compopControl'];
                const searchvalControl = controls[0]['controls']['searchvalControl'];
                const validator = (component as any)._validateSearchval();

                compopControl.setValue('EQ');
                searchvalControl.setValue('');

                expect(validator(searchvalControl)).not.toBeNull();
                expect(validator(searchvalControl).minlength).toBeDefined();
                expectToEqual(validator(searchvalControl), { minlength: true });

                searchvalControl.setValue('a');

                expect(validator(searchvalControl)).not.toBeNull();
                expect(validator(searchvalControl).minlength).toBeDefined();
                expectToEqual(validator(searchvalControl), { minlength: true });

                searchvalControl.setValue('ab');

                expect(validator(searchvalControl)).not.toBeNull();
                expect(validator(searchvalControl).minlength).toBeDefined();
                expectToEqual(validator(searchvalControl), { minlength: true });

                searchvalControl.setValue('abc');

                expect(validator(searchvalControl)).toBeNull();
            });
        });
    });
});
