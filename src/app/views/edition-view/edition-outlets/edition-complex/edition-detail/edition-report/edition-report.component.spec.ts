import {
    Component,
    DebugElement,
    inject as inject_1,
    Input,
    isSignal,
    NgModule,
    signal,
    WritableSignal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { AlertErrorStubComponent, TwelveToneSpinnerStubComponent } from '@testing/component-stubs';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { createMockViewData } from '@testing/edition-data-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterOutletStubComponent } from '@testing/router-stubs';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import {
    EditionComplex,
    SourceDescriptionList,
    SourceEvaluationList,
    SourceList,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import {
    EditionDataAssetsError,
    EditionViewData,
    EditionViewDataContent,
} from '@awg-views/edition-view/models/edition-data.model';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionReportComponent } from './edition-report.component';

// Mock components

@Component({
    selector: 'awg-source-list',
    template: '',
    standalone: false,
})
class SourceListStubComponent {
    @Input()
    sourceListData: SourceList;
}

@Component({
    selector: 'awg-source-description',
    template: '',
    standalone: false,
})
class SourceDescriptionStubComponent {
    @Input()
    sourceDescriptionListData: SourceDescriptionList;
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
}

@Component({
    selector: 'awg-textcritics-list',
    template: '',
    standalone: false,
})
export class TextcriticsListStubComponent {
    @Input()
    textcriticsListData: TextcriticsList;
}

describe('EditionReportComponent', () => {
    let component: EditionReportComponent;
    let fixture: ComponentFixture<EditionReportComponent>;
    let compDe: DebugElement;

    let editionStateService: EditionStateService;

    let mockViewDataSignal: WritableSignal<EditionViewData<'report'>>;
    let expectedViewDataContent: EditionViewDataContent<'report'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'report'>;
    let expectedSourceListData: SourceList;
    let expectedSourceDescriptionListData: SourceDescriptionList;
    let expectedSourceEvaluationListData: SourceEvaluationList;
    let expectedTextcriticsListData: TextcriticsList;
    let expectedComplex: EditionComplex;
    let expectedComplexId: string;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor() {
            const config = inject_1(NgbConfig);

            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(async () => {
        // Mock services
        expectedDefaultViewDataContent = {
            sourceListData: new SourceList(),
            sourceDescriptionData: new SourceDescriptionList(),
            sourceEvaluationData: new SourceEvaluationList(),
            textcriticsData: new TextcriticsList(),
        };
        mockViewDataSignal = signal(createMockViewData(expectedDefaultViewDataContent));

        await TestBed.configureTestingModule({
            imports: [
                AlertErrorStubComponent,
                CompileHtmlDirective,
                TwelveToneSpinnerStubComponent,
                NgbAccordionWithConfigModule,
            ],
            declarations: [
                EditionReportComponent,
                SourceListStubComponent,
                SourceDescriptionStubComponent,
                SourceEvaluationStubComponent,
                TextcriticsListStubComponent,
                RouterOutletStubComponent,
            ],
            providers: [{ provide: EditionViewService, useValue: { reportViewData: mockViewDataSignal.asReadonly() } }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedSourceListData = structuredClone(mockEditionData.mockSourceListData);
        expectedSourceDescriptionListData = structuredClone(mockEditionData.mockSourceDescriptionListData);
        expectedSourceEvaluationListData = structuredClone(mockEditionData.mockSourceEvaluationListData);
        expectedTextcriticsListData = structuredClone(mockEditionData.mockTextcriticsListData);

        expectedComplexId = 'op12';
        expectedComplex = EditionStateHelper.getComplex(expectedComplexId);

        // Create component fixture
        fixture = TestBed.createComponent(EditionReportComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `selectedEditionComplex` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToBe(component.selectedEditionComplex(), null);
        });

        it('... should have signal `viewData` to hold the default fallback data', () => {
            expectToBe(isSignal(component.viewData), true);

            expectToEqual(component.viewData(), createMockViewData(expectedDefaultViewDataContent));
        });

        describe('VIEW', () => {
            it('... should contain one outer `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain no AlertErrorComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 0, 0);
            });

            it('... should contain no TwelveToneSpinnerComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);
            });

            it('... should contain no div.accordion yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);
            });

            it('... should contain no source list component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 0, 0);
            });

            it('... should contain no source description component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceDescriptionStubComponent, 0, 0);
            });

            it('... should contain no source evaluation component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceEvaluationStubComponent, 0, 0);
            });

            it('... should contain no textcritics list component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, TextcriticsListStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the service setting the complex
            editionStateService.updateSelectedEditionComplex(expectedComplex);
            expectedViewDataContent = {
                sourceListData: expectedSourceListData,
                sourceDescriptionData: expectedSourceDescriptionListData,
                sourceEvaluationData: expectedSourceEvaluationListData,
                textcriticsData: expectedTextcriticsListData,
            };
            mockViewDataSignal.set(
                createMockViewData(expectedViewDataContent, {
                    isLoading: false,
                    error: null,
                })
            );

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedEditionComplex` to hold the expected complex', () => {
            expectToEqual(component.selectedEditionComplex(), expectedComplex);
        });

        it('... should have signal `viewData` to hold the expected data', () => {
            expectToEqual(component.viewData(), createMockViewData(expectedViewDataContent));
        });

        describe('VIEW', () => {
            describe('on error', () => {
                const expectedErrorObject: EditionDataAssetsError = {
                    key: 'textcritics',
                    error: { status: 404, statusText: 'Data not found' },
                };

                beforeEach(async () => {
                    // Mock error state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: false,
                            error: expectedErrorObject,
                        })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should not contain report view or spinner, but one AlertErrorComponent (stubbed)', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                    getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-report-view', 0, 0);
                    getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 1, 1);
                });

                it('... should pass down error object to AlertErrorComponent', () => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(
                        AlertErrorStubComponent
                    ) as AlertErrorStubComponent;

                    expectToEqual(alertErrorCmp.errorObject(), expectedErrorObject);
                });
            });

            describe('on loading', () => {
                beforeEach(async () => {
                    // Mock loading state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: true,
                            error: null,
                        })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should not contain sheets view or alert, but one TwelveToneSpinnerComponent (stubbed)', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                });

                it('... should have default spinnerText on TwelveToneSpinnerComponent', () => {
                    const spinnerDes = getAndExpectDebugElementByDirective(
                        compDe,
                        TwelveToneSpinnerStubComponent,
                        1,
                        1
                    );
                    const spinnerCmp = spinnerDes[0].injector.get(
                        TwelveToneSpinnerStubComponent
                    ) as TwelveToneSpinnerStubComponent;

                    expectToBe(spinnerCmp.spinnerText(), 'loading');
                });
            });

            describe('on view data available', () => {
                beforeEach(async () => {
                    // Mock data state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: false,
                            error: null,
                        })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should contain one div.awg-edition-report-view', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 1, 1);
                });

                describe('... source list', () => {
                    let divDes: DebugElement[];

                    beforeEach(() => {
                        const viewDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 1, 1);

                        divDes = getAndExpectDebugElementByCss(viewDes[0], 'div#awg-source-list', 1, 1);
                    });

                    it('... should contain one button in div.awg-source-list', () => {
                        getAndExpectDebugElementByCss(divDes[0], 'button', 1, 1);
                    });

                    it('... should display button label', () => {
                        const buttonDes = getAndExpectDebugElementByCss(divDes[0], 'button', 1, 1);
                        const buttonEl = buttonDes[0].nativeElement as HTMLButtonElement;

                        expectToBe(buttonEl.textContent?.trim(), component.titles.sourceList);
                    });

                    it('... should contain one source list component (stubbed)', () => {
                        getAndExpectDebugElementByDirective(divDes[0], SourceListStubComponent, 1, 1);
                    });

                    it('... should pass down sourceListData to SourceListComponent', () => {
                        const sourceListDes = getAndExpectDebugElementByDirective(
                            divDes[0],
                            SourceListStubComponent,
                            1,
                            1
                        );
                        const sourceListCmp = sourceListDes[0].injector.get(
                            SourceListStubComponent
                        ) as SourceListStubComponent;

                        expectToEqual(sourceListCmp.sourceListData, expectedSourceListData);
                    });
                });

                describe('... source description', () => {
                    let divDes: DebugElement[];

                    beforeEach(() => {
                        const viewDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 1, 1);

                        divDes = getAndExpectDebugElementByCss(viewDes[0], 'div#awg-source-desc', 1, 1);
                    });

                    it('... should contain one button in div.awg-source-desc', () => {
                        getAndExpectDebugElementByCss(divDes[0], 'button', 1, 1);
                    });

                    it('... should display button label', () => {
                        const buttonDes = getAndExpectDebugElementByCss(divDes[0], 'button', 1, 1);
                        const buttonEl = buttonDes[0].nativeElement as HTMLButtonElement;

                        expectToBe(buttonEl.textContent?.trim(), component.titles.sourceDescription);
                    });

                    it('... should contain one source description component (stubbed)', () => {
                        getAndExpectDebugElementByDirective(compDe, SourceDescriptionStubComponent, 1, 1);
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
                });

                describe('... source evaluation', () => {
                    let divDes: DebugElement[];

                    beforeEach(() => {
                        const viewDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 1, 1);

                        divDes = getAndExpectDebugElementByCss(viewDes[0], 'div#awg-source-evaluation', 1, 1);
                    });

                    it('... should contain one button in div.awg-source-evaluation', () => {
                        getAndExpectDebugElementByCss(divDes[0], 'button', 1, 1);
                    });

                    it('... should display button label', () => {
                        const buttonDes = getAndExpectDebugElementByCss(divDes[0], 'button', 1, 1);
                        const buttonEl = buttonDes[0].nativeElement as HTMLButtonElement;

                        expectToBe(buttonEl.textContent?.trim(), component.titles.sourceEvaluation);
                    });

                    it('... should contain one source evaluation component (stubbed)', () => {
                        getAndExpectDebugElementByDirective(compDe, SourceEvaluationStubComponent, 1, 1);
                    });

                    it('... should pass down sourceEvaluationListData and complex to SourceEvaluationComponent', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        expectToEqual(evaluationCmp.sourceEvaluationListData, expectedSourceEvaluationListData);
                        expectToEqual(evaluationCmp.editionComplex, expectedComplex);
                    });
                });

                describe('... textcritics list', () => {
                    let divDes: DebugElement[];

                    beforeEach(() => {
                        const viewDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 1, 1);

                        divDes = getAndExpectDebugElementByCss(viewDes[0], 'div#awg-tka-panel', 1, 1);
                    });

                    it('... should contain one button in div.awg-tka-panel', () => {
                        getAndExpectDebugElementByCss(divDes[0], 'button', 1, 1);
                    });

                    it('... should display button label', () => {
                        const buttonDes = getAndExpectDebugElementByCss(divDes[0], 'button', 1, 1);
                        const buttonEl = buttonDes[0].nativeElement as HTMLButtonElement;

                        expectToBe(buttonEl.textContent?.trim(), component.titles.tka);
                    });

                    it('... should contain one textcritics list component (stubbed)', () => {
                        getAndExpectDebugElementByDirective(compDe, TextcriticsListStubComponent, 1, 1);
                    });

                    it('... should pass down textcriticsListData to TextcriticsListComponent', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListStubComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListStubComponent
                        ) as TextcriticsListStubComponent;

                        expectToEqual(textcriticsCmp.textcriticsListData, expectedTextcriticsListData);
                    });
                });
            });
        });
    });
});
