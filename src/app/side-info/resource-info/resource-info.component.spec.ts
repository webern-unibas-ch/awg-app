import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { AbstractControl, UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faArrowLeft, faChevronLeft, faChevronRight, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockSearchResponseJson } from '@testing/mock-data';
import { mockConsole } from '@testing/mock-helper';

import { DataStreamerService } from '@awg-core/services';
import { SearchResponseJson } from '@awg-shared/api-objects';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ResourceInfo, ResourceInfoResource } from '@awg-side-info/side-info-models';
import { ExtendedSearchParams, SearchResponseWithQuery } from '@awg-views/data-view/models';

import { ResourceInfoComponent } from './resource-info.component';

// Helper function
function getErrors(resourceInfoIndex: AbstractControl): {} {
    return resourceInfoIndex.errors || {};
}

// Mock components
@Component({ selector: 'awg-test', template: '' })
class SearchPanelStubComponent {}

describe('ResourceInfoComponent (DONE)', () => {
    let component: ResourceInfoComponent;
    let fixture: ComponentFixture<ResourceInfoComponent>;
    let compDe: DebugElement;

    let mockRouter: Partial<Router>;
    let mockDataStreamerService: Partial<DataStreamerService>;
    let dataStreamerService: Partial<DataStreamerService>;
    let formBuilder: UntypedFormBuilder;

    let buildFormSpy: Spy;
    let findIndexPositionInSearchResultsByIdSpy: Spy;
    let navigateToResourceSpy: Spy;
    let navigateToResourceByIndexSpy: Spy;
    let navigateToSearchPanelSpy: Spy;
    let getResourceInfoDataSpy: Spy;
    let updateResourceInfoSpy: Spy;

    let dataStreamerResourceIdSpy: Spy;
    let dataStreamerSearchResponseWithQuerySpy: Spy;
    let consoleSpy: Spy;

    const jsonPipe = new JsonPipe();

    const expectedResourceId = '1232';
    const expectedQuery = 'Test';
    let expectedSearchResponseWithQuery: SearchResponseWithQuery;
    let expectedGoToIndex: number;
    let expectedResultSize: number;

    beforeEach(waitForAsync(() => {
        // Router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        // Mocked dataStreamerService
        mockDataStreamerService = {
            getResourceId: (): Observable<string> => observableOf('test'),
            getSearchResponseWithQuery: (): Observable<SearchResponseWithQuery> => observableOf(),
        };

        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, ReactiveFormsModule],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: DataStreamerService, useValue: mockDataStreamerService },
                UntypedFormBuilder,
            ],
            declarations: [ResourceInfoComponent, CompileHtmlComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Inject service from root
        dataStreamerService = TestBed.inject(DataStreamerService);
        formBuilder = TestBed.inject(UntypedFormBuilder);

        const expectedSearchResponse = JSON.parse(JSON.stringify(mockSearchResponseJson));
        expectedSearchResponseWithQuery = new SearchResponseWithQuery(expectedSearchResponse, expectedQuery);
        expectedResultSize = 5;
        expectedGoToIndex = 3;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        buildFormSpy = spyOn(component as any, '_buildForm').and.callThrough();
        findIndexPositionInSearchResultsByIdSpy = spyOn(
            component as any,
            '_findIndexPositionInSearchResultsById'
        ).and.callThrough();
        updateResourceInfoSpy = spyOn(component as any, '_updateResourceInfo').and.callThrough();
        getResourceInfoDataSpy = spyOn(component, 'getResourceInfoData').and.callThrough();
        navigateToResourceSpy = spyOn(component, 'navigateToResource').and.callThrough();
        navigateToResourceByIndexSpy = spyOn(component, 'navigateToResourceByIndex').and.callThrough();
        navigateToSearchPanelSpy = spyOn(component, 'navigateToSearchPanel').and.callThrough();

        dataStreamerResourceIdSpy = spyOn(dataStreamerService, 'getResourceId').and.returnValue(
            observableOf(expectedResourceId)
        );
        dataStreamerSearchResponseWithQuerySpy = spyOn(
            dataStreamerService,
            'getSearchResponseWithQuery'
        ).and.returnValue(observableOf(expectedSearchResponseWithQuery));
        consoleSpy = spyOn(console, 'error').and.callFake(mockConsole.log);
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('injected service should use provided mockValue', () => {
        expect(dataStreamerService === mockDataStreamerService).toBe(true);
    });

    describe('BEFORE initial data binding', () => {
        it('should not have goToIndex', () => {
            expect(component.goToIndex).withContext('should be undefined').toBeUndefined();
        });

        it('should not have resourceId', () => {
            expect(component.resourceId).withContext('should be undefined').toBeUndefined();
        });

        it('should not have resourceInfoFormGroup', () => {
            expect(component.resourceInfoFormGroup).withContext('should be undefined').toBeUndefined();
        });

        it('should not have resultSize', () => {
            expect(component.resultSize).withContext('should be undefined').toBeUndefined();
        });

        it('should have empty resourceInfoData', () => {
            expect(component.resourceInfoData).withContext('should be defined').toBeDefined();
            expect(component.resourceInfoData).withContext('should equal new ResourceInfo').toEqual(new ResourceInfo());
        });

        it('should have fa-icons', () => {
            expect(component.faArrowLeft).withContext('should be faArrowLeft').toBe(faArrowLeft);
            expect(component.faChevronLeft).withContext('should be faChevronLeft').toBe(faChevronLeft);
            expect(component.faChevronRight).withContext('should be faChevronRight').toBe(faChevronRight);
            expect(component.faTimesCircle).withContext('should be faTimesCircle').toBe(faTimesCircle);
        });

        describe('VIEW', () => {
            it('... should not have a `div.card`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 0, 0);
            });
        });

        describe('#getResourceInfoData', () => {
            it('... should not have been called', () => {
                expectSpyCall(getResourceInfoDataSpy, 0);
            });
        });

        describe('#_updateResourceInfo', () => {
            it('... should not have been called', () => {
                expectSpyCall(updateResourceInfoSpy, 0);
            });
        });

        describe('#_buildForm', () => {
            it('... should not have been called', () => {
                expectSpyCall(buildFormSpy, 0);
            });
        });

        describe('#_findIndexPositionInSearchResultsById', () => {
            it('... should not have been called', () => {
                expectSpyCall(findIndexPositionInSearchResultsByIdSpy, 0);
            });
        });

        describe('#navigateToResource', () => {
            it('... should not have been called', () => {
                expect(navigateToResourceSpy).not.toHaveBeenCalled();
            });
        });

        describe('#navigateToSearchPanel', () => {
            it('... should not have been called', () => {
                expect(navigateToSearchPanelSpy).not.toHaveBeenCalled();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#getResourceInfoData', () => {
            it('... should have been called', () => {
                expectSpyCall(getResourceInfoDataSpy, 1);
            });

            it('... should have got `resourceId` from dataStreamerService', () => {
                expectSpyCall(dataStreamerResourceIdSpy, 1);

                expect(component.resourceId).withContext('should be truthy').toBeTruthy();
                expect(component.resourceId).withContext(`should be ${expectedResourceId}`).toBe(expectedResourceId);
            });

            it('... should have got searchResponseWithQuery from dataStreamerService', () => {
                expectSpyCall(dataStreamerSearchResponseWithQuerySpy, 1);
            });

            it('... should have called _updateResourceInfo with `resourceId` and searchResponse', () => {
                const expectedResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));

                expectSpyCall(updateResourceInfoSpy, 1, [expectedResourceId, expectedResponseClone]);
            });
            it('... should have set `goToIndex` and `resultSize` (via _updateResourceInfo)', () => {
                expect(component.resultSize).withContext('should be truthy').toBeTruthy();
                expect(component.resultSize).withContext(`should be ${expectedResultSize}`).toBe(expectedResultSize);

                expect(component.goToIndex).withContext('should be truthy').toBeTruthy();
                expect(component.goToIndex).withContext(`should be ${expectedGoToIndex}`).toBe(expectedGoToIndex);
            });

            it('... should have called _buildForm with `goToIndex` and `resultSize`', () => {
                expectSpyCall(buildFormSpy, 1, [expectedGoToIndex, expectedResultSize]);
            });

            it('... should not log error to console if subscription succeeds', () => {
                // Check initial subscription
                expectSpyCall(getResourceInfoDataSpy, 1);
                expectSpyCall(dataStreamerResourceIdSpy, 1);
                expectSpyCall(dataStreamerSearchResponseWithQuerySpy, 1);

                // Should not have logged to console
                expectSpyCall(consoleSpy, 0);
                expect(mockConsole.get(0)).withContext('should be undefined').toBeUndefined();
            });

            it('... should throw an error if subscription fails and log to console', () => {
                // Check initial subscription
                expectSpyCall(getResourceInfoDataSpy, 1);
                expectSpyCall(dataStreamerResourceIdSpy, 1);
                expectSpyCall(dataStreamerSearchResponseWithQuerySpy, 1);

                // Should not have logged to console
                expectSpyCall(consoleSpy, 0);
                expect(mockConsole.get(0)).withContext('should be undefined').toBeUndefined();

                // Spy on dataStreamerService to return an error
                dataStreamerSearchResponseWithQuerySpy.and.returnValue(observableThrowError(() => new Error('error')));

                const expectedLogMessage = 'RESOURCE-INFO: Got no sideInfoData from Subscription!';

                // Init new subscription with error
                component.getResourceInfoData();

                // Apply changes
                fixture.detectChanges();

                // Check new subscription
                expectSpyCall(getResourceInfoDataSpy, 2);
                expectSpyCall(dataStreamerResourceIdSpy, 2);
                expectSpyCall(dataStreamerSearchResponseWithQuerySpy, 2);

                // Check console
                expectSpyCall(consoleSpy, 1, expectedLogMessage);
                expect(mockConsole.get(0)).withContext(`should be ${expectedLogMessage}`).toEqual(expectedLogMessage);
            });
        });

        describe('#_updateResourceInfo', () => {
            it('... should have called `_findIndexPositionInSearchResultsById` with `resourceId` and searchResponse', () => {
                const expectedResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));

                expectSpyCall(findIndexPositionInSearchResultsByIdSpy, 1, [expectedResourceId, expectedResponseClone]);
            });

            it('... should set `goToIndex` and `resultSize`', () => {
                expect(component.resultSize).withContext('should be truthy').toBeTruthy();
                expect(component.resultSize).withContext(`should be ${expectedResultSize}`).toBe(expectedResultSize);

                expect(component.goToIndex).withContext('should be truthy').toBeTruthy();
                expect(component.goToIndex).withContext(`should be ${expectedGoToIndex}`).toBe(expectedGoToIndex);
            });

            it('... should change `goToIndex` and `resultSize` depending on input', () => {
                const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                // Pick last 3 entries
                otherResponseClone.data.subjects = otherResponseClone.data.subjects.slice(-3);
                expectedResultSize = 3;
                expectedGoToIndex = 1;

                (component as any)._updateResourceInfo(expectedResourceId, otherResponseClone);

                expect(component.resultSize).withContext('should be truthy').toBeTruthy();
                expect(component.resultSize).withContext(`should be ${expectedResultSize}`).toBe(expectedResultSize);

                expect(component.goToIndex).withContext('should be truthy').toBeTruthy();
                expect(component.goToIndex).withContext(`should be ${expectedGoToIndex}`).toBe(expectedGoToIndex);
            });

            describe('... should set `resourceInfoData` if', () => {
                it('... previous, current, next resource given', () => {
                    const expectedResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                    const subjects = expectedResponseClone.data.subjects;
                    const i = expectedGoToIndex - 1;
                    const expectedCurrent = subjects[i];
                    const expectedPrevious = subjects[i - 1];
                    const expectedNext = subjects[i + 1];

                    const expectedResourceInfoData: ResourceInfo = {
                        searchResults: expectedResponseClone,
                        resources: {
                            current: new ResourceInfoResource(expectedCurrent, i),
                            next: new ResourceInfoResource(expectedNext, i + 1),
                            previous: new ResourceInfoResource(expectedPrevious, i - 1),
                        },
                    };

                    expect(component.resourceInfoData).withContext('should be truthy').toBeTruthy();
                    expect(component.resourceInfoData)
                        .withContext(`should be ${expectedResourceInfoData}`)
                        .toEqual(expectedResourceInfoData);
                });

                it('... only current and next resource given', () => {
                    const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                    otherResponseClone.data.subjects = otherResponseClone.data.subjects.slice(-3);
                    expectedGoToIndex = 1;
                    expectedResultSize = 3;
                    const subjects = otherResponseClone.data.subjects;
                    const i = expectedGoToIndex - 1;
                    const expectedCurrent = subjects[i];
                    const expectedNext = subjects[i + 1];

                    const expectedResourceInfoData: ResourceInfo = {
                        searchResults: otherResponseClone,
                        resources: {
                            current: new ResourceInfoResource(expectedCurrent, i),
                            next: new ResourceInfoResource(expectedNext, i + 1),
                            previous: undefined,
                        },
                    };

                    (component as any)._updateResourceInfo(expectedResourceId, otherResponseClone);

                    expect(component.goToIndex).withContext('should be 1').toBe(1);
                    expect(component.resultSize).withContext('should be 3').toBe(3);

                    expect(component.resourceInfoData).withContext('should be truthy').toBeTruthy();
                    expect(component.resourceInfoData)
                        .withContext(`should be ${expectedResourceInfoData}`)
                        .toEqual(expectedResourceInfoData);
                });

                it('... only current and previous resource given', () => {
                    const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                    otherResponseClone.data.subjects = otherResponseClone.data.subjects.slice(0, 3);
                    expectedGoToIndex = 3;
                    expectedResultSize = 3;
                    const subjects = otherResponseClone.data.subjects;
                    const i = expectedGoToIndex - 1;
                    const expectedCurrent = subjects[i];
                    const expectedPrevious = subjects[i - 1];

                    const expectedResourceInfoData: ResourceInfo = {
                        searchResults: otherResponseClone,
                        resources: {
                            current: new ResourceInfoResource(expectedCurrent, i),
                            next: undefined,
                            previous: new ResourceInfoResource(expectedPrevious, i - 1),
                        },
                    };

                    (component as any)._updateResourceInfo(expectedResourceId, otherResponseClone);

                    expect(component.goToIndex).withContext(`should be ${expectedGoToIndex}`).toBe(expectedGoToIndex);
                    expect(component.resultSize)
                        .withContext(`should be ${expectedResultSize}`)
                        .toBe(expectedResultSize);

                    expect(component.resourceInfoData).withContext('should be truthy').toBeTruthy();
                    expect(component.resourceInfoData)
                        .withContext(`should be ${expectedResourceInfoData}`)
                        .toEqual(expectedResourceInfoData);
                });

                it('... only current resource given', () => {
                    const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                    otherResponseClone.data.subjects = otherResponseClone.data.subjects.slice(2, 3);
                    expectedGoToIndex = 1;
                    expectedResultSize = 1;
                    const subjects = otherResponseClone.data.subjects;
                    const i = expectedGoToIndex - 1;
                    const expectedCurrent = subjects[i];

                    const expectedResourceInfoData: ResourceInfo = {
                        searchResults: otherResponseClone,
                        resources: {
                            current: new ResourceInfoResource(expectedCurrent, i),
                            next: undefined,
                            previous: undefined,
                        },
                    };

                    (component as any)._updateResourceInfo(expectedResourceId, otherResponseClone);

                    expect(component.goToIndex).withContext(`should be ${expectedGoToIndex}`).toBe(expectedGoToIndex);
                    expect(component.resultSize)
                        .withContext(`should be ${expectedResultSize}`)
                        .toBe(expectedResultSize);

                    expect(component.resourceInfoData).withContext('should be truthy').toBeTruthy();
                    expect(component.resourceInfoData)
                        .withContext(`should be ${expectedResourceInfoData}`)
                        .toEqual(expectedResourceInfoData);
                });

                it('... no previous and current resource given', () => {
                    const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                    const sliceIndex = 2;
                    // Remove resource with resourceId from subjects (on array index position 2)
                    otherResponseClone.data.subjects = otherResponseClone.data.subjects
                        .slice(0, sliceIndex)
                        .concat(
                            otherResponseClone.data.subjects.slice(
                                sliceIndex + 1,
                                otherResponseClone.data.subjects.length
                            )
                        );

                    expectedGoToIndex = 0;
                    expectedResultSize = 4;
                    const subjects = otherResponseClone.data.subjects;
                    const i = expectedGoToIndex - 1;
                    const expectedNext = subjects[i + 1];

                    const expectedResourceInfoData: ResourceInfo = {
                        searchResults: otherResponseClone,
                        resources: {
                            current: undefined,
                            next: new ResourceInfoResource(expectedNext, i + 1),
                            previous: undefined,
                        },
                    };

                    (component as any)._updateResourceInfo(expectedResourceId, otherResponseClone);

                    expect(component.goToIndex).withContext(`should be ${expectedGoToIndex}`).toBe(expectedGoToIndex);
                    expect(component.resultSize)
                        .withContext(`should be ${expectedResultSize}`)
                        .toBe(expectedResultSize);

                    expect(component.resourceInfoData).withContext('should be truthy').toBeTruthy();
                    expect(component.resourceInfoData)
                        .withContext(`should equal ${expectedResourceInfoData}`)
                        .toEqual(expectedResourceInfoData);
                });
            });
        });

        describe('#_buildForm', () => {
            describe('... should have been called with', () => {
                it('... `goToIndex` and `resultSize`', () => {
                    expectedGoToIndex = 3;
                    expectedResultSize = 5;
                    expectSpyCall(buildFormSpy, 1, [expectedGoToIndex, expectedResultSize]);
                });

                it('... updated values when changed', () => {
                    expectSpyCall(buildFormSpy, 1, [expectedGoToIndex, expectedResultSize]);

                    // Remove last two entries from searchResponse to get no next resource
                    const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                    otherResponseClone.data.subjects = otherResponseClone.data.subjects.slice(-3);

                    dataStreamerSearchResponseWithQuerySpy.and.returnValue(observableOf(otherResponseClone));

                    component.getResourceInfoData();

                    // Apply changes
                    fixture.detectChanges();

                    expectedGoToIndex = 1;
                    expectedResultSize = 3;
                    expectSpyCall(buildFormSpy, 2, [expectedGoToIndex, expectedResultSize]);
                });
            });

            describe('... should have initiated resourceInfoFormGroup', () => {
                it('... on init', () => {
                    expect(component.resourceInfoFormGroup).toBeTruthy();
                });

                it('... as untouched, pristine and valid', () => {
                    expect(component.resourceInfoFormGroup).toBeTruthy();
                    expect(component.resourceInfoFormGroup.untouched).toBeTruthy();
                    expect(component.resourceInfoFormGroup.pristine).toBeTruthy();
                    expect(component.resourceInfoFormGroup.valid).toBeTruthy();
                });

                it('... with correct resourceInfoIndex', () => {
                    expectedGoToIndex = 3;

                    expect(component.resourceInfoFormGroup).toBeTruthy();
                    expect(component.resourceInfoFormGroup.controls['resourceInfoIndex']).toBeTruthy();
                    expect(component.resourceInfoFormGroup.controls['resourceInfoIndex'].value)
                        .withContext(`should equal ${expectedGoToIndex}`)
                        .toEqual(expectedGoToIndex);
                });

                it('... with empty index if none is given', () => {
                    const expectedEmptyIndex = '';

                    // Apply changes
                    (component as any)._buildForm(undefined, expectedResultSize);
                    fixture.detectChanges();

                    expect(component.resourceInfoFormGroup).toBeTruthy();
                    expect(component.resourceInfoFormGroup.controls['resourceInfoIndex']).toBeTruthy();
                    expect(component.resourceInfoFormGroup.controls['resourceInfoIndex'].value)
                        .withContext(`should equal ${expectedEmptyIndex}`)
                        .toEqual(expectedEmptyIndex);
                });
            });

            describe('Validators', () => {
                let errors;
                let resourceInfoIndex;

                beforeEach(() => {
                    errors = {};
                    resourceInfoIndex = component.resourceInfoFormGroup.controls['resourceInfoIndex'];
                });

                describe('... should complain if control has a non-empty value (Validators.required), namely...', () => {
                    it('empty string', () => {
                        // Empty string
                        resourceInfoIndex.setValue('');
                        errors = getErrors(resourceInfoIndex);

                        expect(errors['required']).toBeTruthy();
                    });

                    it('empty array', () => {
                        resourceInfoIndex.setValue([]);
                        errors = getErrors(resourceInfoIndex);

                        expect(errors['required']).toBeTruthy();
                    });

                    it('null', () => {
                        resourceInfoIndex.setValue(null);
                        errors = getErrors(resourceInfoIndex);

                        expect(errors['required']).toBeTruthy();
                    });

                    it('undefined', () => {
                        resourceInfoIndex.setValue(undefined);
                        errors = getErrors(resourceInfoIndex);

                        expect(errors['required']).toBeTruthy();
                    });
                });

                describe("... should complain if index is not a number (Validators.pattern('^[1-9]\\d{0,9}$')), namely...", () => {
                    const expectedPattern = '/^[1-9]\\d{0,9}$/';

                    it('NaN', () => {
                        const nanValue = NaN;
                        resourceInfoIndex.setValue(nanValue);
                        errors = getErrors(resourceInfoIndex);

                        const expectedPatternError = {
                            requiredPattern: expectedPattern,
                            actualValue: nanValue,
                        };

                        expect(errors['pattern']).toBeTruthy();
                        expect(errors['pattern'])
                            .withContext(`should equal ${expectedPatternError}`)
                            .toEqual(expectedPatternError);
                    });

                    it('any string', () => {
                        const anyString = 'should error';
                        resourceInfoIndex.setValue(anyString);
                        errors = getErrors(resourceInfoIndex);

                        const expectedPatternError = {
                            requiredPattern: expectedPattern,
                            actualValue: anyString,
                        };

                        expect(errors['pattern']).toBeTruthy();
                        expect(errors['pattern'])
                            .withContext(`should equal ${expectedPatternError}`)
                            .toEqual(expectedPatternError);
                    });

                    it('any array', () => {
                        const anyArray = [1, 2, 3];
                        resourceInfoIndex.setValue(anyArray);
                        errors = getErrors(resourceInfoIndex);

                        const expectedPatternError = {
                            requiredPattern: expectedPattern,
                            actualValue: anyArray,
                        };

                        expect(errors['pattern']).toBeTruthy();
                        expect(errors['pattern'])
                            .withContext(`should equal ${expectedPatternError}`)
                            .toEqual(expectedPatternError);
                    });

                    it('empty object', () => {
                        const emptyObject = {};
                        resourceInfoIndex.setValue(emptyObject);
                        errors = getErrors(resourceInfoIndex);

                        const expectedPatternError = {
                            requiredPattern: expectedPattern,
                            actualValue: emptyObject,
                        };

                        expect(errors['pattern']).toBeTruthy();
                        expect(errors['pattern'])
                            .withContext(`should equal ${expectedPatternError}`)
                            .toEqual(expectedPatternError);
                    });

                    it('any object', () => {
                        const anyObject = { one: 'should', two: 'error' };
                        resourceInfoIndex.setValue(anyObject);
                        errors = getErrors(resourceInfoIndex);

                        const expectedPatternError = {
                            requiredPattern: expectedPattern,
                            actualValue: anyObject,
                        };

                        expect(errors['pattern']).toBeTruthy();
                        expect(errors['pattern'])
                            .withContext(`should equal ${expectedPatternError}`)
                            .toEqual(expectedPatternError);
                    });
                });

                describe("... should not allow anything else than 1-to-10-digit positive integers (Validators.pattern('^[1-9]\\d{0,9}$')), namely ...", () => {
                    const expectedPattern = '/^[1-9]\\d{0,9}$/';

                    it('no 10-digit negative integers (-1234567890)', () => {
                        const tenDigitNegativeInteger = -1234567890;
                        resourceInfoIndex.setValue(tenDigitNegativeInteger);
                        errors = getErrors(resourceInfoIndex);

                        const expectedPatternError = {
                            requiredPattern: expectedPattern,
                            actualValue: tenDigitNegativeInteger,
                        };

                        expect(errors['pattern']).toBeTruthy();
                        expect(errors['pattern'])
                            .withContext(`should equal ${expectedPatternError}`)
                            .toEqual(expectedPatternError);
                    });

                    it('no 1-digit negative integers (-1)', () => {
                        const oneDigitNegativeInteger = -1;
                        resourceInfoIndex.setValue(oneDigitNegativeInteger);
                        errors = getErrors(resourceInfoIndex);

                        const expectedPatternError = {
                            requiredPattern: expectedPattern,
                            actualValue: oneDigitNegativeInteger,
                        };

                        expect(errors['pattern']).toBeTruthy();
                        expect(errors['pattern'])
                            .withContext(`should equal ${expectedPatternError}`)
                            .toEqual(expectedPatternError);
                    });

                    it('not 0', () => {
                        const zero = 0;
                        resourceInfoIndex.setValue(zero);
                        errors = getErrors(resourceInfoIndex);

                        const expectedPatternError = {
                            requiredPattern: expectedPattern,
                            actualValue: zero,
                        };

                        expect(errors['pattern']).toBeTruthy();
                        expect(errors['pattern'])
                            .withContext(`should equal ${expectedPatternError}`)
                            .toEqual(expectedPatternError);
                    });

                    it('no 11-digit positive integers (12345678901)', () => {
                        const elevenDigitPositivInteger = 12345678901;
                        resourceInfoIndex.setValue(elevenDigitPositivInteger);
                        errors = getErrors(resourceInfoIndex);

                        const expectedPatternError = {
                            requiredPattern: expectedPattern,
                            actualValue: elevenDigitPositivInteger,
                        };

                        expect(errors['pattern']).toBeTruthy();
                        expect(errors['pattern'])
                            .withContext(`should equal ${expectedPatternError}`)
                            .toEqual(expectedPatternError);
                    });

                    it('no floating numbers (1.1)', () => {
                        const floatingNumber = 1.1;
                        resourceInfoIndex.setValue(floatingNumber);
                        errors = getErrors(resourceInfoIndex);

                        const expectedPatternError = {
                            requiredPattern: expectedPattern,
                            actualValue: floatingNumber,
                        };

                        expect(errors['pattern']).toBeTruthy();
                        expect(errors['pattern'])
                            .withContext(`should equal ${expectedPatternError}`)
                            .toEqual(expectedPatternError);
                    });

                    it('no big floating numbers (1234567890.0123456789)', () => {
                        const bigFloatingNumber = 1234567890.0123456789;
                        resourceInfoIndex.setValue(bigFloatingNumber);
                        errors = getErrors(resourceInfoIndex);

                        const expectedPatternError = {
                            requiredPattern: expectedPattern,
                            actualValue: bigFloatingNumber,
                        };

                        expect(errors['pattern']).toBeTruthy();
                        expect(errors['pattern'])
                            .withContext(`should equal ${expectedPatternError}`)
                            .toEqual(expectedPatternError);
                    });
                });

                describe("... should allow positive 1-to-10-digit integers (Validators.pattern('^[1-9]\\d{0,9}$')), namely ...", () => {
                    it('one digit integer (1)', () => {
                        resourceInfoIndex.setValue(1);
                        errors = getErrors(resourceInfoIndex);

                        expect(errors['pattern']).toBeFalsy();
                    });

                    it('10 digit integers (1234567890)', () => {
                        resourceInfoIndex.setValue(1234567890);
                        errors = getErrors(resourceInfoIndex);

                        expect(errors['pattern']).toBeFalsy();
                    });

                    it('1.0 (Validator pattern allows decimal with .0; Input will not allow it)', () => {
                        resourceInfoIndex.setValue(1.0);
                        errors = getErrors(resourceInfoIndex);

                        expect(errors['pattern']).toBeFalsy();
                    });

                    it('big numbers with .0, e.g. 1234567890.0 (Validator pattern allows decimal with .0; Input will not allow it)', () => {
                        resourceInfoIndex.setValue(1234567890.0);
                        errors = getErrors(resourceInfoIndex);

                        expect(errors['pattern']).toBeFalsy();
                    });
                });

                describe('... should only allow an index minimum greater than or equal to 1 (Validators.min(1)), so that ...', () => {
                    it('min error == TRUE for value less than 0', () => {
                        resourceInfoIndex.setValue(-1);
                        errors = getErrors(resourceInfoIndex);

                        const expectedError = { min: 1, actual: -1 };

                        expect(errors['min']).toBeTruthy();
                        expect(errors['min']).withContext(`should equal ${expectedError}`).toEqual(expectedError);
                    });

                    it('min error == TRUE for 0', () => {
                        resourceInfoIndex.setValue(0);
                        errors = getErrors(resourceInfoIndex);

                        const expectedError = { min: 1, actual: 0 };

                        expect(errors['min']).toBeTruthy();
                        expect(errors['min']).withContext(`should equal ${expectedError}`).toEqual(expectedError);
                    });

                    it('min error == FALSE for 1', () => {
                        resourceInfoIndex.setValue(1);
                        errors = getErrors(resourceInfoIndex);

                        expect(errors['min']).toBeFalsy();
                    });

                    it('min error == FALSE for value greater than 1', () => {
                        resourceInfoIndex.setValue(3);
                        errors = getErrors(resourceInfoIndex);

                        expect(errors['min']).toBeFalsy();
                    });
                });

                describe('... should only allow an index maximum equal to `resultSize` (Validators.max(resultSize)), so that ...', () => {
                    it('max error == TRUE for value greater than resultSize', () => {
                        resourceInfoIndex.setValue(expectedResultSize + 1);
                        errors = getErrors(resourceInfoIndex);

                        const expectedError = { max: 5, actual: 6 };

                        expect(errors['max']).toBeTruthy();
                        expect(errors['max']).withContext(`should equal ${expectedError}`).toEqual(expectedError);
                    });

                    it('max error == FALSE for value equals resultSize', () => {
                        resourceInfoIndex.setValue(expectedResultSize);
                        errors = getErrors(resourceInfoIndex);

                        expect(errors['max']).toBeFalsy();
                    });

                    it('max error == FALSE for value less than resultSize', () => {
                        resourceInfoIndex.setValue(expectedResultSize - 1);
                        errors = getErrors(resourceInfoIndex);

                        expect(errors['max']).toBeFalsy();
                    });
                });
            });
        });

        describe('#_findIndexPositionInSearchResultsById', () => {
            it('... should return index position of a given `resourceId` in given search response', () => {
                const expectedResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));

                expect(
                    (component as any)._findIndexPositionInSearchResultsById(expectedResourceId, expectedResponseClone)
                ).toBeTruthy();
                expect(
                    (component as any)._findIndexPositionInSearchResultsById(expectedResourceId, expectedResponseClone)
                )
                    .withContext('should be 2')
                    .toBe(2);
            });

            it('... should return -1 if resource id is not found in given search response', () => {
                const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));

                const sliceIndex = 2;
                // Remove resource with resourceId from subjects (on array index position 2)
                otherResponseClone.data.subjects = otherResponseClone.data.subjects
                    .slice(0, sliceIndex)
                    .concat(
                        otherResponseClone.data.subjects.slice(sliceIndex + 1, otherResponseClone.data.subjects.length)
                    );

                expect(
                    (component as any)._findIndexPositionInSearchResultsById(expectedResourceId, otherResponseClone)
                ).toBeTruthy();
                expect((component as any)._findIndexPositionInSearchResultsById(expectedResourceId, otherResponseClone))
                    .withContext('should be -1')
                    .toBe(-1);
            });
        });

        describe('#navigateToResource', () => {
            let navigationSpy: Spy;

            beforeEach(() => {
                // Create SpyObj of mockrouter
                navigationSpy = mockRouter.navigate as jasmine.Spy;
            });

            it('... should do nothing if no resourceId is provided', () => {
                component.navigateToResource('');

                expectSpyCall(navigationSpy, 0);
            });

            it('... should trigger `router.navigate` (with resourceId)', () => {
                const expectedRoute = '/data/resource';

                component.navigateToResource(expectedResourceId);

                expectSpyCall(navigationSpy, 1, [[expectedRoute, expectedResourceId]]);
            });

            it('... should trigger on click', fakeAsync(() => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ul.awg-resource-info-list-group', 1, 1);
                const aDes = getAndExpectDebugElementByCss(ulDes[0], 'a.awg-list-group-item', 2, 2);

                // Trigger click on first anchor (previous) with click helper & wait for changes
                clickAndAwaitChanges(aDes[0], fixture);

                // Called previous resource (id: 1231)
                expectSpyCall(navigateToResourceSpy, 1, '1231');

                // Trigger click on second anchor (next) with click helper & wait for changes
                clickAndAwaitChanges(aDes[1], fixture);

                // Called next resource (id: 1231)
                expectSpyCall(navigateToResourceSpy, 2, '1233');
            }));
        });

        describe('#navigateToResourceByIndex', () => {
            let navigationSpy: Spy;

            beforeEach(() => {
                // Create spy of mockrouter SpyObj
                navigationSpy = mockRouter.navigate as jasmine.Spy;
            });

            describe('... should not do anything if ', () => {
                it('... no index is provided', () => {
                    component.navigateToResourceByIndex(undefined);

                    expectSpyCall(navigationSpy, 0);
                });

                it('... index is less than 1', () => {
                    component.navigateToResourceByIndex(0);

                    expectSpyCall(navigationSpy, 0);
                });
            });

            it('... should trigger `navigateToResource` and `router.navigate` (with id)', () => {
                const expectedRoute = '/data/resource';
                let formIndex = 3;

                component.navigateToResourceByIndex(formIndex);

                let expectedId = expectedSearchResponseWithQuery.data.subjects[formIndex - 1].obj_id;

                expectSpyCall(navigateToResourceSpy, 1, expectedId);
                expectSpyCall(navigationSpy, 1, [[expectedRoute, expectedId]]);

                // Change formIndex
                formIndex = 1;

                component.navigateToResourceByIndex(formIndex);

                expectedId = expectedSearchResponseWithQuery.data.subjects[formIndex - 1].obj_id;

                expectSpyCall(navigateToResourceSpy, 2, expectedId);
                expectSpyCall(navigationSpy, 2, [[expectedRoute, expectedId]]);
            });

            it('... should trigger on click', fakeAsync(() => {
                const buttonDes = getAndExpectDebugElementByCss(
                    compDe,
                    'button#awg-resource-info-input-group-text',
                    1,
                    1
                );

                // Set input to another index then current.displayIndex (=3)
                let chosenIndex = 1;
                let resourceInfoIndex = component.resourceInfoFormGroup.controls['resourceInfoIndex'];
                resourceInfoIndex.setValue(chosenIndex);

                // Apply changes
                fixture.detectChanges();

                // Trigger click on resourceIndex=1 with click helper & wait for changes
                clickAndAwaitChanges(buttonDes[0], fixture);

                // Called resourceIndex=1 (id: 1230)
                expectSpyCall(navigateToResourceByIndexSpy, 1, 1);
                expectSpyCall(navigateToResourceSpy, 1, '1230');

                // -----------------------------------------------------------
                // Set input to another index then current.displayIndex (=3)
                chosenIndex = 5;
                resourceInfoIndex = component.resourceInfoFormGroup.controls['resourceInfoIndex'];
                resourceInfoIndex.setValue(chosenIndex);

                // Apply changes
                fixture.detectChanges();

                // Trigger click on resourceIndex=5 with click helper & wait for changes
                clickAndAwaitChanges(buttonDes[0], fixture);

                // Called resourceIndex=5 (id: 1234)
                expectSpyCall(navigateToResourceByIndexSpy, 2, 5);
                expectSpyCall(navigateToResourceSpy, 2, '1234');
            }));
        });

        describe('#navigateToSearchPanel', () => {
            let navigationSpy: Spy;

            beforeEach(() => {
                // Create spy of mockrouter SpyObj
                navigationSpy = mockRouter.navigate as jasmine.Spy;

                component.resourceInfoData = new ResourceInfo();
            });

            it('... should trigger `router.navigate`', () => {
                component.navigateToSearchPanel();

                expectSpyCall(navigationSpy, 1);
            });

            describe('... should navigate to fulltext search route', () => {
                describe('... with empty string as queryParams query value if', () => {
                    it('... searchResults are undefined', () => {
                        const expectedRoute = ['/data/search'];
                        const expectedNavigationQuery = '';
                        const expectedParams = { queryParams: { query: expectedNavigationQuery } };

                        component.resourceInfoData.searchResults = undefined;
                        component.navigateToSearchPanel();

                        expect(component.resourceInfoData.searchResults).toBeUndefined();
                        expectSpyCall(navigationSpy, 1, [expectedRoute, expectedParams]);
                    });

                    it('... searchResults are null', () => {
                        const expectedRoute = ['/data/search'];
                        const expectedNavigationQuery = '';
                        const expectedParams = { queryParams: { query: expectedNavigationQuery } };

                        component.resourceInfoData.searchResults = null;
                        component.navigateToSearchPanel();

                        expect(component.resourceInfoData.searchResults).toBeNull();
                        expectSpyCall(navigationSpy, 1, [expectedRoute, expectedParams]);
                    });

                    it('... searchResults are given, but `searchResults.query` is an empty string', () => {
                        const actualQuery = '';
                        const expectedRoute = ['/data/search'];
                        const expectedNavigationQuery = '';
                        const expectedParams = { queryParams: { query: expectedNavigationQuery } };

                        component.resourceInfoData.searchResults = new SearchResponseWithQuery(
                            mockSearchResponseJson,
                            actualQuery
                        );
                        component.navigateToSearchPanel();

                        expect(component.resourceInfoData.searchResults).toBeTruthy();
                        expect(component.resourceInfoData.searchResults.query)
                            .withContext('should be empty string (falsy)')
                            .toBeFalsy();
                        expectSpyCall(navigationSpy, 1, [expectedRoute, expectedParams]);
                    });
                });

                describe('... with searchResults.query (string) as queryParams query value if', () => {
                    it('... searchResults have an empty SearchResponse', () => {
                        const actualQuery = 'Test';
                        const expectedRoute = ['/data/search'];
                        const expectedNavigationQuery = 'Test';
                        const expectedParams = { queryParams: { query: expectedNavigationQuery } };

                        component.resourceInfoData.searchResults = new SearchResponseWithQuery(
                            new SearchResponseJson(),
                            actualQuery
                        );
                        component.navigateToSearchPanel();

                        expect(component.resourceInfoData.searchResults).toBeTruthy();
                        expect(component.resourceInfoData.searchResults.query).toBeTruthy();
                        expectSpyCall(navigationSpy, 1, [expectedRoute, expectedParams]);
                    });

                    it('... searchResults are given and searchResults.query is typeof string', () => {
                        const actualQuery = 'TestString';
                        const expectedRoute = ['/data/search'];
                        const expectedNavigationQuery = 'TestString';
                        const expectedParams = { queryParams: { query: expectedNavigationQuery } };

                        component.resourceInfoData.searchResults = new SearchResponseWithQuery(
                            mockSearchResponseJson,
                            actualQuery
                        );
                        component.navigateToSearchPanel();

                        expect(component.resourceInfoData.searchResults).toBeTruthy();
                        expect(component.resourceInfoData.searchResults.query).toBeTruthy();
                        expect(typeof component.resourceInfoData.searchResults.query)
                            .withContext(`should be string`)
                            .toBe('string');
                        expectSpyCall(navigationSpy, 1, [expectedRoute, expectedParams]);
                    });
                });
            });

            describe('... should navigate to extended search route', () => {
                describe('... with searchResults.query (object) as queryParams query value if', () => {
                    it('... searchResults are given and searchResults.query is typeof object', () => {
                        const actualQuery: ExtendedSearchParams = {
                            filterByRestype: '43',
                            propertyId: ['1'],
                            compop: ['EXISTS'],
                            searchval: [''],
                        };
                        const expectedRoute = ['/data/search/', 'extended'];
                        const expectedNavigationQuery: ExtendedSearchParams = {
                            filterByRestype: '43',
                            propertyId: ['1'],
                            compop: ['EXISTS'],
                            searchval: [''],
                        };
                        const expectedParams = { queryParams: { query: expectedNavigationQuery } };

                        component.resourceInfoData.searchResults = new SearchResponseWithQuery(
                            mockSearchResponseJson,
                            actualQuery
                        );
                        component.navigateToSearchPanel();

                        expect(component.resourceInfoData.searchResults).toBeTruthy();
                        expect(component.resourceInfoData.searchResults.query).toBeTruthy();
                        expect(typeof component.resourceInfoData.searchResults.query)
                            .withContext(`should be object`)
                            .toBe('object');
                        expectSpyCall(navigationSpy, 1, [expectedRoute, expectedParams]);
                    });
                });
            });

            describe('... should trigger on click', () => {
                it('... without query', fakeAsync(() => {
                    const buttonDe = getAndExpectDebugElementByCss(compDe, 'div.card-header div button', 1, 1);

                    component.resourceInfoData.searchResults = new SearchResponseWithQuery(mockSearchResponseJson, '');

                    // Trigger click with click helper & wait for changes
                    clickAndAwaitChanges(buttonDe[0], fixture);

                    expectSpyCall(navigateToSearchPanelSpy, 1);
                }));

                it('with string query', fakeAsync(() => {
                    const buttonDe = getAndExpectDebugElementByCss(compDe, 'div.card-header div button', 1, 1);

                    component.resourceInfoData.searchResults = new SearchResponseWithQuery(
                        mockSearchResponseJson,
                        'Test'
                    );

                    // Trigger click with click helper & wait for changes
                    clickAndAwaitChanges(buttonDe[0], fixture);

                    expectSpyCall(navigateToSearchPanelSpy, 1);
                }));

                it('with object query', fakeAsync(() => {
                    const buttonDe = getAndExpectDebugElementByCss(compDe, 'div.card-header div button', 1, 1);

                    component.resourceInfoData.searchResults = new SearchResponseWithQuery(mockSearchResponseJson, {
                        filterByRestype: '43',
                        propertyId: ['1'],
                        compop: ['EXISTS'],
                        searchval: [''],
                    });

                    // Trigger click with click helper & wait for changes
                    clickAndAwaitChanges(buttonDe[0], fixture);

                    expectSpyCall(navigateToSearchPanelSpy, 1);
                }));
            });
        });

        describe('VIEW', () => {
            it('... should have one `div.card`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
            });

            it('... should have one header, body and footer in `div.card`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-header', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card-footer', 1, 1);
            });

            describe('div.card-header', () => {
                it('... should have two divs', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.card-header div', 2, 2);
                });

                it('... should have one button in first div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.card-header div', 2, 2);
                    getAndExpectDebugElementByCss(divDes[0], 'button', 1, 1);
                });

                it('... should have faArrowLeft icon in first div button', () => {
                    const buttonDes = getAndExpectDebugElementByCss(compDe, 'div.card-header div button', 1, 1);
                    const iconDes = getAndExpectDebugElementByCss(buttonDes[0], 'fa-icon', 1, 1);

                    expect(iconDes[0].children[0]).toBeTruthy();
                    expect(iconDes[0].children[0].classes).toBeTruthy();
                    expect(iconDes[0].children[0].classes['fa-arrow-left']).toBeTrue();
                });

                it('... should display innerHTML text on first div button', () => {
                    const buttonDe = getAndExpectDebugElementByCss(compDe, 'div.card-header div button', 1, 1);
                    const spanDe = getAndExpectDebugElementByCss(buttonDe[0], 'span.awg-resource-info-btn-text', 1, 1);
                    const spanEl = spanDe[0].nativeElement;

                    const expectedText = 'Zur Suche';

                    expect(spanEl.innerText).toBeTruthy();
                    expect(spanEl.innerText).withContext(`should be ${expectedText}`).toBe(expectedText);
                });

                it('... should display bold, small, muted text in second div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.card-header div', 2, 2);
                    const strongDes = getAndExpectDebugElementByCss(divDes[1], 'strong', 1, 1);
                    const strongEl = strongDes[0].nativeElement;

                    const expectedText = 'Aktuelle Suchanfrage';

                    expect(strongEl).toHaveClass('text-muted');
                    expect(strongEl).toHaveClass('small');

                    expect(strongEl.innerText).toBeTruthy();
                    expect(strongEl.innerText).withContext(`should be ${expectedText}`).toBe(expectedText);
                });

                it('... should display query in span in second div', () => {
                    component.resourceInfoData.searchResults.query = 'Test';

                    fixture.detectChanges();

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.card-header div', 2, 2);
                    const spanDes = getAndExpectDebugElementByCss(divDes[1], 'span', 1, 1);
                    const spanEl = spanDes[0].nativeElement;

                    expect(spanEl.innerText).toBeTruthy();
                    expect(spanEl.innerText)
                        .withContext(`should be ${expectedQuery}`)
                        .toBe(jsonPipe.transform(expectedQuery));
                });

                it('... should display `---`  without query in span in second div', () => {
                    component.resourceInfoData.searchResults.query = '';

                    fixture.detectChanges();

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.card-header div', 2, 2);
                    const spanDes = getAndExpectDebugElementByCss(divDes[1], 'span', 1, 1);
                    const spanEl = spanDes[0].nativeElement;

                    const expectedText = '---';

                    expect(spanEl.innerText).toBeTruthy();
                    expect(spanEl.innerText).withContext(`should be ${expectedText}`).toBe(expectedText);
                });
            });

            describe('div.card-body', () => {
                it('... should have one div with ul', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.card-body div ul.awg-resource-info-list-group', 1, 1);
                });

                it('... should have two anchor and one li in ul', () => {
                    const ulDes = getAndExpectDebugElementByCss(compDe, 'ul.awg-resource-info-list-group', 1, 1);

                    getAndExpectDebugElementByCss(ulDes[0], 'a.awg-list-group-item', 2, 2);
                    getAndExpectDebugElementByCss(ulDes[0], 'li.list-group-item', 1, 1);
                });

                describe('previous resource (first anchor)', () => {
                    it('... should display text left (text-start)', () => {
                        const ulDes = getAndExpectDebugElementByCss(compDe, 'ul.awg-resource-info-list-group', 1, 1);
                        const aDes = getAndExpectDebugElementByCss(ulDes[0], 'a.awg-list-group-item', 2, 2);
                        const aEl0 = aDes[0].nativeElement;

                        expect(aEl0).toHaveClass('text-start');
                    });

                    describe('if previous resource is given', () => {
                        it('... should have list-group-item-action class', () => {
                            const aDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-start',
                                1,
                                1
                            );
                            const aEl0 = aDes[0].nativeElement;

                            expect(aEl0).toHaveClass('list-group-item-action');
                        });

                        it('... should navigate to previous resource on click', fakeAsync(() => {
                            const aDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-start',
                                1,
                                1
                            );

                            // Trigger click on anchor (previous) with click helper & wait for changes
                            clickAndAwaitChanges(aDes[0], fixture);

                            // Called previous resource (id: 1231)
                            expectSpyCall(navigateToResourceSpy, 1, '1231');
                        }));

                        it('... should contain two divs', () => {
                            const ulDes = getAndExpectDebugElementByCss(
                                compDe,
                                'ul.awg-resource-info-list-group',
                                1,
                                1
                            );

                            getAndExpectDebugElementByCss(ulDes[0], 'a.awg-list-group-item.text-start > div', 2, 2);
                        });

                        it('... should have strong element with text-muted and small class in first div', () => {
                            const divDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-start > div',
                                2,
                                2
                            );
                            // Get first div
                            const strongDes = getAndExpectDebugElementByCss(divDes[0], 'strong', 1, 1);
                            const strongEl = strongDes[0].nativeElement;

                            expect(strongEl).toHaveClass('text-muted');
                            expect(strongEl).toHaveClass('small');
                        });

                        it('... should have faChevronLeft icon in strong element', () => {
                            const strongDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-start > div > strong',
                                1,
                                1
                            );
                            const iconDes = getAndExpectDebugElementByCss(strongDes[0], 'fa-icon', 1, 1);
                            expect(iconDes[0].children[0]).toBeTruthy();
                            expect(iconDes[0].children[0].classes).toBeTruthy();
                            expect(iconDes[0].children[0].classes['fa-chevron-left']).toBeTrue();
                        });

                        it('... should point to previous resource in span in strong element', () => {
                            const strongDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-start > div > strong',
                                1,
                                1
                            );
                            const spanDes = getAndExpectDebugElementByCss(
                                strongDes[0],
                                'span.awg-resource-info-btn-text',
                                1,
                                1
                            );

                            const spanEl = spanDes[0].nativeElement;
                            const expectedIndex = component.resourceInfoData.resources.previous.displayIndex; // = 2
                            const expectedInnerText = `Vorheriges Ergebnis (${expectedIndex}/${expectedResultSize})`;

                            expect(spanEl.innerText).toBeTruthy();
                            expect(spanEl.innerText)
                                .withContext(`should be ${expectedInnerText}`)
                                .toBe(expectedInnerText);
                        });

                        it('... should have two divs.single-line in second div', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-start > div',
                                2,
                                2
                            );
                            const divDes = getAndExpectDebugElementByCss(outerDivDes[1], 'div.single-line', 2, 2);
                            // Get second div
                            const divEl1 = divDes[1].nativeElement;

                            expect(divEl1).toHaveClass('text-muted');
                            expect(divEl1).toHaveClass('small');
                        });

                        it('... should display previous title in first div.single-line', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-start > div',
                                2,
                                2
                            );
                            // Get spans of second outerDiv
                            const spanDes = getAndExpectDebugElementByCss(
                                outerDivDes[1],
                                'div.single-line > span',
                                2,
                                2
                            );
                            const spanEl0 = spanDes[0].nativeElement;
                            const title = component.resourceInfoData.resources.previous.title; // = Nelson 1974

                            expect(spanEl0.innerText).toBeTruthy();
                            expect(spanEl0.innerText).withContext(`should be ${title}`).toBe(title);
                        });

                        it('... should display previous subtitle in second div.single-line', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-start > div',
                                2,
                                2
                            );
                            const spanDes = getAndExpectDebugElementByCss(
                                outerDivDes[1],
                                'div.single-line > span',
                                2,
                                2
                            );
                            const spanEl1 = spanDes[1].nativeElement;
                            const subTitle = component.resourceInfoData.resources.previous.subtitle; // = Bibliografie

                            expect(spanEl1.innerText).toBeTruthy();
                            expect(spanEl1.innerText).withContext(`should be ${subTitle}`).toBe(subTitle);
                        });
                    });

                    describe('if previous resource is not given', () => {
                        beforeEach(() => {
                            // Remove first two entries from searchResponse to get no previous resource
                            const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                            otherResponseClone.data.subjects = otherResponseClone.data.subjects.slice(-3);

                            (component as any)._updateResourceInfo(expectedResourceId, otherResponseClone);

                            // Apply changes
                            fixture.detectChanges();
                        });

                        it('... should have current.displayIndex === 1', () => {
                            expect(component.resourceInfoData.resources.current.displayIndex).toBeTruthy();
                            expect(component.resourceInfoData.resources.current.displayIndex).toBe(1, 'should be 1');
                        });

                        it('... should have list-group-item-danger class', () => {
                            const aDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-start',
                                1,
                                1
                            );
                            const aEl0 = aDes[0].nativeElement;

                            expect(aEl0).toHaveClass('list-group-item-danger');
                        });

                        it('... should contain two divs', () => {
                            getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-start > div',
                                2,
                                2
                            );
                        });

                        it('... should have strong element with text-muted and small class in first div', () => {
                            const divDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-start > div',
                                2,
                                2
                            );
                            // Get first div
                            const strongDes = getAndExpectDebugElementByCss(divDes[0], 'strong', 1, 1);
                            const strongEl = strongDes[0].nativeElement;

                            expect(strongEl).toHaveClass('text-muted');
                            expect(strongEl).toHaveClass('small');
                        });

                        it('... should have faTimesCircle icon in strong element', () => {
                            const strongDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-start > div > strong',
                                1,
                                1
                            );
                            const iconDes = getAndExpectDebugElementByCss(strongDes[0], 'fa-icon', 1, 1);

                            expect(iconDes[0].children[0]).toBeTruthy();
                            expect(iconDes[0].children[0].classes).toBeTruthy();
                            expect(iconDes[0].children[0].classes['fa-circle-xmark']).toBeTrue();
                        });

                        it('... should have two empty divs.single-line in second div', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-start > div',
                                2,
                                2
                            );
                            // Get second outer div
                            const divDes = getAndExpectDebugElementByCss(outerDivDes[1], 'div.single-line', 2, 2);
                            // Get second inner div
                            const divEl1 = divDes[1].nativeElement;

                            expect(divEl1).toHaveClass('text-muted');
                            expect(divEl1).toHaveClass('small');

                            // Get spans
                            const spanDes = getAndExpectDebugElementByCss(outerDivDes[1], 'div.single-line span', 2, 2);
                            const spanEl0 = spanDes[0].nativeElement;
                            const spanEl1 = spanDes[1].nativeElement;

                            const whiteSpace = '\xA0'; // Hex code for a non-breaking space '&nbsp;'

                            expect(spanEl0.innerText).toBeTruthy();
                            expect(spanEl0.innerText)
                                .withContext(`should be non-breaking whiteSpace ${whiteSpace}`)
                                .toBe(whiteSpace);

                            expect(spanEl1.innerText).toBeTruthy();
                            expect(spanEl1.innerText)
                                .withContext(`should be non-breaking whiteSpace ${whiteSpace}`)
                                .toBe(whiteSpace);
                        });
                    });
                });

                describe('current resource (li)', () => {
                    describe('if current resource is given', () => {
                        it('... should be displayed', () => {
                            getAndExpectDebugElementByCss(compDe, 'li.awg-list-group-item', 1, 1);
                        });

                        it('... should have list-group-item-info class', () => {
                            const liDes = getAndExpectDebugElementByCss(compDe, 'li.awg-list-group-item', 1, 1);
                            const liEl = liDes[0].nativeElement;

                            expect(liEl).toHaveClass('list-group-item-info');
                        });

                        it('... should contain a strong element and a form', () => {
                            const ulDes = getAndExpectDebugElementByCss(
                                compDe,
                                'ul.awg-resource-info-list-group',
                                1,
                                1
                            );

                            getAndExpectDebugElementByCss(ulDes[0], 'li.awg-list-group-item > strong', 1, 1);
                            getAndExpectDebugElementByCss(ulDes[0], 'li.awg-list-group-item > form', 1, 1);
                        });

                        it('... should have strong element with text-muted and small class', () => {
                            const strongDes = getAndExpectDebugElementByCss(
                                compDe,
                                'li.awg-list-group-item > strong',
                                1,
                                1
                            );
                            const strongEl = strongDes[0].nativeElement;

                            expect(strongEl).toHaveClass('text-muted');
                            expect(strongEl).toHaveClass('small');
                        });

                        it('... should point to current resource in span in strong element', () => {
                            const strongDes = getAndExpectDebugElementByCss(
                                compDe,
                                'li.awg-list-group-item > strong',
                                1,
                                1
                            );
                            const spanDes = getAndExpectDebugElementByCss(
                                strongDes[0],
                                'span.awg-resource-info-text',
                                1,
                                1
                            );

                            const spanEl = spanDes[0].nativeElement;
                            const expectedIndex = component.resourceInfoData.resources.current.displayIndex; // = 3
                            const expectedInnerText = `Angezeigtes Ergebnis (${expectedIndex}/${expectedResultSize})`;

                            expect(spanEl.innerText).toBeTruthy();
                            expect(spanEl.innerText)
                                .withContext(`should be ${expectedInnerText}`)
                                .toBe(expectedInnerText);
                        });

                        it('... should contain one div with button and an input in form > div.input-group', () => {
                            const formDes = getAndExpectDebugElementByCss(
                                compDe,
                                'li.awg-list-group-item > form',
                                1,
                                1
                            );
                            const divDes = getAndExpectDebugElementByCss(formDes[0], 'div.input-group', 1, 1);

                            getAndExpectDebugElementByCss(
                                divDes[0],
                                'div.input-group-prepend > button#awg-resource-info-input-group-text',
                                1,
                                1
                            );
                            getAndExpectDebugElementByCss(
                                divDes[0],
                                'input#awg-resource-info-input.form-control',
                                1,
                                1
                            );
                        });

                        it('... should have correct options set for input', () => {
                            const inputDes = getAndExpectDebugElementByCss(
                                compDe,
                                'input#awg-resource-info-input.form-control',
                                1,
                                1
                            );

                            // FormControlName='resourceInfoIndex'
                            expect(inputDes[0].attributes['formControlName']).toBeTruthy();
                            expect(inputDes[0].attributes['formControlName'])
                                .withContext('should be resourceInfoIndex')
                                .toBe('resourceInfoIndex');

                            // Type='number'
                            expect(inputDes[0].attributes['type']).toBeTruthy();
                            expect(inputDes[0].attributes['type']).withContext('should be number').toBe('number');

                            // Size=4
                            expect(inputDes[0].attributes['size']).toBeTruthy();
                            expect(inputDes[0].attributes['size']).withContext('should be 4').toBe('4');
                            // Step=1
                            expect(inputDes[0].attributes['step']).toBeTruthy();
                            expect(inputDes[0].attributes['step']).withContext('should be 1').toBe('1');
                        });

                        describe('button', () => {
                            it('... should have correct options set', () => {
                                const buttonDes = getAndExpectDebugElementByCss(
                                    compDe,
                                    'button#awg-resource-info-input-group-text',
                                    1,
                                    1
                                );
                                const buttonEl = buttonDes[0].nativeElement;

                                // Type='submit'
                                expect(buttonDes[0].attributes['type']).toBeTruthy();
                                expect(buttonDes[0].attributes['type']).withContext('should be submit').toBe('submit');

                                // Class=btn
                                expect(buttonEl).toHaveClass('btn');

                                // Disabled = true
                                expect(buttonEl.disabled).toBeTrue();
                            });

                            it('... should display innerHTML text', () => {
                                const buttonDes = getAndExpectDebugElementByCss(
                                    compDe,
                                    'button#awg-resource-info-input-group-text',
                                    1,
                                    1
                                );
                                const buttonEl = buttonDes[0].nativeElement;

                                const expectedText = 'Gehe zu';

                                expect(buttonEl.innerText).toBeTruthy();
                                expect(buttonEl.innerText).withContext(`should be ${expectedText}`).toBe(expectedText);
                            });

                            it('... should have btn-outline-success class when form is valid', () => {
                                const buttonDes = getAndExpectDebugElementByCss(
                                    compDe,
                                    'button#awg-resource-info-input-group-text',
                                    1,
                                    1
                                );
                                const buttonEl = buttonDes[0].nativeElement;

                                // Form is valid
                                expect(component.resourceInfoFormGroup.valid).toBeTruthy();
                                expect(component.resourceInfoFormGroup.invalid).toBeFalsy();

                                // Class is btn-outline-success
                                expect(buttonEl).toHaveClass('btn-outline-success');
                                expect(buttonEl).not.toHaveClass('btn-outline-danger');
                            });

                            it('... should have btn-outline-danger class when form is not valid', () => {
                                // Set input to empty string
                                const resourceInfoIndex = component.resourceInfoFormGroup.controls['resourceInfoIndex'];
                                resourceInfoIndex.setValue('');

                                // Apply changes
                                fixture.detectChanges();

                                const buttonDes = getAndExpectDebugElementByCss(
                                    compDe,
                                    'button#awg-resource-info-input-group-text',
                                    1,
                                    1
                                );
                                const buttonEl = buttonDes[0].nativeElement;

                                // Form is invalid
                                expect(component.resourceInfoFormGroup.valid).toBeFalsy();
                                expect(component.resourceInfoFormGroup.invalid).toBeTruthy();

                                // Class is btn-outline-danger
                                expect(buttonEl).not.toHaveClass('btn-outline-success');
                                expect(buttonEl).toHaveClass('btn-outline-danger');
                            });

                            it('... should be disabled when input index is current.displayIndex', () => {
                                const buttonDes = getAndExpectDebugElementByCss(
                                    compDe,
                                    'button#awg-resource-info-input-group-text',
                                    1,
                                    1
                                );
                                const buttonEl = buttonDes[0].nativeElement;
                                const resourceInfoIndex = component.resourceInfoFormGroup.controls['resourceInfoIndex'];

                                // Input index is current.displayIndex
                                expect(resourceInfoIndex.value)
                                    .withContext(
                                        `should be ${component.resourceInfoData.resources.current.displayIndex}`
                                    )
                                    .toBe(component.resourceInfoData.resources.current.displayIndex);
                                // Disabled = true
                                expect(buttonEl.disabled).toBeTrue();
                            });

                            it('... should be disabled when form is not valid', () => {
                                // Set input to empty string
                                const resourceInfoIndex = component.resourceInfoFormGroup.controls['resourceInfoIndex'];
                                resourceInfoIndex.setValue('');

                                // Apply changes
                                fixture.detectChanges();

                                const buttonDes = getAndExpectDebugElementByCss(
                                    compDe,
                                    'button#awg-resource-info-input-group-text',
                                    1,
                                    1
                                );
                                const buttonEl = buttonDes[0].nativeElement;

                                // Form is invalid
                                expect(component.resourceInfoFormGroup.valid).toBeFalsy();
                                expect(component.resourceInfoFormGroup.invalid).toBeTruthy();

                                // Disabled = true
                                expect(buttonEl.disabled).toBeTrue();
                            });

                            it('... should be enabled when input index is not current.displayIndex and form is valid', () => {
                                // Set input index different from current.displayIndex
                                const resourceInfoIndex = component.resourceInfoFormGroup.controls['resourceInfoIndex'];
                                resourceInfoIndex.setValue(1);

                                // Apply changes
                                fixture.detectChanges();

                                const buttonDes = getAndExpectDebugElementByCss(
                                    compDe,
                                    'button#awg-resource-info-input-group-text',
                                    1,
                                    1
                                );
                                const buttonEl = buttonDes[0].nativeElement;

                                // Form is valid
                                expect(component.resourceInfoFormGroup.valid).toBeTruthy();
                                expect(component.resourceInfoFormGroup.invalid).toBeFalsy();

                                // Input index is different from current.displayIndex
                                expect(resourceInfoIndex.value)
                                    .withContext(
                                        `should not be ${component.resourceInfoData.resources.current.displayIndex}`
                                    )
                                    .not.toBe(component.resourceInfoData.resources.current.displayIndex);

                                // Disabled = false
                                expect(buttonEl.disabled).toBeFalse();
                            });

                            it('... should not be able to navigate to resource by index when button is disabled', fakeAsync(() => {
                                const buttonDes = getAndExpectDebugElementByCss(
                                    compDe,
                                    'button#awg-resource-info-input-group-text',
                                    1,
                                    1
                                );
                                const buttonEl = buttonDes[0].nativeElement;
                                const resourceInfoIndex = component.resourceInfoFormGroup.controls['resourceInfoIndex'];

                                // ---------------------------
                                // DISABLED: case 1
                                // Input index is current.displayIndex
                                expect(resourceInfoIndex.value).toBe(
                                    component.resourceInfoData.resources.current.displayIndex
                                );

                                // Form is valid
                                expect(component.resourceInfoFormGroup.valid).toBeTruthy();
                                expect(component.resourceInfoFormGroup.invalid).toBeFalsy();

                                // Disabled = true
                                expect(buttonEl.disabled).toBeTrue();

                                // Trigger click on button with click helper & wait for changes
                                clickAndAwaitChanges(buttonDes[0], fixture);

                                expectSpyCall(navigateToResourceByIndexSpy, 0);

                                // ---------------------------
                                // DISABLED: case 2
                                // Input has invalid value
                                resourceInfoIndex.setValue('');

                                // Apply changes
                                fixture.detectChanges();

                                // Form is invalid
                                expect(component.resourceInfoFormGroup.valid).toBeFalsy();
                                expect(component.resourceInfoFormGroup.invalid).toBeTruthy();

                                // Disabled = true
                                expect(buttonEl.disabled).toBeTrue();

                                // Trigger click on button with click helper & wait for changes
                                clickAndAwaitChanges(buttonDes[0], fixture);

                                expectSpyCall(navigateToResourceByIndexSpy, 0);
                            }));

                            it('... should be able to navigate to resource by index on click when button is enabled', fakeAsync(() => {
                                const buttonDes = getAndExpectDebugElementByCss(
                                    compDe,
                                    'button#awg-resource-info-input-group-text',
                                    1,
                                    1
                                );
                                const buttonEl = buttonDes[0].nativeElement;

                                // Set input to another index then current.displayIndex (=3)
                                const chosenIndex = 1;
                                const resourceInfoIndex = component.resourceInfoFormGroup.controls['resourceInfoIndex'];
                                resourceInfoIndex.setValue(chosenIndex);

                                // Apply changes
                                fixture.detectChanges();

                                // Input index is different from current.displayIndex
                                expect(resourceInfoIndex.value).not.toBe(
                                    component.resourceInfoData.resources.current.displayIndex
                                );

                                // Form is valid
                                expect(component.resourceInfoFormGroup.valid).toBeTruthy();
                                expect(component.resourceInfoFormGroup.invalid).toBeFalsy();

                                // Button.disabled = false
                                expect(buttonEl.disabled).toBeFalse();

                                // Trigger click on button with click helper & wait for changes
                                clickAndAwaitChanges(buttonDes[0], fixture);

                                expectSpyCall(navigateToResourceByIndexSpy, 1, chosenIndex);
                            }));
                        });
                    });

                    describe('if current resource is not given', () => {
                        it('... should not be displayed', () => {
                            // Remove resource with resourceId from subjects (on array index position 2)
                            const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                            const sliceIndex = 2;
                            otherResponseClone.data.subjects = otherResponseClone.data.subjects
                                .slice(0, sliceIndex)
                                .concat(
                                    otherResponseClone.data.subjects.slice(
                                        sliceIndex + 1,
                                        otherResponseClone.data.subjects.length
                                    )
                                );

                            (component as any)._updateResourceInfo(expectedResourceId, otherResponseClone);

                            // Apply changes
                            fixture.detectChanges();

                            getAndExpectDebugElementByCss(compDe, 'li.awg-list-group-item', 0, 0);
                        });
                    });
                });

                describe('next resource (second anchor)', () => {
                    it('... should display text right (text-end)', () => {
                        const ulDes = getAndExpectDebugElementByCss(compDe, 'ul.awg-resource-info-list-group', 1, 1);
                        const aDes = getAndExpectDebugElementByCss(ulDes[0], 'a.awg-list-group-item', 2, 2);
                        const aEl1 = aDes[1].nativeElement;
                        expect(aEl1).toHaveClass('list-group-item-action');
                        expect(aEl1).toHaveClass('text-end');
                    });

                    describe('if next resource is given', () => {
                        it('... should have list-group-item-action class', () => {
                            const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-list-group-item.text-end', 1, 1);
                            const aEl0 = aDes[0].nativeElement;

                            expect(aEl0).toHaveClass('list-group-item-action');
                        });

                        it('... should navigate to next resource on click', fakeAsync(() => {
                            const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-list-group-item.text-end', 1, 1);

                            // Trigger click on anchor (next) with click helper & wait for changes
                            clickAndAwaitChanges(aDes[0], fixture);

                            // Called next resource (id: 1231)
                            expectSpyCall(navigateToResourceSpy, 1, '1233');
                        }));

                        it('... should contain two divs', () => {
                            const ulDes = getAndExpectDebugElementByCss(
                                compDe,
                                'ul.awg-resource-info-list-group',
                                1,
                                1
                            );

                            getAndExpectDebugElementByCss(ulDes[0], 'a.awg-list-group-item.text-end > div', 2, 2);
                        });

                        it('... should have strong element with text-muted and small class in first div', () => {
                            const divDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-end > div',
                                2,
                                2
                            );
                            const strongDes = getAndExpectDebugElementByCss(divDes[0], 'strong', 1, 1);
                            const strongEl = strongDes[0].nativeElement;

                            expect(strongEl).toHaveClass('text-muted');
                            expect(strongEl).toHaveClass('small');
                        });

                        it('... should have faChevronRight icon in strong element', () => {
                            const strongDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-end > div > strong',
                                1,
                                1
                            );
                            const iconDes = getAndExpectDebugElementByCss(strongDes[0], 'fa-icon', 1, 1);
                            expect(iconDes[0].children[0]).toBeTruthy();
                            expect(iconDes[0].children[0].classes).toBeTruthy();
                            expect(iconDes[0].children[0].classes['fa-chevron-right']).toBeTrue();
                        });

                        it('... should point to previous resource in span in strong element', () => {
                            const divDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-end > div > strong',
                                1,
                                1
                            );
                            const spanDes = getAndExpectDebugElementByCss(
                                divDes[0],
                                'span.awg-resource-info-btn-text',
                                1,
                                1
                            );

                            const spanEl = spanDes[0].nativeElement;
                            const expectedIndex = component.resourceInfoData.resources.next.displayIndex; // = 4
                            const expectedInnerText = `Nächstes Ergebnis (${expectedIndex}/${expectedResultSize})`;

                            expect(spanEl.innerText).toBeTruthy();
                            expect(spanEl.innerText)
                                .withContext(`should be ${expectedInnerText}`)
                                .toBe(expectedInnerText);
                        });

                        it('... should have two divs.single-line in second div', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-end > div',
                                2,
                                2
                            );
                            const divDes = getAndExpectDebugElementByCss(outerDivDes[1], 'div.single-line', 2, 2);
                            // // get second div
                            const divEl1 = divDes[1].nativeElement;

                            expect(divEl1).toHaveClass('text-muted');
                            expect(divEl1).toHaveClass('small');
                        });

                        it('... should display next title in first div.single-line', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-end > div',
                                2,
                                2
                            );
                            // Get spans of second outerDiv
                            const spanDes = getAndExpectDebugElementByCss(
                                outerDivDes[1],
                                'div.single-line > span',
                                2,
                                2
                            );
                            const spanEl0 = spanDes[0].nativeElement;
                            const title = component.resourceInfoData.resources.next.title; // = BrownJ 2014

                            expect(spanEl0.innerText).toBeTruthy();
                            expect(spanEl0.innerText).withContext(`should be ${title}`).toBe(title);
                        });

                        it('... should display next subtitle in second div.single-line', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-end > div',
                                2,
                                2
                            );
                            // Get spans of second outerDiv
                            const spanDes = getAndExpectDebugElementByCss(
                                outerDivDes[1],
                                'div.single-line > span',
                                2,
                                2
                            );
                            const spanEl1 = spanDes[1].nativeElement;
                            const subTitle = component.resourceInfoData.resources.next.subtitle; // = Bibliografie

                            expect(spanEl1.innerText).toBeTruthy();
                            expect(spanEl1.innerText).withContext(`should be ${subTitle}`).toBe(subTitle);
                        });
                    });

                    describe('if next resource is not given', () => {
                        beforeEach(() => {
                            // Remove last two entries from searchResponse to get no next resource
                            const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                            otherResponseClone.data.subjects = otherResponseClone.data.subjects.slice(0, 3);

                            (component as any)._updateResourceInfo(expectedResourceId, otherResponseClone);

                            // Apply changes
                            fixture.detectChanges();
                        });

                        it('... should have current.displayIndex === resultSize', () => {
                            expect(component.resourceInfoData.resources.current.displayIndex).toBeTruthy();
                            expect(component.resourceInfoData.resources.current.displayIndex)
                                .withContext(`should be ${component.resultSize}`)
                                .toBe(component.resultSize);
                        });

                        it('... should have list-group-item-danger class', () => {
                            const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-list-group-item.text-end', 1, 1);
                            const aEl0 = aDes[0].nativeElement;

                            expect(aEl0).toHaveClass('list-group-item-danger');
                        });

                        it('... should contain two divs', () => {
                            getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-end > div',
                                2,
                                2
                            );
                        });

                        it('... should have strong element with text-muted and small class in first div', () => {
                            const divDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-end > div',
                                2,
                                2
                            );
                            // Get first div
                            const strongDes = getAndExpectDebugElementByCss(divDes[0], 'strong', 1, 1);
                            const strongEl = strongDes[0].nativeElement;

                            expect(strongEl).toHaveClass('text-muted');
                            expect(strongEl).toHaveClass('small');
                        });

                        it('... should have faTimesCircle icon in strong element', () => {
                            const strongDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-end > div > strong',
                                1,
                                1
                            );
                            const iconDes = getAndExpectDebugElementByCss(strongDes[0], 'fa-icon', 1, 1);
                            expect(iconDes[0].children[0]).toBeTruthy();
                            expect(iconDes[0].children[0].classes).toBeTruthy();
                            expect(iconDes[0].children[0].classes['fa-circle-xmark']).toBeTrue();
                        });

                        it('... should have two empty divs.single-line in second div', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-end > div',
                                2,
                                2
                            );
                            // Get second outer div
                            const divDes = getAndExpectDebugElementByCss(outerDivDes[1], 'div.single-line', 2, 2);
                            // Get second inner div
                            const divEl1 = divDes[1].nativeElement;

                            expect(divEl1).toHaveClass('text-muted');
                            expect(divEl1).toHaveClass('small');

                            // Get spans
                            const spanDes = getAndExpectDebugElementByCss(outerDivDes[1], 'div.single-line span', 2, 2);
                            const spanEl0 = spanDes[0].nativeElement;
                            const spanEl1 = spanDes[1].nativeElement;

                            const whiteSpace = '\xA0'; // Hex code for a non-breaking space '&nbsp;'

                            expect(spanEl0.innerText).withContext(`should be truthy`).toBeTruthy();
                            expect(spanEl0.innerText)
                                .withContext(`should be non-breaking whiteSpace ${whiteSpace}`)
                                .toBe(whiteSpace);

                            expect(spanEl1.innerText).withContext(`should be truthy`).toBeTruthy();
                            expect(spanEl1.innerText)
                                .withContext(`should be non-breaking whiteSpace ${whiteSpace}`)
                                .toBe(whiteSpace);
                        });
                    });
                });
            });

            describe('div.card-footer', () => {
                it('... should have one link in `div.card-footer`', () => {
                    const expectedHref = 'https://arachne.dainst.org/';
                    const expectedInnerText = 'iDAI.object arachne';

                    const aDe = getAndExpectDebugElementByCss(compDe, 'div.card-footer a', 1, 1);
                    const aEl = aDe[0].nativeElement;

                    expect(aEl.href).withContext(`should be ${expectedHref}`).toBe(expectedHref);
                    expect(aEl.innerText).withContext(`should be ${expectedInnerText}`).toBe(expectedInnerText);
                });
            });
        });
    });
});
