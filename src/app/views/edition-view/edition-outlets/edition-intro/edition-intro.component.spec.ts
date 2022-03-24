/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { mockEditionData } from '@testing/mock-data';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EditionSvgSheet, EditionWork, EditionWorks, IntroList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

import { EditionIntroComponent } from './edition-intro.component';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';

// Mock components
@Component({ selector: 'awg-modal', template: '' })
class ModalStubComponent {
    open(modalContentSnippetKey: string): void {}
}

describe('IntroComponent (DONE)', () => {
    let component: EditionIntroComponent;
    let fixture: ComponentFixture<EditionIntroComponent>;
    let compDe: DebugElement;

    let mockRouter;

    let mockEditionDataService: Partial<EditionDataService>;
    let mockEditionService: Partial<EditionService>;
    let editionDataService: Partial<EditionDataService>;
    let editionService: Partial<EditionService>;

    let expectedEditionIntroData: IntroList;
    let expectedEditionWork: EditionWork;
    let expectedModalSnippet: string;
    let expectedFragment: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

    let editionDataServiceGetEditionIntroDataSpy: Spy;
    let getEditionIntroDataSpy: Spy;
    let getEditionWorkSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigationSpy: Spy;
    let modalOpenSpy: Spy;
    let componentOpenModalSpy: Spy;
    let selectSvgSheetSpy: Spy;

    beforeEach(waitForAsync(() => {
        // Mock router with spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        // Mock services
        mockEditionDataService = {
            getEditionIntroData: (editionWork: EditionWork): Observable<IntroList> =>
                observableOf(expectedEditionIntroData),
        };
        mockEditionService = {
            getEditionWork: (): Observable<EditionWork> => observableOf(expectedEditionWork),
        };

        TestBed.configureTestingModule({
            imports: [NgbModalModule, RouterTestingModule],
            declarations: [CompileHtmlComponent, EditionIntroComponent, ModalStubComponent, RouterLinkStubDirective],
            providers: [
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionService, useValue: mockEditionService },
                { provide: Router, useValue: mockRouter },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionIntroComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Inject services from root
        editionDataService = TestBed.inject(EditionDataService);
        editionService = TestBed.inject(EditionService);

        expectedEditionWork = EditionWorks.OP12;
        expectedFragment = 'sourceA';
        expectedModalSnippet = mockEditionData.mockModalSnippet;
        expectedEditionIntroData = mockEditionData.mockIntroData;
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk3;

        // Spies on service functions
        editionDataServiceGetEditionIntroDataSpy = spyOn(editionDataService, 'getEditionIntroData').and.returnValue(
            observableOf(expectedEditionIntroData)
        );
        getEditionWorkSpy = spyOn(editionService, 'getEditionWork').and.returnValue(observableOf(expectedEditionWork));
        getEditionIntroDataSpy = spyOn(component, 'getEditionIntroData').and.callThrough();
        navigateToReportFragmentSpy = spyOn(component, 'navigateToReportFragment').and.callThrough();
        navigationSpy = mockRouter.navigate as jasmine.Spy;
        modalOpenSpy = spyOn(component.modal, 'open').and.callThrough();
        componentOpenModalSpy = spyOn(component, 'openModal').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have editionIntroData$', () => {
            expect(component.editionIntroData$).toBeUndefined();
        });

        it('... should not have editionWork', () => {
            expect(component.editionWork).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one modal component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ModalStubComponent, 1, 1);
            });

            it('... should contain no div.awg-intro-view yet', () => {
                // Div debug element
                getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 0, 0);
            });

            it('... should contain no div.errorMessage yet', () => {
                // Div debug element
                getAndExpectDebugElementByCss(compDe, 'div.errorMessage', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.editionIntroData$ = observableOf(expectedEditionIntroData);
            component.editionWork = expectedEditionWork;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have called `getEditionWork()`', () => {
            // `getEditionReportData()` called immediately after init
            expectSpyCall(getEditionWorkSpy, 1);
        });

        it('... should have called `getEditionIntroData()`', () => {
            // `getEditionIntroData()` called immediately after init
            expectSpyCall(getEditionIntroDataSpy, 1);
        });

        it('... should have editionWork', () => {
            expect(component.editionWork).toBeDefined();
            expect(component.editionWork)
                .withContext(`should equal ${expectedEditionWork}`)
                .toEqual(expectedEditionWork);
        });

        it('... should have editionIntroData$', done => {
            expect(component.editionIntroData$).toBeDefined();
            component.editionIntroData$.subscribe({
                next: response => {
                    expect(response)
                        .withContext(`should equal ${expectedEditionIntroData}`)
                        .toEqual(expectedEditionIntroData);
                    done();
                },
                error: err => {
                    fail('error should not have been called');
                    done();
                },
                complete: () => {
                    done();
                },
            });
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-intro-view n', () => {
                // Div debug element
                getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);
            });

            it('... should contain as many p elements in main div as paragraphs in intro data', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                getAndExpectDebugElementByCss(
                    divDes[0],
                    'p',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );
            });

            it('... should have one anchor in first paragraph, and two in the second one', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );

                getAndExpectDebugElementByCss(pDes[0], 'a', 1, 1);
                getAndExpectDebugElementByCss(pDes[1], 'a', 2, 2);
            });
        });

        describe('#getEditionReportData', () => {
            it('... should have been called', () => {
                expectSpyCall(getEditionIntroDataSpy, 1);
            });

            it('... should have got `editionWork` from editionService', () => {
                expectSpyCall(getEditionWorkSpy, 1);

                expect(component.editionWork).toBeTruthy();
                expect(component.editionWork)
                    .withContext(`should equal ${expectedEditionWork}`)
                    .toEqual(expectedEditionWork);
            });

            it('... should have got editionIntroData from editionDataService', () => {
                expectSpyCall(editionDataServiceGetEditionIntroDataSpy, 1);
            });

            it('... should return empty observable and set errorObject if switchMap fails', waitForAsync(() => {
                const expectedError = { status: 404, statusText: 'error' };
                // Spy on editionDataService to return an error
                editionDataServiceGetEditionIntroDataSpy.and.returnValue(observableThrowError(() => expectedError));

                // Init new switchMap
                component.getEditionIntroData();
                // Apply changes
                detectChangesOnPush(fixture);

                component.editionIntroData$.subscribe({
                    next: () => {
                        fail('should not have next');
                    },
                    error: () => {
                        fail('should not error');
                    },
                    complete: () => {
                        expect(component.errorObject).toEqual(expectedError);
                    },
                });
            }));
        });

        describe('#navigateToReportFragment', () => {
            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );

                // Find anchor in first paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[0], 'a', 1, 1);

                // CLick on anchor (with navigateToReportFragment call)
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
            }));

            it('... should navigate to fragment if given', () => {
                component.navigateToReportFragment(expectedFragment);
                fixture.detectChanges();

                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
                expectSpyCall(navigationSpy, 1, [
                    ['/edition/composition/op12/', 'report'],
                    { fragment: expectedFragment },
                ]);

                const otherFragment = 'otherFragment';
                component.navigateToReportFragment(otherFragment);
                fixture.detectChanges();

                expectSpyCall(navigateToReportFragmentSpy, 2, otherFragment);
                expectSpyCall(navigationSpy, 2, [
                    ['/edition/composition/op12/', 'report'],
                    { fragment: otherFragment },
                ]);
            });

            it('... should navigate without fragment if none is given', () => {
                component.navigateToReportFragment(expectedFragment);
                fixture.detectChanges();

                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
                expectSpyCall(navigationSpy, 1, [
                    ['/edition/composition/op12/', 'report'],
                    { fragment: expectedFragment },
                ]);

                const noFragment = '';
                component.navigateToReportFragment(noFragment);
                fixture.detectChanges();

                expectSpyCall(navigateToReportFragmentSpy, 2, '');
                expectSpyCall(navigationSpy, 2, [['/edition/composition/op12/', 'report'], { fragment: '' }]);
            });
        });

        describe('#openModal', () => {
            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );

                // Find anchors in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 2, 2);

                // CLick on anchor (with openModal call)
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(componentOpenModalSpy, 1, expectedModalSnippet);
            }));

            it('... should open modal with given id', () => {
                component.openModal(expectedModalSnippet);
                fixture.detectChanges();

                expectSpyCall(componentOpenModalSpy, 1, expectedModalSnippet);
                expectSpyCall(modalOpenSpy, 1, expectedModalSnippet);

                const otherSnippet = 'otherSnippet';
                component.openModal(otherSnippet);
                fixture.detectChanges();

                expectSpyCall(componentOpenModalSpy, 2, otherSnippet);
                expectSpyCall(modalOpenSpy, 2, otherSnippet);
            });

            describe('... should not do anything if ', () => {
                it('... id is undefined', () => {
                    component.openModal(undefined);

                    expectSpyCall(componentOpenModalSpy, 1);
                    expectSpyCall(modalOpenSpy, 0);
                });

                it('... id is null', () => {
                    component.openModal(null);

                    expectSpyCall(componentOpenModalSpy, 1);
                    expectSpyCall(modalOpenSpy, 0);
                });

                it('... id is empty string', () => {
                    component.openModal('');

                    expectSpyCall(componentOpenModalSpy, 1);
                    expectSpyCall(modalOpenSpy, 0);
                });
            });
        });

        describe('#selectSvgSheet', () => {
            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );

                // Find anchors in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 2, 2);

                // CLick on anchor (with selectSvgSheet call)
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
            }));

            it('... should navigate to id if given', () => {
                component.selectSvgSheet(expectedSvgSheet.id);
                fixture.detectChanges();

                const qp = {
                    queryParams: { sketch: expectedSvgSheet.id },
                    queryParamsHandling: '',
                };
                expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
                expectSpyCall(navigationSpy, 1, [['/edition/composition/op12/', 'sheets'], qp]);

                component.selectSvgSheet(expectedNextSvgSheet.id);
                fixture.detectChanges();

                qp.queryParams.sketch = expectedNextSvgSheet.id;
                expectSpyCall(selectSvgSheetSpy, 2, expectedNextSvgSheet.id);
                expectSpyCall(navigationSpy, 2, [['/edition/composition/op12/', 'sheets'], qp]);
            });

            it('... should navigate without id if none is given', () => {
                component.selectSvgSheet(expectedSvgSheet.id);
                fixture.detectChanges();

                const qp = {
                    queryParams: { sketch: expectedSvgSheet.id },
                    queryParamsHandling: '',
                };
                expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
                expectSpyCall(navigationSpy, 1, [['/edition/composition/op12/', 'sheets'], qp]);

                const noId = '';
                qp.queryParams.sketch = noId;
                component.selectSvgSheet(noId);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 2, '');
                expectSpyCall(navigationSpy, 2, [['/edition/composition/op12/', 'sheets'], qp]);
            });
        });
    });
});
