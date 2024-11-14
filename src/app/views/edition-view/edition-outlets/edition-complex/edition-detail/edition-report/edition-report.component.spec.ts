/* eslint-disable @typescript-eslint/no-unused-vars */
import { JsonPipe } from '@angular/common';
import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import {
    EMPTY,
    EmptyError,
    lastValueFrom,
    Observable,
    of as observableOf,
    throwError as observableThrowError,
} from 'rxjs';
import Spy = jasmine.Spy;

import { NgbAccordionModule, NgbConfig, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterOutletStubComponent } from '@testing/router-stubs';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    EditionComplex,
    EditionSvgSheet,
    SourceDescriptionList,
    SourceEvaluationList,
    SourceList,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionDataService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionReportComponent } from './edition-report.component';

// Mock components
@Component({ selector: 'awg-alert-error', template: '' })
class AlertErrorStubComponent {
    @Input()
    errorObject: any;
}

@Component({ selector: 'awg-modal', template: '' })
class ModalStubComponent {
    open(_modalContentSnippetKey: string): void {}
}

@Component({ selector: 'awg-source-list', template: '' })
class SourceListStubComponent {
    @Input()
    sourceListData: SourceList;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-source-description', template: '' })
class SourceDescriptionStubComponent {
    @Input()
    sourceDescriptionListData: SourceDescriptionList;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

@Component({ selector: 'awg-source-evaluation', template: '' })
class SourceEvaluationStubComponent {
    @Input()
    editionComplex: EditionComplex;
    @Input()
    sourceEvaluationListData: SourceEvaluationList;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

@Component({ selector: 'awg-textcritics-list', template: '' })
export class TextcriticsListStubComponent {
    @Input()
    textcriticsData: TextcriticsList;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('EditionReportComponent', () => {
    let component: EditionReportComponent;
    let fixture: ComponentFixture<EditionReportComponent>;
    let compDe: DebugElement;

    let mockRouter;

    let mockEditionDataService: Partial<EditionDataService>;
    let mockEditionStateService: Partial<EditionStateService>;
    let editionDataService: Partial<EditionDataService>;
    let editionStateService: Partial<EditionStateService>;

    let expectedEditionComplex: EditionComplex;
    let expectedEditionReportData: (SourceList | SourceDescriptionList | SourceEvaluationList | TextcriticsList)[];
    let expectedSourceListData: SourceList;
    let expectedSourceDescriptionListData: SourceDescriptionList;
    let expectedSourceEvaluationListData: SourceEvaluationList;
    let expectedTextcriticsData: TextcriticsList;
    let expectedReportFragment: string;
    let expectedModalSnippet: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedPanelId: string;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedEditionComplexBaseRoute: string;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    let editionDataServiceGetEditionReportDataSpy: Spy;
    let getEditionReportDataSpy: Spy;
    let editionStateServiceGetSelectedEditionComplexSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigateWithComplexIdSpy: Spy;
    let navigationSpy: Spy;
    let modalOpenSpy: Spy;
    let onModalOpenSpy: Spy;
    let selectSvgSheetSpy: Spy;

    const jsonPipe = new JsonPipe();

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
    });

    beforeEach(waitForAsync(() => {
        // Mock router with spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        // Mock services
        mockEditionDataService = {
            getEditionReportData: (
                editionComplex: EditionComplex
            ): Observable<(SourceList | SourceDescriptionList | SourceEvaluationList | TextcriticsList)[]> =>
                observableOf(expectedEditionReportData),
        };
        mockEditionStateService = {
            getSelectedEditionComplex: (): Observable<EditionComplex> => observableOf(expectedEditionComplex),
        };

        TestBed.configureTestingModule({
            imports: [NgbAccordionWithConfigModule, NgbModalModule],
            declarations: [
                CompileHtmlComponent,
                EditionReportComponent,
                AlertErrorStubComponent,
                ModalStubComponent,
                SourceListStubComponent,
                SourceDescriptionStubComponent,
                SourceEvaluationStubComponent,
                TextcriticsListStubComponent,
                RouterOutletStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
            providers: [
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionStateService, useValue: mockEditionStateService },
                { provide: Router, useValue: mockRouter },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionReportComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Inject services from root
        editionDataService = TestBed.inject(EditionDataService);
        editionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedPanelId = 'awg-sources-panel';
        expectedReportFragment = 'source_A';
        expectedEditionComplex = EditionComplexesService.getEditionComplexById('OP12');
        expectedEditionComplexBaseRoute = '/edition/complex/op12/';
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));

        expectedSourceListData = JSON.parse(JSON.stringify(mockEditionData.mockSourceListData));
        expectedSourceDescriptionListData = JSON.parse(JSON.stringify(mockEditionData.mockSourceDescriptionListData));
        expectedSourceEvaluationListData = JSON.parse(JSON.stringify(mockEditionData.mockSourceEvaluationListData));
        expectedTextcriticsData = JSON.parse(JSON.stringify(mockEditionData.mockTextcriticsData));

        expectedEditionReportData = [
            expectedSourceListData,
            expectedSourceDescriptionListData,
            expectedSourceEvaluationListData,
            expectedTextcriticsData,
        ];

        // Spies on service functions
        editionDataServiceGetEditionReportDataSpy = spyOn(editionDataService, 'getEditionReportData').and.returnValue(
            observableOf(expectedEditionReportData)
        );
        editionStateServiceGetSelectedEditionComplexSpy = spyOn(
            editionStateService,
            'getSelectedEditionComplex'
        ).and.returnValue(observableOf(expectedEditionComplex));
        getEditionReportDataSpy = spyOn(component, 'getEditionReportData').and.callThrough();
        navigateToReportFragmentSpy = spyOn(component, 'onReportFragmentNavigate').and.callThrough();
        navigateWithComplexIdSpy = spyOn(component as any, '_navigateWithComplexId').and.callThrough();
        navigationSpy = mockRouter.navigate as jasmine.Spy;
        modalOpenSpy = spyOn(component.modal, 'open').and.callThrough();
        onModalOpenSpy = spyOn(component, 'onModalOpen').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'onSvgSheetSelect').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `editionReportData$`', () => {
            expect(component.editionReportData$).toBeUndefined();
        });

        it('... should not have `editionComplex`', () => {
            expect(component.editionComplex).toBeUndefined();
        });

        it('... should have `editionRouteConstants`', () => {
            expectToBe(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        describe('VIEW', () => {
            it('... should contain a `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain one modal component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], ModalStubComponent, 1, 1);
            });

            it('... should contain no div.accordion yet', () => {
                // Div.accordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);
            });

            it('... should not contain source list component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 0, 0);
            });

            it('... should not contain source description component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceDescriptionStubComponent, 0, 0);
            });

            it('... should not contain source evaluation component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceEvaluationStubComponent, 0, 0);
            });

            it('... should not contain textcritics list component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, TextcriticsListStubComponent, 0, 0);
            });

            it('... should not contain an AlertErrorComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 0, 0);
            });

            it('... should not contain a loading spinner component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.editionReportData$ = observableOf(expectedEditionReportData);
            component.editionComplex = expectedEditionComplex;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have called `getEditionReportData()`', () => {
            expectSpyCall(getEditionReportDataSpy, 1);
        });

        it('... should have triggered `getSelectedEditionComplex()` method from EditionStateService', () => {
            expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 1);
        });

        it('... should have editionComplex', () => {
            expectToEqual(component.editionComplex, expectedEditionComplex);
        });

        it('... should have editionReportData$', waitForAsync(() => {
            expectAsync(lastValueFrom(component.editionReportData$)).toBeResolved();
            expectAsync(lastValueFrom(component.editionReportData$)).toBeResolvedTo(expectedEditionReportData);
        }));

        describe('VIEW', () => {
            it('... should contain one div.accordion', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain one source list component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 1, 1);
            });

            it('... should contain one source description component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, SourceDescriptionStubComponent, 1, 1);
            });

            it('... should contain one source evaluation component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, SourceEvaluationStubComponent, 1, 1);
            });

            it('... should contain one textcritics list component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, TextcriticsListStubComponent, 1, 1);
            });

            it('... should pass down sourceListData to SourceListComponent', () => {
                const sourceListDes = getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 1, 1);
                const sourceListCmp = sourceListDes[0].injector.get(SourceListStubComponent) as SourceListStubComponent;

                expectToEqual(sourceListCmp.sourceListData, expectedSourceListData);
            });

            it('... should pass down sourceDescriptionListData to SourceDescriptionComponent', () => {
                const descriptionDes = getAndExpectDebugElementByDirective(
                    compDe,
                    SourceDescriptionStubComponent,
                    1,
                    1
                );
                const descriptionCmp = descriptionDes[0].injector.get(
                    SourceDescriptionStubComponent
                ) as SourceDescriptionStubComponent;

                expectToEqual(descriptionCmp.sourceDescriptionListData, expectedSourceDescriptionListData);
            });

            it('... should pass down sourceEvaluationListData to SourceEvaluationComponent', () => {
                const evaluationDes = getAndExpectDebugElementByDirective(compDe, SourceEvaluationStubComponent, 1, 1);
                const evaluationCmp = evaluationDes[0].injector.get(
                    SourceEvaluationStubComponent
                ) as SourceEvaluationStubComponent;

                expectToEqual(evaluationCmp.sourceEvaluationListData, expectedSourceEvaluationListData);
            });

            it('... should pass down textcriticsListData to TextcriticsListComponent', () => {
                const textcriticsDes = getAndExpectDebugElementByDirective(compDe, TextcriticsListStubComponent, 1, 1);
                const textcriticsCmp = textcriticsDes[0].injector.get(
                    TextcriticsListStubComponent
                ) as TextcriticsListStubComponent;

                expectToEqual(textcriticsCmp.textcriticsData, expectedTextcriticsData);
            });

            describe('on error', () => {
                const expectedError = { status: 404, statusText: 'got Error' };

                beforeEach(waitForAsync(() => {
                    // Spy on editionDataService to return an error
                    editionDataServiceGetEditionReportDataSpy.and.returnValue(
                        observableThrowError(() => expectedError)
                    );

                    component.getEditionReportData();
                    detectChangesOnPush(fixture);
                }));

                it('... should not contain report view, but one AlertErrorComponent (stubbed)', waitForAsync(() => {
                    getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                    getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 1, 1);
                }));

                it('... should pass down error object to AlertErrorComponent', waitForAsync(() => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(
                        AlertErrorStubComponent
                    ) as AlertErrorStubComponent;

                    expectToEqual(alertErrorCmp.errorObject, expectedError);
                }));
            });

            describe('on loading', () => {
                describe('... should contain only TwelveToneSpinnerComponent (stubbed) if ... ', () => {
                    it('... editionReportData$ is EMPTY', () => {
                        // Mock empty observable
                        component.editionReportData$ = EMPTY;
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-report-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... editionReportData$ is undefined', () => {
                        // Mock undefined response
                        component.editionReportData$ = observableOf(undefined);
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-report-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... editionReportData$ is null', () => {
                        // Mock null response
                        component.editionReportData$ = observableOf(null);
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-report-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });
                });
            });
        });

        describe('#getEditionReportData()', () => {
            it('... should have a method `getEditionReportData`', () => {
                expect(component.getEditionReportData).toBeDefined();
            });

            it('... should have been called', () => {
                expectSpyCall(getEditionReportDataSpy, 1);
            });

            it('... should have got `editionComplex` from editionStateService', () => {
                expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 1);

                expectToEqual(component.editionComplex, expectedEditionComplex);
            });

            it('... should have got `editionReportData` from editionDataService', () => {
                expectSpyCall(editionDataServiceGetEditionReportDataSpy, 1);
            });

            it('... should return empty observable and set errorObject if switchMap fails', waitForAsync(() => {
                const expectedError = { status: 404, statusText: 'error' };
                // Spy on editionDataService to return an error
                editionDataServiceGetEditionReportDataSpy.and.returnValue(observableThrowError(() => expectedError));

                // Init new switchMap
                component.getEditionReportData();
                detectChangesOnPush(fixture);

                expectAsync(lastValueFrom(component.editionReportData$)).toBeRejected();
                expectAsync(lastValueFrom(component.editionReportData$)).toBeRejectedWithError(EmptyError);

                expectToEqual(component.errorObject, expectedError);
            }));
        });

        describe('#onModalOpen()', () => {
            it('... should have a method `onModalOpen`', () => {
                expect(component.onModalOpen).toBeDefined();
            });

            describe('... should trigger on event from', () => {
                describe('... SourceListComponent if', () => {
                    it('... modal snippet is undefined', () => {
                        const sourceListDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceListStubComponent,
                            1,
                            1
                        );
                        const sourceListCmp = sourceListDes[0].injector.get(
                            SourceListStubComponent
                        ) as SourceListStubComponent;

                        sourceListCmp.openModalRequest.emit(undefined);

                        expectSpyCall(onModalOpenSpy, 1, undefined);
                    });

                    it('... modal snippet is given', () => {
                        const sourceListDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceListStubComponent,
                            1,
                            1
                        );
                        const sourceListCmp = sourceListDes[0].injector.get(
                            SourceListStubComponent
                        ) as SourceListStubComponent;

                        sourceListCmp.openModalRequest.emit(expectedModalSnippet);

                        expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                    });
                });

                describe('... SourceDescriptionComponent if', () => {
                    it('... modal snippet is undefined', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        descriptionCmp.openModalRequest.emit(undefined);

                        expectSpyCall(onModalOpenSpy, 1, undefined);
                    });

                    it('... modal snippet is given', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        descriptionCmp.openModalRequest.emit(expectedModalSnippet);

                        expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                    });
                });

                describe('... SourceEvaluationComponent if', () => {
                    it('... modal snippet is undefined', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        evaluationCmp.openModalRequest.emit(undefined);

                        expectSpyCall(onModalOpenSpy, 1, undefined);
                    });

                    it('... modal snippet is given', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        evaluationCmp.openModalRequest.emit(expectedModalSnippet);

                        expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                    });
                });

                describe('... TextcriticsListComponent if', () => {
                    it('... modal snippet is undefined', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListStubComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListStubComponent
                        ) as TextcriticsListStubComponent;

                        textcriticsCmp.openModalRequest.emit(undefined);

                        expectSpyCall(onModalOpenSpy, 1, undefined);
                    });

                    it('... smodal snippet is given', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListStubComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListStubComponent
                        ) as TextcriticsListStubComponent;

                        textcriticsCmp.openModalRequest.emit(expectedModalSnippet);

                        expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                    });
                });
            });

            it('... should open modal with given id', () => {
                component.onModalOpen(expectedModalSnippet);
                detectChangesOnPush(fixture);

                expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                expectSpyCall(modalOpenSpy, 1, expectedModalSnippet);

                const otherSnippet = 'otherSnippet';
                component.onModalOpen(otherSnippet);
                detectChangesOnPush(fixture);

                expectSpyCall(onModalOpenSpy, 2, otherSnippet);
                expectSpyCall(modalOpenSpy, 2, otherSnippet);
            });

            describe('... should not do anything if ', () => {
                it('... id is undefined', () => {
                    component.onModalOpen(undefined);

                    expectSpyCall(onModalOpenSpy, 1, undefined);
                    expectSpyCall(modalOpenSpy, 0);
                });

                it('... id is null', () => {
                    component.onModalOpen(null);

                    expectSpyCall(onModalOpenSpy, 1, null);
                    expectSpyCall(modalOpenSpy, 0);
                });

                it('... id is empty string', () => {
                    component.onModalOpen('');

                    expectSpyCall(onModalOpenSpy, 1, '');
                    expectSpyCall(modalOpenSpy, 0);
                });
            });
        });

        describe('#onReportFragmentNavigate()', () => {
            it('... should have a method `onReportFragmentNavigate`', () => {
                expect(component.onReportFragmentNavigate).toBeDefined();
            });

            describe('... should trigger on event from', () => {
                describe('... SourceListComponent if', () => {
                    it('... fragment id is undefined', () => {
                        const listDes = getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 1, 1);
                        const listCmp = listDes[0].injector.get(SourceListStubComponent) as SourceListStubComponent;

                        listCmp.navigateToReportFragmentRequest.emit(undefined);

                        expectSpyCall(navigateToReportFragmentSpy, 1, undefined);
                    });

                    it('... fragment id is given', () => {
                        const listDes = getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 1, 1);
                        const listCmp = listDes[0].injector.get(SourceListStubComponent) as SourceListStubComponent;

                        const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                        listCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                        expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                    });
                });

                describe('... SourceDescriptionComponent if', () => {
                    it('... fragment id is undefined', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        descriptionCmp.navigateToReportFragmentRequest.emit(undefined);

                        expectSpyCall(navigateToReportFragmentSpy, 1, undefined);
                    });

                    it('... fragment id is given', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                        descriptionCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                        expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                    });
                });

                describe('... SourceEvaluationComponent if', () => {
                    it('... fragment id is undefined', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        evaluationCmp.navigateToReportFragmentRequest.emit(undefined);

                        expectSpyCall(navigateToReportFragmentSpy, 1, undefined);
                    });

                    it('... fragment id is given', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                        evaluationCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                        expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                    });
                });
            });

            it('... should call `_navigateWithComplexId()` method with correct parameters', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                const expectedNavigationExtras = {
                    fragment: expectedReportIds.fragmentId,
                };

                component.onReportFragmentNavigate(expectedReportIds);
                detectChangesOnPush(fixture);

                expectSpyCall(navigateWithComplexIdSpy, 1, [
                    expectedReportIds.complexId,
                    expectedReportRoute,
                    expectedNavigationExtras,
                ]);
            });

            describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                it('... fragment id is undefined', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: undefined };

                    const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.onReportFragmentNavigate(expectedReportIds);
                    detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is null', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: null };

                    const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.onReportFragmentNavigate(expectedReportIds);
                    detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is empty string', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: '' };

                    const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.onReportFragmentNavigate(expectedReportIds);
                    detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });
            });
        });

        describe('#onSvgSheetSelect()', () => {
            it('... should have a method `onSvgSheetSelect`', () => {
                expect(component.onSvgSheetSelect).toBeDefined();
            });

            describe('... should trigger on event from', () => {
                describe('... SourceDescriptionComponent if', () => {
                    it('... sheet ids are undefined', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        const expectedSheetIds = { complexId: undefined, sheetId: undefined };
                        descriptionCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

                    it('... complex id is undefined', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        const expectedSheetIds = { complexId: undefined, sheetId: expectedSvgSheet.id };
                        descriptionCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

                    it('... svg sheet id is undefined', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: undefined };
                        descriptionCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

                    it('... both sheet ids are given', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                        descriptionCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
                });

                describe('... SourceEvaluationComponent if', () => {
                    it('... sheet ids are undefined', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        const expectedSheetIds = { complexId: undefined, sheetId: undefined };
                        evaluationCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
                    it('... complex id is undefined', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        const expectedSheetIds = { complexId: undefined, sheetId: expectedSvgSheet.id };
                        evaluationCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
                    it('... svg sheet id is undefined', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: undefined };
                        evaluationCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

                    it('... both sheet ids are given', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                        evaluationCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
                });

                describe('... TextcriticsListComponent if', () => {
                    it('... sheet ids are undefined', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListStubComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListStubComponent
                        ) as TextcriticsListStubComponent;

                        const expectedSheetIds = { complexId: undefined, sheetId: undefined };
                        textcriticsCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

                    it('... complex id is undefined', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListStubComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListStubComponent
                        ) as TextcriticsListStubComponent;

                        const expectedSheetIds = { complexId: undefined, sheetId: expectedSvgSheet.id };
                        textcriticsCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

                    it('... svg sheet id is undefined', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListStubComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListStubComponent
                        ) as TextcriticsListStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: undefined };
                        textcriticsCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

                    it('... both sheet ids are given', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListStubComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListStubComponent
                        ) as TextcriticsListStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                        textcriticsCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
                });
            });

            it('... should call `_navigateWithComplexId()` method with correct parameters', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedReportFragment };

                const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                const expectedNavigationExtras = {
                    queryParams: { id: expectedSheetIds.sheetId },
                };

                component.onSvgSheetSelect(expectedSheetIds);
                detectChangesOnPush(fixture);

                expectSpyCall(navigateWithComplexIdSpy, 1, [
                    expectedSheetIds.complexId,
                    expectedSheetRoute,
                    expectedNavigationExtras,
                ]);
            });

            describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                it('... fragment id is undefined', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: undefined };

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    component.onSvgSheetSelect(expectedSheetIds);
                    detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is null', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: null };

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    component.onSvgSheetSelect(expectedSheetIds);
                    detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is empty string', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: '' };

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    component.onSvgSheetSelect(expectedSheetIds);
                    detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... should call `_navigateWithComplexId()` method with undefined complex id if', () => {
                it('... introIds are undefined', () => {
                    const expectedSheetIds = undefined;

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    component.onSvgSheetSelect(expectedSheetIds);
                    detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... introIds are null', () => {
                    const expectedSheetIds = null;

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    component.onSvgSheetSelect(expectedSheetIds);
                    detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is empty string', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: '' };

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    component.onSvgSheetSelect(expectedSheetIds);
                    detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });
            });
        });

        describe('#_navigateWithComplexId()', () => {
            it('... should have a method `_navigateWithComplexId`', () => {
                expect((component as any)._navigateWithComplexId).toBeDefined();
            });

            describe('... should navigate within same complex if', () => {
                it('... complex id is undefined', () => {
                    const expectedComplexRoute = expectedEditionComplexBaseRoute;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId(undefined, expectedTargetRoute, expectedNavigationExtras);
                    detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedTargetRoute,
                        expectedNavigationExtras,
                    ]);
                    expectSpyCall(navigationSpy, 1, [
                        [expectedComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });

                it('... complex id is null', () => {
                    const expectedComplexRoute = expectedEditionComplexBaseRoute;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId(null, expectedTargetRoute, expectedNavigationExtras);
                    detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [null, expectedTargetRoute, expectedNavigationExtras]);
                    expectSpyCall(navigationSpy, 1, [
                        [expectedComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });

                it('... complex id is empty string', () => {
                    const expectedComplexRoute = expectedEditionComplexBaseRoute;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId('', expectedTargetRoute, expectedNavigationExtras);
                    detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, ['', expectedTargetRoute, expectedNavigationExtras]);
                    expectSpyCall(navigationSpy, 1, [
                        [expectedComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });

                it('... complex id is equal to the current complex id', () => {
                    const expectedComplexRoute = expectedEditionComplexBaseRoute;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId(
                        expectedEditionComplex.complexId.route.replace('/', ''),
                        expectedTargetRoute,
                        expectedNavigationExtras
                    );
                    detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedEditionComplex.complexId.route.replace('/', ''),
                        expectedTargetRoute,
                        expectedNavigationExtras,
                    ]);
                    expectSpyCall(navigationSpy, 1, [
                        [expectedComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... should navigate to another complex if', () => {
                it('... complex id is given and not equal to the current complex id', () => {
                    const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId(
                        expectedNextComplexId,
                        expectedTargetRoute,
                        expectedNavigationExtras
                    );
                    detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedNextComplexId,
                        expectedTargetRoute,
                        expectedNavigationExtras,
                    ]);
                    expectSpyCall(navigationSpy, 1, [
                        [expectedNextComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... with no edition complex id given', () => {
                describe('... should navigate within same complex to a given report route', () => {
                    it('... with a given report fragment', () => {
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: expectedReportFragment };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given report fragment', () => {
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should navigate within same complex to a given sheet route', () => {
                    it('... with a given sheet id', () => {
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: expectedSvgSheet.id } };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given sheet id', () => {
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: '' } };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });
            });

            describe('... with the current edition complex id given', () => {
                describe('... should navigate within same complex to a given report route', () => {
                    it('... with a given report fragment', () => {
                        expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: expectedReportFragment };

                        (component as any)._navigateWithComplexId(
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given report fragment', () => {
                        expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should navigate within same complex to a given sheet route', () => {
                    it('... with a given sheet id', () => {
                        expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: expectedSvgSheet.id } };

                        (component as any)._navigateWithComplexId(
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given sheet id', () => {
                        expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: '' } };

                        (component as any)._navigateWithComplexId(
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });
            });

            describe('... with another edition complex id given', () => {
                describe('... should navigate to a given report route of another complex', () => {
                    it('... with a given report fragment', () => {
                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: expectedReportFragment };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedNextComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given report fragment', () => {
                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedNextComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should navigate to a given sheet route of another complex', () => {
                    it('... with a given sheet id', () => {
                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: expectedSvgSheet.id } };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedNextComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given sheet id', () => {
                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: '' } };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedNextComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });
            });
        });
    });
});
