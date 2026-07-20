import {
    Component,
    DebugElement,
    EventEmitter,
    inject as inject_1,
    Input,
    isSignal,
    NgModule,
    Output,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import type { Mock } from 'vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { NEVER, Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';

import { NgbAccordionModule, NgbConfig, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

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
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
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
@Component({
    selector: 'awg-alert-error',
    template: '',
    standalone: false,
})
class AlertErrorStubComponent {
    @Input()
    errorObject: any;
}

@Component({
    selector: 'awg-modal',
    template: '',
    standalone: false,
})
class ModalStubComponent {
    open(): void {}
}

@Component({
    selector: 'awg-source-list',
    template: '',
    standalone: false,
})
class SourceListStubComponent {
    @Input()
    sourceListData: SourceList;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{
        complexId: string;
        fragmentId: string;
    }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
}

@Component({
    selector: 'awg-source-description',
    template: '',
    standalone: false,
})
class SourceDescriptionStubComponent {
    @Input()
    sourceDescriptionListData: SourceDescriptionList;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{
        complexId: string;
        fragmentId: string;
    }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{
        complexId: string;
        sheetId: string;
    }> = new EventEmitter();
}

@Component({
    selector: 'awg-source-evaluation',
    template: '',
    standalone: false,
})
class SourceEvaluationStubComponent {
    @Input()
    editionComplex: EditionComplex;
    @Input()
    sourceEvaluationListData: SourceEvaluationList;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{
        complexId: string;
        fragmentId: string;
    }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{
        complexId: string;
        sheetId: string;
    }> = new EventEmitter();
}

@Component({
    selector: 'awg-textcritics-list',
    template: '',
    standalone: false,
})
export class TextcriticsListStubComponent {
    @Input()
    textcriticsListData: TextcriticsList;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{
        complexId: string;
        sheetId: string;
    }> = new EventEmitter();
}

@Component({
    selector: 'awg-twelve-tone-spinner',
    template: '',
    standalone: false,
})
class TwelveToneSpinnerStubComponent {}

describe('EditionReportComponent', () => {
    let component: EditionReportComponent;
    let fixture: ComponentFixture<EditionReportComponent>;
    let compDe: DebugElement;

    let mockRouter;

    let mockEditionDataService: Partial<EditionDataService>;
    let editionStateService: EditionStateService;

    let expectedEditionComplex: EditionComplex;
    let expectedOtherEditionComplex: EditionComplex;
    let expectedEditionReportData: (SourceList | SourceDescriptionList | SourceEvaluationList | TextcriticsList)[];
    let reportDataResult$: Observable<(SourceList | SourceDescriptionList | SourceEvaluationList | TextcriticsList)[]>;
    let expectedSourceListData: SourceList;
    let expectedSourceDescriptionListData: SourceDescriptionList;
    let expectedSourceEvaluationListData: SourceEvaluationList;
    let expectedTextcriticsListData: TextcriticsList;
    let expectedReportFragment: string;
    let expectedModalSnippet: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedEditionComplexBaseRoute: string;

    let editionDataServiceGetEditionReportDataSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigateWithComplexIdSpy: Spy;
    let navigationSpy: Spy;
    let modalOpenSpy: Spy;
    let onModalOpenSpy: Spy;
    let selectSvgSheetSpy: Spy;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor() {
            const config = inject_1(NgbConfig);

            // Set animations to false
            config.animation = false;
        }
    }

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
    });

    beforeEach(async () => {
        // Mock router with spy object
        mockRouter = {
            navigate: vi.fn().mockName('Router.navigate'),
        };

        // Mock services
        mockEditionDataService = {
            getEditionReportData: (): Observable<
                (SourceList | SourceDescriptionList | SourceEvaluationList | TextcriticsList)[]
            > => observableOf(expectedEditionReportData),
        };

        await TestBed.configureTestingModule({
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
                EditionStateService,
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: Router, useValue: mockRouter },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        reportDataResult$ = observableOf(null);
        editionDataServiceGetEditionReportDataSpy = vi
            .spyOn(mockEditionDataService, 'getEditionReportData')
            .mockImplementation(() => reportDataResult$);
        navigationSpy = mockRouter.navigate as Mock;

        // Test data
        expectedReportFragment = 'source_A';
        expectedComplexId = 'op12';
        expectedEditionComplexBaseRoute = `/edition/complex/${expectedComplexId}`;
        expectedEditionComplex = EditionComplexesService.getEditionComplexById(expectedComplexId);
        expectedOtherEditionComplex = EditionComplexesService.getEditionComplexById('op25');
        expectedNextComplexId = 'testComplex2';
        expectedModalSnippet = structuredClone(mockEditionData.mockModalSnippet);
        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);

        expectedSourceListData = structuredClone(mockEditionData.mockSourceListData);
        expectedSourceDescriptionListData = structuredClone(mockEditionData.mockSourceDescriptionListData);
        expectedSourceEvaluationListData = structuredClone(mockEditionData.mockSourceEvaluationListData);
        expectedTextcriticsListData = structuredClone(mockEditionData.mockTextcriticsListData);

        expectedEditionReportData = [
            expectedSourceListData,
            expectedSourceDescriptionListData,
            expectedSourceEvaluationListData,
            expectedTextcriticsListData,
        ];

        // Create component fixture
        fixture = TestBed.createComponent(EditionReportComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        navigateToReportFragmentSpy = vi.spyOn(component, 'onReportFragmentNavigate');
        navigateWithComplexIdSpy = vi.spyOn(component as any, '_navigateWithComplexId');
        modalOpenSpy = vi.spyOn(component.modal, 'open');
        onModalOpenSpy = vi.spyOn(component, 'onModalOpen');
        selectSvgSheetSpy = vi.spyOn(component, 'onSvgSheetSelect');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `selectedEditionComplex` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToBe(component.selectedEditionComplex(), null);
        });

        it('... should have signal `editionReportData` to hold null', () => {
            expectToBe(isSignal(component.editionReportData), true);

            expectToBe(component.editionReportData(), null);
        });

        it('... should have signal `sourceListData` to hold null', () => {
            expectToBe(isSignal(component.sourceListData), true);

            expectToBe(component.sourceListData(), null);
        });

        it('... should have signal `sourceDescriptionListData` to hold null', () => {
            expectToBe(isSignal(component.sourceDescriptionListData), true);

            expectToBe(component.sourceDescriptionListData(), null);
        });

        it('... should have signal `sourceEvaluationListData` to hold null', () => {
            expectToBe(isSignal(component.sourceEvaluationListData), true);

            expectToBe(component.sourceEvaluationListData(), null);
        });

        it('... should have signal `textcriticsListData` to hold null', () => {
            expectToBe(isSignal(component.textcriticsListData), true);

            expectToBe(component.textcriticsListData(), null);
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

            describe('on error', () => {
                const expectedError = { status: 404, statusText: 'got Error' };

                beforeEach(async () => {
                    // Return an error for the report data observable
                    reportDataResult$ = observableThrowError(() => expectedError);
                    editionStateService.updateSelectedEditionComplex(expectedOtherEditionComplex);

                    await detectChangesOnPush(fixture);
                });

                it('... should not contain report view or TwelveToneSpinnerComponent, but one AlertErrorComponent (stubbed)', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 0, 0);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                    getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 1, 1);
                });

                it('... should pass down error object to AlertErrorComponent', () => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(
                        AlertErrorStubComponent
                    ) as AlertErrorStubComponent;

                    expectToEqual(alertErrorCmp.errorObject, expectedError);
                });
            });

            describe('on loading', () => {
                it('... should contain TwelveToneSpinnerComponent (before any data has emitted)', async () => {
                    reportDataResult$ = NEVER;
                    editionStateService.updateSelectedEditionComplex(expectedOtherEditionComplex);

                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                });
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the service setting the complex
            reportDataResult$ = observableOf(expectedEditionReportData);
            editionStateService.updateSelectedEditionComplex(expectedEditionComplex);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedEditionComplex` to hold the expected complex', () => {
            expectToEqual(component.selectedEditionComplex(), expectedEditionComplex);
        });

        it('... should have signal `editionReportData` to hold the expected data', () => {
            expectToEqual(component.editionReportData(), expectedEditionReportData);
        });

        it('... should have signal `sourceListData` to hold the expected data', () => {
            expectToEqual(component.sourceListData(), expectedSourceListData);
        });

        it('... should have signal `sourceDescriptionListData` to hold the expected data', () => {
            expectToEqual(component.sourceDescriptionListData(), expectedSourceDescriptionListData);
        });

        it('... should have signal `sourceEvaluationListData` to hold the expected data', () => {
            expectToEqual(component.sourceEvaluationListData(), expectedSourceEvaluationListData);
        });

        it('... should have signal `textcriticsListData` to hold the expected data', () => {
            expectToEqual(component.textcriticsListData(), expectedTextcriticsListData);
        });

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

                expectToEqual(textcriticsCmp.textcriticsListData, expectedTextcriticsListData);
            });

            describe('on error', () => {
                const expectedError = { status: 404, statusText: 'got Error' };

                beforeEach(async () => {
                    // Return an error for the report data observable
                    reportDataResult$ = observableThrowError(() => expectedError);
                    editionStateService.updateSelectedEditionComplex(expectedOtherEditionComplex);

                    await detectChangesOnPush(fixture);
                });

                it('... should not contain report view or TwelveToneSpinnerComponent, but one AlertErrorComponent (stubbed)', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 0, 0);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                    getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 1, 1);
                });

                it('... should pass down error object to AlertErrorComponent', () => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(
                        AlertErrorStubComponent
                    ) as AlertErrorStubComponent;

                    expectToEqual(alertErrorCmp.errorObject, expectedError);
                });
            });
        });

        describe('#editionReportData()', () => {
            it('... should have signal `editionReportData` to hold the expected data', () => {
                expectToBe(isSignal(component.editionReportData), true);

                expectToEqual(component.editionReportData(), expectedEditionReportData);
            });

            it('... should have got `selectedEditionComplex` from editionStateService', () => {
                expectToEqual(component.selectedEditionComplex(), expectedEditionComplex);
            });

            it('... should have got `editionReportData` from editionDataService', () => {
                expectSpyCall(editionDataServiceGetEditionReportDataSpy, 1);
            });

            it('... should hold null, but set no errorObject if selectedEditionComplex is null', async () => {
                // Update selected edition complex to trigger the signal
                editionStateService.updateSelectedEditionComplex(null);
                await detectChangesOnPush(fixture);

                expect(component.editionReportData()).toBeNull();
                expectToEqual(component.errorObject, null);
            });

            it('... should hold null and set errorObject if switchMap fails', async () => {
                const expectedError = { status: 404, statusText: 'error' };

                // Return an error for the report data observable
                reportDataResult$ = observableThrowError(() => expectedError);

                // Update selected edition complex to trigger the signal
                editionStateService.updateSelectedEditionComplex(expectedOtherEditionComplex);
                await detectChangesOnPush(fixture);

                expect(component.editionReportData()).toBeUndefined();
                expectToEqual(component.errorObject, expectedError);
            });
        });

        describe('METHODS', () => {
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

                it('... should open modal with given id', async () => {
                    component.onModalOpen(expectedModalSnippet);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                    expectSpyCall(modalOpenSpy, 1, expectedModalSnippet);

                    const otherSnippet = 'otherSnippet';
                    component.onModalOpen(otherSnippet);
                    await detectChangesOnPush(fixture);

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

                            const expectedReportIds = {
                                complexId: expectedComplexId,
                                fragmentId: expectedReportFragment,
                            };

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

                            const expectedReportIds = {
                                complexId: expectedComplexId,
                                fragmentId: expectedReportFragment,
                            };

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

                            const expectedReportIds = {
                                complexId: expectedComplexId,
                                fragmentId: expectedReportFragment,
                            };

                            evaluationCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                            expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                        });
                    });
                });

                it('... should call `_navigateWithComplexId()` method with correct parameters', async () => {
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };
                    const expectedReportRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                    const expectedNavigationExtras = {
                        fragment: expectedReportIds.fragmentId,
                    };

                    component.onReportFragmentNavigate(expectedReportIds);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });

                describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                    it('... fragment id is undefined', async () => {
                        const expectedReportIds = { complexId: expectedComplexId, fragmentId: undefined };
                        const expectedReportRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                        const expectedNavigationExtras = {
                            fragment: '',
                        };

                        component.onReportFragmentNavigate(expectedReportIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedReportIds.complexId,
                            expectedReportRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... fragment id is null', async () => {
                        const expectedReportIds = { complexId: expectedComplexId, fragmentId: null };
                        const expectedReportRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                        const expectedNavigationExtras = {
                            fragment: '',
                        };

                        component.onReportFragmentNavigate(expectedReportIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedReportIds.complexId,
                            expectedReportRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... fragment id is empty string', async () => {
                        const expectedReportIds = { complexId: expectedComplexId, fragmentId: '' };
                        const expectedReportRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                        const expectedNavigationExtras = {
                            fragment: '',
                        };

                        component.onReportFragmentNavigate(expectedReportIds);
                        await detectChangesOnPush(fixture);

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

                it('... should call `_navigateWithComplexId()` method with correct parameters', async () => {
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedReportFragment };
                    const expectedSheetsRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: expectedSheetIds.sheetId },
                    };

                    component.onSvgSheetSelect(expectedSheetIds);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetsRoute,
                        expectedNavigationExtras,
                    ]);
                });

                describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                    it('... fragment id is undefined', async () => {
                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: undefined };
                        const expectedSheetsRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedSheetIds.complexId,
                            expectedSheetsRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... fragment id is null', async () => {
                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: null };
                        const expectedSheetsRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedSheetIds.complexId,
                            expectedSheetsRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... fragment id is empty string', async () => {
                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: '' };
                        const expectedSheetsRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedSheetIds.complexId,
                            expectedSheetsRoute,
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should call `_navigateWithComplexId()` method with undefined complex id if', () => {
                    it('... introIds are undefined', async () => {
                        const expectedSheetIds = undefined;

                        const expectedSheetsRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedSheetsRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... introIds are null', async () => {
                        const expectedSheetIds = null;

                        const expectedSheetsRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedSheetsRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... fragment id is empty string', async () => {
                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: '' };
                        const expectedSheetsRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedSheetIds.complexId,
                            expectedSheetsRoute,
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
                    it('... complex id is undefined', async () => {
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = 'targetRoute';
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        await detectChangesOnPush(fixture);

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

                    it('... complex id is null', async () => {
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = 'targetRoute';
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(null, expectedTargetRoute, expectedNavigationExtras);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            null,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... complex id is empty string', async () => {
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = 'targetRoute';
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId('', expectedTargetRoute, expectedNavigationExtras);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, ['', expectedTargetRoute, expectedNavigationExtras]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... complex id is equal to the current complex id', async () => {
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = 'targetRoute';
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            expectedEditionComplex.complexId.route.replace('/', ''),
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        await detectChangesOnPush(fixture);

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
                    it('... complex id is given and not equal to the current complex id', async () => {
                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                        const expectedTargetRoute = 'targetRoute';
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        await detectChangesOnPush(fixture);

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
                        it('... with a given report fragment', async () => {
                            const expectedComplexRoute = expectedEditionComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                            const expectedNavigationExtras = { fragment: expectedReportFragment };

                            (component as any)._navigateWithComplexId(
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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

                        it('... without a given report fragment', async () => {
                            const expectedComplexRoute = expectedEditionComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                            const expectedNavigationExtras = { fragment: '' };

                            (component as any)._navigateWithComplexId(
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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
                        it('... with a given sheet id', async () => {
                            const expectedComplexRoute = expectedEditionComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                            const expectedNavigationExtras = { queryParams: { id: expectedSvgSheet.id } };

                            (component as any)._navigateWithComplexId(
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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

                        it('... without a given sheet id', async () => {
                            const expectedComplexRoute = expectedEditionComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                            const expectedNavigationExtras = { queryParams: { id: '' } };

                            (component as any)._navigateWithComplexId(
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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

                    describe('... should navigate to series overview if selectedComplex is null', () => {
                        let expectedRSeriesRoute: string;
                        beforeEach(() => {
                            expectedRSeriesRoute = '/edition/series';
                            editionStateService.updateSelectedEditionComplex(null);
                        });

                        it('... with a given sheet id', async () => {
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                            const expectedNavigationExtras = { queryParams: { id: '' } };

                            (component as any)._navigateWithComplexId(
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

                            expectSpyCall(navigateWithComplexIdSpy, 1, [
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras,
                            ]);
                            expectSpyCall(navigationSpy, 1, [
                                [expectedRSeriesRoute, expectedTargetRoute],
                                expectedNavigationExtras,
                            ]);
                        });

                        it('... with a given report fragment', async () => {
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                            const expectedNavigationExtras = { fragment: expectedReportFragment };

                            (component as any)._navigateWithComplexId(
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

                            expectSpyCall(navigateWithComplexIdSpy, 1, [
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras,
                            ]);
                            expectSpyCall(navigationSpy, 1, [
                                [expectedRSeriesRoute, expectedTargetRoute],
                                expectedNavigationExtras,
                            ]);
                        });
                    });
                });

                describe('... with the current edition complex id given', () => {
                    describe('... should navigate within same complex to a given report route', () => {
                        it('... with a given report fragment', async () => {
                            const expectedComplexRoute = expectedEditionComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                            const expectedNavigationExtras = { fragment: expectedReportFragment };

                            (component as any)._navigateWithComplexId(
                                expectedComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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

                        it('... without a given report fragment', async () => {
                            const expectedComplexRoute = expectedEditionComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                            const expectedNavigationExtras = { fragment: '' };

                            (component as any)._navigateWithComplexId(
                                expectedComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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
                        it('... with a given sheet id', async () => {
                            const expectedComplexRoute = expectedEditionComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                            const expectedNavigationExtras = { queryParams: { id: expectedSvgSheet.id } };

                            (component as any)._navigateWithComplexId(
                                expectedComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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

                        it('... without a given sheet id', async () => {
                            const expectedComplexRoute = expectedEditionComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                            const expectedNavigationExtras = { queryParams: { id: '' } };

                            (component as any)._navigateWithComplexId(
                                expectedComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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
                        it('... with a given report fragment', async () => {
                            const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                            const expectedNavigationExtras = { fragment: expectedReportFragment };

                            (component as any)._navigateWithComplexId(
                                expectedNextComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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

                        it('... without a given report fragment', async () => {
                            const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                            const expectedNavigationExtras = { fragment: '' };

                            (component as any)._navigateWithComplexId(
                                expectedNextComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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
                        it('... with a given sheet id', async () => {
                            const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                            const expectedNavigationExtras = { queryParams: { id: expectedSvgSheet.id } };

                            (component as any)._navigateWithComplexId(
                                expectedNextComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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

                        it('... without a given sheet id', async () => {
                            const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                            const expectedNavigationExtras = { queryParams: { id: '' } };

                            (component as any)._navigateWithComplexId(
                                expectedNextComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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
});
