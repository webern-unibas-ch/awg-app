import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faArrowLeft, faChevronLeft, faChevronRight, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';
import { customJasmineMatchers } from '@testing/custom-matchers';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockSearchResponseJson } from '@testing/mock-data';
import { mockConsole } from '@testing/mock-helper';

import { DataStreamerService } from '@awg-core/services';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ResourceInfo, ResourceInfoResource } from '@awg-side-info/side-info-models';
import { SearchResponseWithQuery } from '@awg-views/data-view/models';

import { ResourceInfoComponent } from './resource-info.component';

@Component({ selector: 'awg-test', template: '' })
class SearchPanelStubComponent {}

describe('ResourceInfoComponent (DONE)', () => {
    let component: ResourceInfoComponent;
    let fixture: ComponentFixture<ResourceInfoComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let mockRouter: Partial<Router>;
    let mockDataStreamerService: Partial<DataStreamerService>;
    let dataStreamerService: Partial<DataStreamerService>;
    let formBuilder: FormBuilder;

    let buildFormSpy: Spy;
    let findIndexPositionInSearchResultsByIdSpy: Spy;
    let navigateToResourceSpy: Spy;
    let navigateToResourceByIndexSpy: Spy;
    let navigateToSearchPanelSpy: Spy;
    let subscribeResourceInfoDataSpy: Spy;
    let updateResourceInfoSpy: Spy;

    let dataStreamerResourceIdSpy: Spy;
    let dataStreamerSearchResponseWithQuerySpy: Spy;
    let consoleSpy: Spy;

    const expectedResourceId = '1232';
    const expectedQuery = 'Test';
    let expectedSearchResponseWithQuery: SearchResponseWithQuery;
    let expectedGoToIndex: number;
    let expectedResultSize: number;

    beforeEach(async () => {
        // Router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        // Mocked dataStreamerService
        mockDataStreamerService = {
            getResourceId: (): Observable<string> => observableOf('test'),
            getSearchResponseWithQuery: (): Observable<SearchResponseWithQuery> => observableOf()
        };

        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, ReactiveFormsModule],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: DataStreamerService, useValue: mockDataStreamerService },
                FormBuilder
            ],
            declarations: [ResourceInfoComponent, CompileHtmlComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        // Add custom jasmine matchers (ToHaveCssClass)
        jasmine.addMatchers(customJasmineMatchers);

        fixture = TestBed.createComponent(ResourceInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Inject service from root
        dataStreamerService = TestBed.inject(DataStreamerService);
        formBuilder = TestBed.inject(FormBuilder);

        const expectedSearchResponse = JSON.parse(JSON.stringify(mockSearchResponseJson));
        expectedSearchResponseWithQuery = new SearchResponseWithQuery(expectedSearchResponse, expectedQuery);
        expectedResultSize = 5;
        expectedGoToIndex = 3;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        buildFormSpy = spyOn(component as any, 'buildForm').and.callThrough();
        findIndexPositionInSearchResultsByIdSpy = spyOn(
            component as any,
            'findIndexPositionInSearchResultsById'
        ).and.callThrough();
        updateResourceInfoSpy = spyOn(component as any, 'updateResourceInfo').and.callThrough();
        subscribeResourceInfoDataSpy = spyOn(component, 'getResourceInfoData').and.callThrough();
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
        consoleSpy = spyOn(console, 'log').and.callFake(mockConsole.log);
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
        it('... should not have resourceInfoDataSubscription', () => {
            expectSpyCall(subscribeResourceInfoDataSpy, 0);
            expect((component as any).resourceInfoDataSubscription).toBeUndefined('should be undefined');
        });

        it('... should not have goToIndex', () => {
            expect(component.goToIndex).toBeUndefined('should be undefined');
        });

        it('... should not have resourceId', () => {
            expect(component.resourceId).toBeUndefined('should be undefined');
        });

        it('... should not have resourceInfoFormGroup', () => {
            expect(component.resourceInfoFormGroup).toBeUndefined('should be undefined');
        });

        it('... should not have resultSize', () => {
            expect(component.resultSize).toBeUndefined('should be undefined');
        });

        it('... should have empty resourceInfoData', () => {
            expect(component.resourceInfoData).toBeDefined('should be defined');
            expect(component.resourceInfoData).toEqual(new ResourceInfo(), 'should equal new ResourceInfo');
        });

        it('... should have fa-icons', () => {
            expect(component.faArrowLeft).toBe(faArrowLeft, 'should be faArrowLeft');
            expect(component.faChevronLeft).toBe(faChevronLeft, 'should be faChevronLeft');
            expect(component.faChevronRight).toBe(faChevronRight, 'should be faChevronRight');
            expect(component.faTimesCircle).toBe(faTimesCircle, 'should be faTimesCircle');
        });

        describe('VIEW', () => {
            it('... should not have a `div.card`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 0, 0);
            });
        });

        describe('#getResourceInfoData', () => {
            it('... should not have been called', () => {
                expectSpyCall(subscribeResourceInfoDataSpy, 0);
            });
        });

        describe('#updateResourceInfo', () => {
            it('... should not have been called', () => {
                expectSpyCall(updateResourceInfoSpy, 0);
            });
        });

        describe('#buildForm', () => {
            it('... should not have been called', () => {
                expectSpyCall(buildFormSpy, 0);
            });
        });

        describe('#findIndexPositionInSearchResultsById', () => {
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
            it('... should have been called and created subscription', () => {
                expectSpyCall(subscribeResourceInfoDataSpy, 1);
                expect((component as any).resourceInfoDataSubscription).toBeDefined();
            });

            it('... should have got `resourceId` from dataStreamerService', () => {
                expectSpyCall(dataStreamerResourceIdSpy, 1);

                expect(component.resourceId).toBeTruthy('should be truthy');
                expect(component.resourceId).toBe(expectedResourceId, `should be ${expectedResourceId}`);
            });

            it('... should have got searchResponseWithQuery from dataStreamerService', () => {
                expectSpyCall(dataStreamerSearchResponseWithQuerySpy, 1);
            });

            it('... should have called updateResourceInfo with `resourceId` and searchResponse', () => {
                const expectedResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));

                expectSpyCall(updateResourceInfoSpy, 1, [expectedResourceId, expectedResponseClone]);
            });
            it('... should have set `goToIndex` and `resultSize` (via updateResourceInfo)', () => {
                expect(component.resultSize).toBeTruthy('should be truthy');
                expect(component.resultSize).toBe(expectedResultSize, `should be ${expectedResultSize}`);

                expect(component.goToIndex).toBeTruthy('should be truthy');
                expect(component.goToIndex).toBe(expectedGoToIndex, `should be ${expectedGoToIndex}`);
            });

            it('... should have called buildForm with `goToIndex` and `resultSize`', () => {
                expectSpyCall(buildFormSpy, 1, [expectedGoToIndex, expectedResultSize]);
            });

            it('... should not log to console if subscription succeeds', () => {
                // Check initial subscription
                expectSpyCall(subscribeResourceInfoDataSpy, 1);
                expectSpyCall(dataStreamerResourceIdSpy, 1);
                expectSpyCall(dataStreamerSearchResponseWithQuerySpy, 1);

                // Should not have logged to console
                expectSpyCall(consoleSpy, 0);
                expect(mockConsole.get(0)).toBeUndefined('should be undefined');
            });

            it('... should throw an error if subscription fails and log to console', () => {
                // Check initial subscription
                expectSpyCall(subscribeResourceInfoDataSpy, 1);
                expectSpyCall(dataStreamerResourceIdSpy, 1);
                expectSpyCall(dataStreamerSearchResponseWithQuerySpy, 1);

                // Should not have logged to console
                expectSpyCall(consoleSpy, 0);
                expect(mockConsole.get(0)).toBeUndefined('should be undefined');

                // Spy on dataStreamerService to return an error
                dataStreamerSearchResponseWithQuerySpy.and.returnValue(observableThrowError({ status: 404 }));

                const expectedLogMessage = 'RESOURCE-INFO: Got no sideInfoData from Subscription!';

                // Init new subscription with error
                component.getResourceInfoData();

                // Apply changes
                fixture.detectChanges();

                // Check new subscription
                expectSpyCall(subscribeResourceInfoDataSpy, 2);
                expectSpyCall(dataStreamerResourceIdSpy, 2);
                expectSpyCall(dataStreamerSearchResponseWithQuerySpy, 2);

                // Check console
                expectSpyCall(consoleSpy, 1, expectedLogMessage);
                expect(mockConsole.get(0)).toEqual(expectedLogMessage, `should be ${expectedLogMessage}`);
            });
        });

        describe('#updateResourceInfo', () => {
            it('... should have called `findIndexPositionInSearchResultsById` with `resourceId` and searchResponse', () => {
                const expectedResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));

                expectSpyCall(findIndexPositionInSearchResultsByIdSpy, 1, [expectedResourceId, expectedResponseClone]);
            });

            it('... should set `goToIndex` and `resultSize`', () => {
                expect(component.resultSize).toBeTruthy('should be truthy');
                expect(component.resultSize).toBe(expectedResultSize, `should be ${expectedResultSize}`);

                expect(component.goToIndex).toBeTruthy('should be truthy');
                expect(component.goToIndex).toBe(expectedGoToIndex, `should be ${expectedGoToIndex}`);
            });

            it('... should change `goToIndex` and `resultSize` depending on input', () => {
                const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                // Pick last 3 entries
                otherResponseClone.data.subjects = otherResponseClone.data.subjects.slice(-3);
                expectedResultSize = 3;
                expectedGoToIndex = 1;

                (component as any).updateResourceInfo(expectedResourceId, otherResponseClone);

                expect(component.resultSize).toBeTruthy('should be truthy');
                expect(component.resultSize).toBe(expectedResultSize, `should be ${expectedResultSize}`);

                expect(component.goToIndex).toBeTruthy('should be truthy');
                expect(component.goToIndex).toBe(expectedGoToIndex, `should be ${expectedGoToIndex}`);
            });

            it('... should set `resourceInfoData` (previous, current, next resource given)', () => {
                const expectedResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                const subjects = expectedResponseClone.data.subjects;
                const i = expectedGoToIndex - 1;
                const expectedCurrent = subjects[i];
                const expectedPrevious = subjects[i - 1];
                const expectedNext = subjects[i + 1];

                let expectedResourceInfoData: ResourceInfo = new ResourceInfo();
                expectedResourceInfoData = {
                    searchResults: expectedResponseClone,
                    resources: {
                        current: new ResourceInfoResource(expectedCurrent, i),
                        next: new ResourceInfoResource(expectedNext, i + 1),
                        previous: new ResourceInfoResource(expectedPrevious, i - 1)
                    }
                };

                expect(component.resourceInfoData).toBeTruthy('should be truthy');
                expect(component.resourceInfoData).toEqual(
                    expectedResourceInfoData,
                    `should be ${expectedResourceInfoData}`
                );
            });

            it('... should set `resourceInfoData` (only current, next resource given)', () => {
                const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                otherResponseClone.data.subjects = otherResponseClone.data.subjects.slice(-3);
                expectedGoToIndex = 1;
                expectedResultSize = 3;
                const subjects = otherResponseClone.data.subjects;
                const i = expectedGoToIndex - 1;
                const expectedCurrent = subjects[i];
                const expectedNext = subjects[i + 1];

                let expectedResourceInfoData: ResourceInfo = new ResourceInfo();
                expectedResourceInfoData = {
                    searchResults: otherResponseClone,
                    resources: {
                        current: new ResourceInfoResource(expectedCurrent, i),
                        next: new ResourceInfoResource(expectedNext, i + 1),
                        previous: undefined
                    }
                };

                (component as any).updateResourceInfo(expectedResourceId, otherResponseClone);

                expect(component.goToIndex).toBe(1, 'should be 1');
                expect(component.resultSize).toBe(3, 'should be 3');

                expect(component.resourceInfoData).toBeTruthy('should be truthy');
                expect(component.resourceInfoData).toEqual(
                    expectedResourceInfoData,
                    `should be ${expectedResourceInfoData}`
                );
            });

            it('... should set `resourceInfoData` (only current, previous resource given)', () => {
                const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                otherResponseClone.data.subjects = otherResponseClone.data.subjects.slice(0, 3);
                expectedGoToIndex = 3;
                expectedResultSize = 3;
                const subjects = otherResponseClone.data.subjects;
                const i = expectedGoToIndex - 1;
                const expectedCurrent = subjects[i];
                const expectedPrevious = subjects[i - 1];

                let expectedResourceInfoData: ResourceInfo = new ResourceInfo();
                expectedResourceInfoData = {
                    searchResults: otherResponseClone,
                    resources: {
                        current: new ResourceInfoResource(expectedCurrent, i),
                        next: undefined,
                        previous: new ResourceInfoResource(expectedPrevious, i - 1)
                    }
                };

                (component as any).updateResourceInfo(expectedResourceId, otherResponseClone);

                expect(component.goToIndex).toBe(expectedGoToIndex, `should be ${expectedGoToIndex}`);
                expect(component.resultSize).toBe(expectedResultSize, `should be ${expectedResultSize}`);

                expect(component.resourceInfoData).toBeTruthy('should be truthy');
                expect(component.resourceInfoData).toEqual(
                    expectedResourceInfoData,
                    `should be ${expectedResourceInfoData}`
                );
            });

            it('... should set `resourceInfoData` (only current resource given)', () => {
                const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                otherResponseClone.data.subjects = otherResponseClone.data.subjects.slice(2, 3);
                expectedGoToIndex = 1;
                expectedResultSize = 1;
                const subjects = otherResponseClone.data.subjects;
                const i = expectedGoToIndex - 1;
                const expectedCurrent = subjects[i];

                let expectedResourceInfoData: ResourceInfo = new ResourceInfo();
                expectedResourceInfoData = {
                    searchResults: otherResponseClone,
                    resources: {
                        current: new ResourceInfoResource(expectedCurrent, i),
                        next: undefined,
                        previous: undefined
                    }
                };

                (component as any).updateResourceInfo(expectedResourceId, otherResponseClone);

                expect(component.goToIndex).toBe(expectedGoToIndex, `should be ${expectedGoToIndex}`);
                expect(component.resultSize).toBe(expectedResultSize, `should be ${expectedResultSize}`);

                expect(component.resourceInfoData).toBeTruthy('should be truthy');
                expect(component.resourceInfoData).toEqual(
                    expectedResourceInfoData,
                    `should be ${expectedResourceInfoData}`
                );
            });

            it('... should set `resourceInfoData` (no previous, current resource given)', () => {
                const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                const sliceIndex = 2;
                // Remove resource with resourceId from subjects (on array index position 2)
                otherResponseClone.data.subjects = otherResponseClone.data.subjects
                    .slice(0, sliceIndex)
                    .concat(
                        otherResponseClone.data.subjects.slice(sliceIndex + 1, otherResponseClone.data.subjects.length)
                    );

                expectedGoToIndex = 0;
                expectedResultSize = 4;
                const subjects = otherResponseClone.data.subjects;
                const i = expectedGoToIndex - 1;
                const expectedNext = subjects[i + 1];

                let expectedResourceInfoData: ResourceInfo = new ResourceInfo();
                expectedResourceInfoData = {
                    searchResults: otherResponseClone,
                    resources: {
                        current: undefined,
                        next: new ResourceInfoResource(expectedNext, i + 1),
                        previous: undefined
                    }
                };

                (component as any).updateResourceInfo(expectedResourceId, otherResponseClone);

                expect(component.goToIndex).toBe(expectedGoToIndex, `should be ${expectedGoToIndex}`);
                expect(component.resultSize).toBe(expectedResultSize, `should be ${expectedResultSize}`);

                expect(component.resourceInfoData).toBeTruthy('should be truthy');
                expect(component.resourceInfoData).toEqual(
                    expectedResourceInfoData,
                    `should be ${expectedResourceInfoData}`
                );
            });
        });

        describe('#buildForm', () => {
            it('... should have been called with `goToIndex` and `resultSize`', () => {
                expectedGoToIndex = 3;
                expectedResultSize = 5;
                expectSpyCall(buildFormSpy, 1, [expectedGoToIndex, expectedResultSize]);
            });

            it('... should have been called with updated values when changed', () => {
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

            it('... should have initiated resourceInfoFormGroup', () => {
                expect(component.resourceInfoFormGroup).toBeTruthy();
            });

            it('... should have initiated resourceInfoFormGroup as untouched, pristine and valid', () => {
                expect(component.resourceInfoFormGroup).toBeTruthy();
                expect(component.resourceInfoFormGroup.untouched).toBeTruthy();
                expect(component.resourceInfoFormGroup.pristine).toBeTruthy();
                expect(component.resourceInfoFormGroup.valid).toBeTruthy();
            });

            it('... should have initiated resourceInfoFormGroup with correct resourceInfoIndex', () => {
                expect(component.resourceInfoFormGroup).toBeTruthy();
                expect(component.resourceInfoFormGroup.controls['resourceInfoIndex']).toBeTruthy();

                expectedGoToIndex = 3;

                expect(component.resourceInfoFormGroup.controls['resourceInfoIndex'].value).toEqual(expectedGoToIndex);
            });

            it('... should have initiated resourceInfoFormGroup with empty index if none is given', () => {
                (component as any).buildForm(undefined, expectedResultSize);

                // Apply changes
                fixture.detectChanges();

                expect(component.resourceInfoFormGroup).toBeTruthy();
                expect(component.resourceInfoFormGroup.controls['resourceInfoIndex']).toBeTruthy();

                const expectedEmptyIndex = '';

                expect(component.resourceInfoFormGroup.controls['resourceInfoIndex'].value).toEqual(expectedEmptyIndex);
            });

            describe('Validators', () => {
                it('... should complain if control has a non-empty value (Validators.required)', () => {
                    let errors = {};
                    const resourceInfoIndex = component.resourceInfoFormGroup.controls['resourceInfoIndex'];

                    // Empty string
                    resourceInfoIndex.setValue('');
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['required']).toBeTruthy();

                    // Empty array
                    resourceInfoIndex.setValue([]);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['required']).toBeTruthy();

                    // Null
                    resourceInfoIndex.setValue(null);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['required']).toBeTruthy();

                    // Undefined
                    resourceInfoIndex.setValue(undefined);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['required']).toBeTruthy();
                });

                it("... should complain if index is not a number (Validators.pattern('^[1-9]+[0-9]*$'))", () => {
                    let errors = {};
                    const resourceInfoIndex = component.resourceInfoFormGroup.controls['resourceInfoIndex'];
                    const expectedPattern = '/^[1-9]+\\d*$/';

                    // NaN
                    resourceInfoIndex.setValue(NaN);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['pattern']).toBeTruthy();
                    expect(errors['pattern']).toEqual(
                        { requiredPattern: expectedPattern, actualValue: NaN },
                        `should be { requiredPattern: ${expectedPattern}, actualValue: NaN }`
                    );

                    // String
                    resourceInfoIndex.setValue('should error');
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['pattern']).toBeTruthy();
                    expect(errors['pattern']).toEqual(
                        { requiredPattern: expectedPattern, actualValue: 'should error' },
                        `should be { requiredPattern:  ${expectedPattern}, actualValue: \'should error\'}`
                    );

                    // Array
                    resourceInfoIndex.setValue([1, 2, 3]);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['pattern']).toBeTruthy();
                    expect(errors['pattern']).toEqual(
                        { requiredPattern: expectedPattern, actualValue: [1, 2, 3] },
                        `should be { requiredPattern: ${expectedPattern}, actualValue: [1, 2, 3]}`
                    );

                    // Empty object
                    resourceInfoIndex.setValue({});
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['pattern']).toBeTruthy();
                    expect(errors['pattern']).toEqual(
                        { requiredPattern: expectedPattern, actualValue: {} },
                        `should be { requiredPattern: ${expectedPattern}, actualValue: {} }`
                    );

                    // Object
                    resourceInfoIndex.setValue({ 1: 'should', 2: 'error' });
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['pattern']).toBeTruthy();
                    expect(errors['pattern']).toEqual(
                        { requiredPattern: expectedPattern, actualValue: { 1: 'should', 2: 'error' } },
                        `should be { requiredPattern: ${expectedPattern}, actualValue: { 1: 'should', 2: 'error' }}`
                    );
                });

                it("... should only allow integers greater than 0 (Validators.pattern('[1-9]+[0-9]*'))", () => {
                    let errors = {};
                    const resourceInfoIndex = component.resourceInfoFormGroup.controls['resourceInfoIndex'];
                    const expectedPattern = '/^[1-9]+\\d*$/';

                    // -1234567890
                    resourceInfoIndex.setValue(-1234567890);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['pattern']).toBeTruthy();
                    expect(errors['pattern']).toEqual(
                        { requiredPattern: expectedPattern, actualValue: -1234567890 },
                        `should be { requiredPattern: ${expectedPattern}, actualValue: -1234567890 }`
                    );

                    // -1
                    resourceInfoIndex.setValue(-1);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['pattern']).toBeTruthy();
                    expect(errors['pattern']).toEqual(
                        { requiredPattern: expectedPattern, actualValue: -1 },
                        `should be { requiredPattern: ${expectedPattern}, actualValue: -1 }`
                    );

                    // 0
                    resourceInfoIndex.setValue(0);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['pattern']).toBeTruthy();
                    expect(errors['pattern']).toEqual(
                        { requiredPattern: expectedPattern, actualValue: 0 },
                        `should be { requiredPattern: ${expectedPattern}, actualValue: 0 }`
                    );

                    // 1.1
                    resourceInfoIndex.setValue(1.1);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['pattern']).toBeTruthy();
                    expect(errors['pattern']).toEqual(
                        { requiredPattern: expectedPattern, actualValue: 1.1 },
                        `should be { requiredPattern: ${expectedPattern}, actualValue: 1.1 }`
                    );

                    // 1234567890.0123456789
                    resourceInfoIndex.setValue(1234567890.0123456789);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['pattern']).toBeTruthy();
                    expect(errors['pattern']).toEqual(
                        { requiredPattern: expectedPattern, actualValue: 1234567890.0123456789 },
                        `should be { requiredPattern: ${expectedPattern}, actualValue: 1234567890.0123456789 }`
                    );

                    // 1.0 (Validator pattern allows decimal with .0; Input will not allow it)
                    resourceInfoIndex.setValue(1.0);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['pattern']).toBeFalsy();

                    // 1
                    resourceInfoIndex.setValue(1);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['pattern']).toBeFalsy();

                    // 1234567890.0 (Validator pattern allows decimal with .0; Input will not allow it)
                    resourceInfoIndex.setValue(1234567890.0);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['pattern']).toBeFalsy();

                    // 1234567890
                    resourceInfoIndex.setValue(1234567890);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['pattern']).toBeFalsy();
                });

                it('... should only allow an index minimum greater than or equal to 1 (Validators.min(1))', () => {
                    let errors = {};
                    const resourceInfoIndex = component.resourceInfoFormGroup.controls['resourceInfoIndex'];

                    // Value less than 0
                    resourceInfoIndex.setValue(-1);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['min']).toBeTruthy();
                    expect(errors['min']).toEqual({ min: 1, actual: -1 }, 'should be { min: 1, actual: -1 }');

                    // Value 0
                    resourceInfoIndex.setValue(0);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['min']).toBeTruthy();
                    expect(errors['min']).toEqual({ min: 1, actual: 0 }, 'should be { min: 1, actual: 0}');

                    // Value 1
                    resourceInfoIndex.setValue(1);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['min']).toBeFalsy();

                    // Value greater than 1
                    resourceInfoIndex.setValue(3);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['min']).toBeFalsy();
                });

                it('... should only allow an index maximum equal to `resultSize` (Validators.max(resultSize))', () => {
                    let errors = {};
                    const resourceInfoIndex = component.resourceInfoFormGroup.controls['resourceInfoIndex'];

                    // Value greater than resultSize
                    resourceInfoIndex.setValue(expectedResultSize + 1);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['max']).toBeTruthy();
                    expect(errors['max']).toEqual({ max: 5, actual: 6 }, 'should be { max: 5, actual: 6 }');

                    // Value equals resultSize
                    resourceInfoIndex.setValue(expectedResultSize);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['max']).toBeFalsy();

                    // Value less than resultSize
                    resourceInfoIndex.setValue(expectedResultSize - 1);
                    errors = resourceInfoIndex.errors || {};

                    expect(errors['max']).toBeFalsy();
                });
            });
        });

        describe('#findIndexPositionInSearchResultsById', () => {
            it('... should return index position of a given `resourceId` in given search response', () => {
                const expectedResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));

                expect(
                    (component as any).findIndexPositionInSearchResultsById(expectedResourceId, expectedResponseClone)
                ).toBe(2, 'should be 2');
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
                    (component as any).findIndexPositionInSearchResultsById(expectedResourceId, otherResponseClone)
                ).toBe(-1, 'should be -1');
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

            it('... should do nothing if no index is provided', () => {
                component.navigateToResourceByIndex(undefined);

                expectSpyCall(navigationSpy, 0);
            });

            it('... should do nothing if index is less than 1', () => {
                component.navigateToResourceByIndex(0);

                expectSpyCall(navigationSpy, 0);
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
                const buttonEl = buttonDes[0].nativeElement;

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
                component.resourceInfoData.searchResults = new SearchResponseWithQuery(mockSearchResponseJson, '');
            });

            it('... should trigger `router.navigate` with query params if searchResults are given', () => {
                const expectedRoute = ['/data/search/fulltext'];
                const expectedParams = { queryParams: { query: component.resourceInfoData.searchResults.query } };

                component.navigateToSearchPanel();

                expect(component.resourceInfoData.searchResults).toBeTruthy();
                expectSpyCall(navigationSpy, 1, [expectedRoute, expectedParams]);
            });

            it('... should trigger `router.navigate` without query params if no searchResults are given', () => {
                const expectedRoute = ['/data/search/fulltext'];
                const expectedParams = { queryParams: { query: '' } };

                component.resourceInfoData.searchResults = undefined;

                component.navigateToSearchPanel();

                expect(component.resourceInfoData.searchResults).toBeUndefined();
                expectSpyCall(navigationSpy, 1, [expectedRoute, expectedParams]);
            });

            it('... should trigger on click (no query)', fakeAsync(() => {
                const buttonDe = getAndExpectDebugElementByCss(compDe, 'div.card-header div button', 1, 1);

                component.resourceInfoData.searchResults.query = '';

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(buttonDe[0], fixture);

                expectSpyCall(navigateToSearchPanelSpy, 1, undefined);
            }));

            it('... should trigger on click (with query)', fakeAsync(() => {
                const buttonDe = getAndExpectDebugElementByCss(compDe, 'div.card-header div button', 1, 1);

                component.resourceInfoData.searchResults.query = 'Test';

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(buttonDe[0], fixture);

                expectSpyCall(navigateToSearchPanelSpy, 1);
            }));
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

                    expect(spanEl.innerText).toBeTruthy();
                    expect(spanEl.innerText).toBe('Zur Suche', 'should be `Zur Suche`');
                });

                it('... should display bold, small, muted text in second div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.card-header div', 2, 2);
                    const strongDes = getAndExpectDebugElementByCss(divDes[1], 'strong', 1, 1);
                    const strongEl = strongDes[0].nativeElement;

                    expect(strongEl).toHaveCssClass('text-muted');
                    expect(strongEl).toHaveCssClass('small');
                    expect(strongEl.innerText).toBe('Aktueller Suchbegriff');
                });

                it('... should display query in span in second div', () => {
                    component.resourceInfoData.searchResults.query = 'Test';

                    fixture.detectChanges();

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.card-header div', 2, 2);
                    const spanDes = getAndExpectDebugElementByCss(divDes[1], 'span', 1, 1);
                    const spanEl = spanDes[0].nativeElement;

                    expect(spanEl.innerText).toBe(expectedQuery, `should be ${expectedQuery}`);
                });

                it('... should display `---`  without query in span in second div', () => {
                    component.resourceInfoData.searchResults.query = '';

                    fixture.detectChanges();

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.card-header div', 2, 2);
                    const spanDes = getAndExpectDebugElementByCss(divDes[1], 'span', 1, 1);
                    const spanEl = spanDes[0].nativeElement;

                    expect(spanEl.innerText).toBe('---', 'should be ---');
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
                    it('... should display text left', () => {
                        const ulDes = getAndExpectDebugElementByCss(compDe, 'ul.awg-resource-info-list-group', 1, 1);
                        const aDes = getAndExpectDebugElementByCss(ulDes[0], 'a.awg-list-group-item', 2, 2);
                        const aEl0 = aDes[0].nativeElement;

                        expect(aEl0).toHaveCssClass('text-left');
                    });

                    describe('if previous resource is given', () => {
                        it('... should have list-group-item-action class', () => {
                            const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-list-group-item.text-left', 1, 1);
                            const aEl0 = aDes[0].nativeElement;

                            expect(aEl0).toHaveCssClass('list-group-item-action');
                        });

                        it('... should navigate to previous resource on click', fakeAsync(() => {
                            const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-list-group-item.text-left', 1, 1);

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

                            getAndExpectDebugElementByCss(ulDes[0], 'a.awg-list-group-item.text-left > div', 2, 2);
                        });

                        it('... should have strong element with text-muted and small class in first div', () => {
                            const divDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-left > div',
                                2,
                                2
                            );
                            // Get first div
                            const strongDes = getAndExpectDebugElementByCss(divDes[0], 'strong', 1, 1);
                            const strongEl = strongDes[0].nativeElement;

                            expect(strongEl).toHaveCssClass('text-muted');
                            expect(strongEl).toHaveCssClass('small');
                        });

                        it('... should have faChevronLeft icon in strong element', () => {
                            const strongDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-left > div > strong',
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
                                'a.awg-list-group-item.text-left > div > strong',
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

                            expect(spanEl.innerText).toBe(expectedInnerText, `should be ${expectedInnerText}`);
                        });

                        it('... should have two divs.single-line in second div', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-left > div',
                                2,
                                2
                            );
                            const divDes = getAndExpectDebugElementByCss(outerDivDes[1], 'div.single-line', 2, 2);
                            // Get second div
                            const divEl1 = divDes[1].nativeElement;

                            expect(divEl1).toHaveCssClass('text-muted');
                            expect(divEl1).toHaveCssClass('small');
                        });

                        it('... should display previous title in first div.single-line', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-left > div',
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
                            expect(spanEl0.innerText).toBe(title, `should be ${title}`);
                        });

                        it('... should display previous subtitle in second div.single-line', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-left > div',
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
                            expect(spanEl1.innerText).toBe(subTitle, `should be ${subTitle}`);
                        });
                    });

                    describe('if previous resource is not given', () => {
                        beforeEach(() => {
                            // Remove first two entries from searchResponse to get no previous resource
                            const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                            otherResponseClone.data.subjects = otherResponseClone.data.subjects.slice(-3);

                            (component as any).updateResourceInfo(expectedResourceId, otherResponseClone);

                            // Apply changes
                            fixture.detectChanges();
                        });

                        it('... should have current.displayIndex === 1', () => {
                            expect(component.resourceInfoData.resources.current.displayIndex).toBeTruthy();
                            expect(component.resourceInfoData.resources.current.displayIndex).toBe(1, 'should be 1');
                        });

                        it('... should have list-group-item-danger class', () => {
                            const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-list-group-item.text-left', 1, 1);
                            const aEl0 = aDes[0].nativeElement;

                            expect(aEl0).toHaveCssClass('list-group-item-danger');
                        });

                        it('... should contain two divs', () => {
                            getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-left > div',
                                2,
                                2
                            );
                        });

                        it('... should have strong element with text-muted and small class in first div', () => {
                            const divDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-left > div',
                                2,
                                2
                            );
                            // Get first div
                            const strongDes = getAndExpectDebugElementByCss(divDes[0], 'strong', 1, 1);
                            const strongEl = strongDes[0].nativeElement;

                            expect(strongEl).toHaveCssClass('text-muted');
                            expect(strongEl).toHaveCssClass('small');
                        });

                        it('... should have faTimesCircle icon in strong element', () => {
                            const strongDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-left > div > strong',
                                1,
                                1
                            );
                            const iconDes = getAndExpectDebugElementByCss(strongDes[0], 'fa-icon', 1, 1);
                            expect(iconDes[0].children[0]).toBeTruthy();
                            expect(iconDes[0].children[0].classes).toBeTruthy();
                            expect(iconDes[0].children[0].classes['fa-times-circle']).toBeTrue();
                        });

                        it('... should have two empty divs.single-line in second div', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-left > div',
                                2,
                                2
                            );
                            // Get second outer div
                            const divDes = getAndExpectDebugElementByCss(outerDivDes[1], 'div.single-line', 2, 2);
                            // Get second inner div
                            const divEl1 = divDes[1].nativeElement;

                            expect(divEl1).toHaveCssClass('text-muted');
                            expect(divEl1).toHaveCssClass('small');

                            // Get spans
                            const spanDes = getAndExpectDebugElementByCss(outerDivDes[1], 'div.single-line span', 2, 2);
                            const spanEl0 = spanDes[0].nativeElement;
                            const spanEl1 = spanDes[1].nativeElement;

                            const whiteSpace = '\xA0'; // Hex code for a non-breaking space '&nbsp;'

                            expect(spanEl0.innerText).toBeTruthy();
                            expect(spanEl0.innerText).toBe(
                                whiteSpace,
                                `should be non-breaking whiteSpace ${whiteSpace}`
                            );

                            expect(spanEl1.innerText).toBeTruthy();
                            expect(spanEl1.innerText).toBe(
                                whiteSpace,
                                `should be non-breaking whiteSpace ${whiteSpace}`
                            );
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

                            expect(liEl).toHaveCssClass('list-group-item-info');
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

                            expect(strongEl).toHaveCssClass('text-muted');
                            expect(strongEl).toHaveCssClass('small');
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

                            expect(spanEl.innerText).toBe(expectedInnerText, `should be ${expectedInnerText}`);
                        });

                        it('... should contain one div with button and an input in form > div.input-group', () => {
                            const formDes = getAndExpectDebugElementByCss(
                                compDe,
                                'li.awg-list-group-item > form',
                                1,
                                1
                            );
                            const divDes = getAndExpectDebugElementByCss(formDes[0], 'div.input-group', 1, 1);

                            const buttonDes = getAndExpectDebugElementByCss(
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
                            const inputEl = inputDes[0].nativeElement;

                            // FormControlName='resourceInfoIndex'
                            expect(inputDes[0].attributes.formControlName).toBeTruthy();
                            expect(inputDes[0].attributes.formControlName).toBe(
                                'resourceInfoIndex',
                                'should be resourceInfoIndex'
                            );

                            // Type='number'
                            expect(inputDes[0].attributes.type).toBeTruthy();
                            expect(inputDes[0].attributes.type).toBe('number', 'should be number');

                            // Size=4
                            expect(inputDes[0].attributes.size).toBeTruthy();
                            expect(inputDes[0].attributes.size).toBe('4', 'should be 4');
                            // Step=1
                            expect(inputDes[0].attributes.step).toBeTruthy();
                            expect(inputDes[0].attributes.step).toBe('1', 'should be 1');
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
                                expect(buttonDes[0].attributes.type).toBeTruthy();
                                expect(buttonDes[0].attributes.type).toBe('submit', 'should be submit');

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

                                expect(buttonEl.innerText).toBeTruthy();
                                expect(buttonEl.innerText).toBe('Gehe zu', 'should be `Gehe zu`');
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
                                expect(resourceInfoIndex.value).toBe(
                                    component.resourceInfoData.resources.current.displayIndex
                                );
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
                                expect(resourceInfoIndex.value).not.toBe(
                                    component.resourceInfoData.resources.current.displayIndex
                                );

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

                            (component as any).updateResourceInfo(expectedResourceId, otherResponseClone);

                            // Apply changes
                            fixture.detectChanges();

                            getAndExpectDebugElementByCss(compDe, 'li.awg-list-group-item', 0, 0);
                        });
                    });
                });

                describe('next resource (second anchor)', () => {
                    it('... should display text right', () => {
                        const ulDes = getAndExpectDebugElementByCss(compDe, 'ul.awg-resource-info-list-group', 1, 1);
                        const aDes = getAndExpectDebugElementByCss(ulDes[0], 'a.awg-list-group-item', 2, 2);
                        const aEl1 = aDes[1].nativeElement;
                        expect(aEl1).toHaveCssClass('list-group-item-action');
                        expect(aEl1).toHaveCssClass('text-right');
                    });

                    describe('if next resource is given', () => {
                        it('... should have list-group-item-action class', () => {
                            const aDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-right',
                                1,
                                1
                            );
                            const aEl0 = aDes[0].nativeElement;

                            expect(aEl0).toHaveCssClass('list-group-item-action');
                        });

                        it('... should navigate to next resource on click', fakeAsync(() => {
                            const aDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-right',
                                1,
                                1
                            );

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

                            getAndExpectDebugElementByCss(ulDes[0], 'a.awg-list-group-item.text-right > div', 2, 2);
                        });

                        it('... should have strong element with text-muted and small class in first div', () => {
                            const divDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-right > div',
                                2,
                                2
                            );
                            const strongDes = getAndExpectDebugElementByCss(divDes[0], 'strong', 1, 1);
                            const strongEl = strongDes[0].nativeElement;

                            expect(strongEl).toHaveCssClass('text-muted');
                            expect(strongEl).toHaveCssClass('small');
                        });

                        it('... should have faChevronRight icon in strong element', () => {
                            const strongDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-right > div > strong',
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
                                'a.awg-list-group-item.text-right > div > strong',
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

                            expect(spanEl.innerText).toBe(expectedInnerText, `should be ${expectedInnerText}`);
                        });

                        it('... should have two divs.single-line in second div', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-left > div',
                                2,
                                2
                            );
                            const divDes = getAndExpectDebugElementByCss(outerDivDes[1], 'div.single-line', 2, 2);
                            // // get second div
                            const divEl1 = divDes[1].nativeElement;

                            expect(divEl1).toHaveCssClass('text-muted');
                            expect(divEl1).toHaveCssClass('small');
                        });

                        it('... should display next title in first div.single-line', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-right > div',
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
                            expect(spanEl0.innerText).toBe(title, `should be ${title}`);
                        });

                        it('... should display next subtitle in second div.single-line', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-right > div',
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
                            expect(spanEl1.innerText).toBe(subTitle, `should be ${subTitle}`);
                        });
                    });

                    describe('if next resource is not given', () => {
                        beforeEach(() => {
                            // Remove last two entries from searchResponse to get no next resource
                            const otherResponseClone = JSON.parse(JSON.stringify(expectedSearchResponseWithQuery));
                            otherResponseClone.data.subjects = otherResponseClone.data.subjects.slice(0, 3);

                            (component as any).updateResourceInfo(expectedResourceId, otherResponseClone);

                            // Apply changes
                            fixture.detectChanges();
                        });

                        it('... should have current.displayIndex === resultSize', () => {
                            expect(component.resourceInfoData.resources.current.displayIndex).toBeTruthy();
                            expect(component.resourceInfoData.resources.current.displayIndex).toBe(
                                component.resultSize,
                                `should be ${component.resultSize}`
                            );
                        });

                        it('... should have list-group-item-danger class', () => {
                            const aDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.text-right',
                                1,
                                1
                            );
                            const aEl0 = aDes[0].nativeElement;

                            expect(aEl0).toHaveCssClass('list-group-item-danger');
                        });

                        it('... should contain two divs', () => {
                            getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-right > div',
                                2,
                                2
                            );
                        });

                        it('... should have strong element with text-muted and small class in first div', () => {
                            const divDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-right > div',
                                2,
                                2
                            );
                            // Get first div
                            const strongDes = getAndExpectDebugElementByCss(divDes[0], 'strong', 1, 1);
                            const strongEl = strongDes[0].nativeElement;

                            expect(strongEl).toHaveCssClass('text-muted');
                            expect(strongEl).toHaveCssClass('small');
                        });

                        it('... should have faTimesCircle icon in strong element', () => {
                            const strongDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-right > div > strong',
                                1,
                                1
                            );
                            const iconDes = getAndExpectDebugElementByCss(strongDes[0], 'fa-icon', 1, 1);
                            expect(iconDes[0].children[0]).toBeTruthy();
                            expect(iconDes[0].children[0].classes).toBeTruthy();
                            expect(iconDes[0].children[0].classes['fa-times-circle']).toBeTrue();
                        });

                        it('... should have two empty divs.single-line in second div', () => {
                            const outerDivDes = getAndExpectDebugElementByCss(
                                compDe,
                                'a.awg-list-group-item.list-group-item-danger.text-right > div',
                                2,
                                2
                            );
                            // Get second outer div
                            const divDes = getAndExpectDebugElementByCss(outerDivDes[1], 'div.single-line', 2, 2);
                            // Get second inner div
                            const divEl1 = divDes[1].nativeElement;

                            expect(divEl1).toHaveCssClass('text-muted');
                            expect(divEl1).toHaveCssClass('small');

                            // Get spans
                            const spanDes = getAndExpectDebugElementByCss(outerDivDes[1], 'div.single-line span', 2, 2);
                            const spanEl0 = spanDes[0].nativeElement;
                            const spanEl1 = spanDes[1].nativeElement;

                            const whiteSpace = '\xA0'; // Hex code for a non-breaking space '&nbsp;'

                            expect(spanEl0.innerText).toBeTruthy();
                            expect(spanEl0.innerText).toBe(
                                whiteSpace,
                                `should be non-breaking whiteSpace ${whiteSpace}`
                            );

                            expect(spanEl1.innerText).toBeTruthy();
                            expect(spanEl1.innerText).toBe(
                                whiteSpace,
                                `should be non-breaking whiteSpace ${whiteSpace}`
                            );
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

                    expect(aEl.href).toBe(expectedHref, `should be ${expectedHref}`);
                    expect(aEl.innerText).toBe(expectedInnerText, `should be ${expectedInnerText}`);
                });
            });
        });
    });
});
