import {
    Component,
    DebugElement,
    DOCUMENT,
    EventEmitter,
    Input,
    isSignal,
    model,
    Output,
    signal,
    WritableSignal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { of as observableOf } from 'rxjs';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { AlertErrorStubComponent, TwelveToneSpinnerStubComponent } from '@testing/component-stubs';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { createMockViewData } from '@testing/edition-data-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { LanguageId } from '@awg-shared/language-switcher/language.model';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import {
    EditionComplex,
    EditionOutlineSection,
    EditionOutlineSeries,
    EditionSvgSheet,
    IntroBlock,
    IntroList,
} from '@awg-views/edition-view/models';
import { EditionDataAssetsError, EditionViewDataContent } from '@awg-views/edition-view/models/edition-data.model';
import { EditionStateService } from '@awg-views/edition-view/services';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionIntroComponent } from './edition-intro.component';

// Mock components
@Component({
    selector: 'awg-modal',
    template: '',
    standalone: false,
})
class ModalStubComponent {
    open(): void {}
}

@Component({
    selector: 'awg-edition-intro-content',
    template: '',
    standalone: false,
})
class EditionIntroContentStubComponent {
    @Input()
    introBlockContent: IntroBlock[];
    @Input()
    notesLabel: string;
    @Output()
    navigateToIntroFragmentRequest: EventEmitter<{
        complexId: string;
        fragmentId: string;
    }> = new EventEmitter();
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
    selector: 'awg-edition-intro-nav',
    template: '',
    standalone: false,
})
class EditionIntroNavStubComponent {
    @Input()
    introBlockContent: IntroBlock[];
    @Input()
    notesLabel: string;
    selectedLanguage = model.required<LanguageId>();
}

@Component({
    selector: 'awg-edition-intro-partial-disclaimer',
    template: '',
    standalone: false,
})
class EditionIntroPartialDisclaimerStubComponent {
    @Input()
    editionComplex: EditionComplex;
    @Input()
    editionLabel: string;
    @Input()
    editionRoute: string;
    @Input()
    seriesRoute: string;
    @Input()
    sectionRoute: string;
    @Input()
    introRoute: string;
}

@Component({
    selector: 'awg-edition-intro-placeholder',
    template: '',
    standalone: false,
})
class EditionIntroPlaceholderStubComponent {
    @Input()
    editionComplex: EditionComplex;
    @Input()
    editionLabel: string;
}

describe('IntroComponent (DONE)', () => {
    let component: EditionIntroComponent;
    let fixture: ComponentFixture<EditionIntroComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockRouter;

    let editionStateService: EditionStateService;

    let navigateWithComplexIdSpy: Spy;
    let navigationSpy: Spy;
    let openModalSpy: Spy;
    let onIntroFragmentNavigateSpy: Spy;
    let onModalOpenSpy: Spy;
    let onReportFragmentNavigateSpy: Spy;
    let onSvgSheetSelectSpy: Spy;

    let mockViewDataSignal: WritableSignal<any>;
    let expectedViewDataContent: EditionViewDataContent<'intro'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'intro'>;
    let expectedIntroSectionData: IntroList;
    let expectedIntroSectionFilteredData: IntroList;
    let expectedSelectedLanguage: LanguageId;
    let expectedDefaultNotesSectionLabel: string;
    let expectedComplex: EditionComplex;

    let expectedComplexBaseRoute: string;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedIntroFragment: string;
    let expectedReportFragment: string;
    let expectedModalSnippet: string;
    let expectedSeries: EditionOutlineSeries;
    let expectedSection: EditionOutlineSection;
    let expectedSvgSheet: EditionSvgSheet;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    beforeEach(async () => {
        // Mock router with spy object
        mockRouter = {
            url: '/test-url',
            events: observableOf(
                new NavigationEnd(0, 'http://localhost:4200/test-url', 'http://localhost:4200/test-url')
            ),
            navigate: vi.fn().mockName('Router.navigate'),
        };

        // Mock services
        expectedDefaultViewDataContent = { introData: new IntroList() };
        mockViewDataSignal = signal(createMockViewData(expectedDefaultViewDataContent));

        await TestBed.configureTestingModule({
            imports: [AlertErrorStubComponent, TwelveToneSpinnerStubComponent, NgbModalModule, RouterModule],
            declarations: [
                EditionIntroComponent,
                EditionIntroContentStubComponent,
                EditionIntroPartialDisclaimerStubComponent,
                EditionIntroPlaceholderStubComponent,
                EditionIntroNavStubComponent,
                ModalStubComponent,
            ],
            providers: [
                { provide: EditionViewService, useValue: { introViewData: mockViewDataSignal.asReadonly() } },
                { provide: Router, useValue: mockRouter },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);
        editionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedIntroSectionData = structuredClone(mockEditionData.mockIntroSectionData);
        expectedIntroSectionFilteredData = structuredClone(mockEditionData.mockIntroSectionFilteredData);

        expectedSelectedLanguage = LanguageId.DE;
        expectedDefaultNotesSectionLabel = 'Anmerkungen';

        expectedComplexId = 'op12';
        expectedComplexBaseRoute = `/edition/complex/${expectedComplexId}`;
        expectedComplex = EditionStateHelper.getComplex(expectedComplexId);
        expectedSeries = EditionStateHelper.getSeries('1');
        expectedSection = EditionStateHelper.getSection('1', '5');
        expectedNextComplexId = 'testComplex2';
        expectedIntroFragment = 'note-80';
        expectedReportFragment = 'source_A';
        expectedModalSnippet = structuredClone(mockEditionData.mockModalSnippet);
        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);

        // Create component fixture
        fixture = TestBed.createComponent(EditionIntroComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        navigateWithComplexIdSpy = vi.spyOn(component as any, '_navigateWithComplexId');
        navigationSpy = mockRouter.navigate as Mock;
        openModalSpy = vi.spyOn(component.modal, 'open');
        onIntroFragmentNavigateSpy = vi.spyOn(component, 'onIntroFragmentNavigate');
        onModalOpenSpy = vi.spyOn(component, 'onModalOpen');
        onReportFragmentNavigateSpy = vi.spyOn(component, 'onReportFragmentNavigate');
        onSvgSheetSelectSpy = vi.spyOn(component, 'onSvgSheetSelect');
    });

    afterEach(() => {
        // Clear mock stores after each test
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `selectedEditionComplex` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToEqual(component.selectedEditionComplex(), null);
        });

        it('... should have signal `viewData` to hold the default fallback data', () => {
            expectToBe(isSignal(component.viewData), true);

            expectToEqual(component.viewData(), createMockViewData(expectedDefaultViewDataContent));
        });

        it('... should have signal `selectedLanguage` to hold the default language (DE)', () => {
            expectToBe(isSignal(component.selectedLanguage), true);

            expectToBe(component.selectedLanguage(), expectedSelectedLanguage);
        });

        it('... should have computed signal `notesSectionLabel` to hold the default label', () => {
            expectToBe(isSignal(component.notesSectionLabel), true);

            expectToEqual(component.notesSectionLabel(), expectedDefaultNotesSectionLabel);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToEqual(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        describe('VIEW', () => {
            it('... should contain an outer `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain one modal component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ModalStubComponent, 1, 1);
            });

            it('... should contain no div.awg-edition-intro-view yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);
            });

            it('... should contain no edition intro partial disclaimer component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], EditionIntroPartialDisclaimerStubComponent, 0, 0);
            });

            it('... should contain no edition intro content component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], EditionIntroContentStubComponent, 0, 0);
            });

            it('... should contain no edition intro nav component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], EditionIntroNavStubComponent, 0, 0);
            });

            it('... should contain no edition intro empty component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], EditionIntroPlaceholderStubComponent, 0, 0);
            });

            it('... should contain no AlertErrorComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 0, 0);
            });

            it('... should contain no TwelveToneSpinnerComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the services returning the properties
            editionStateService.updateSelectedEditionSeries(expectedSeries);
            editionStateService.updateSelectedEditionSection(expectedSection);
            editionStateService.updateSelectedEditionComplex(expectedComplex);

            // Set mock view data signal to the expected data state
            expectedViewDataContent = { introData: expectedIntroSectionData };
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

        it('... should have signal `viewData` to hold the expected view data', () => {
            expectToEqual(component.viewData(), createMockViewData(expectedViewDataContent));
        });

        it('... should have re-computed signal `notesSectionLabel` to hold the expected label when `selectedLanguage` changes', () => {
            component.selectedLanguage.set(LanguageId.EN);

            expectToEqual(component.notesSectionLabel(), 'Notes');

            component.selectedLanguage.set(LanguageId.DE);

            expectToEqual(component.notesSectionLabel(), expectedDefaultNotesSectionLabel);
        });

        describe('VIEW', () => {
            describe('on error', () => {
                const expectedErrorObject: EditionDataAssetsError = {
                    key: 'intro',
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

                it('... should not contain intro view or spinner, but one AlertErrorComponent (stubbed)', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
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
                        createMockViewData(expectedViewDataContent, { isLoading: true, error: null })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should not contain intro view or alert, but one TwelveToneSpinnerComponent (stubbed)', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);
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
                    // Mock view data state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, { isLoading: false, error: null })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should contain one div.awg-edition-intro-view', () => {
                    // Div debug element
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                });

                it('... should contain one div.row in div.awg-edition-intro-view', () => {
                    // Div debug element
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);

                    getAndExpectDebugElementByCss(divDes[0], 'div.row', 1, 1);
                });

                describe('... if intro content is empty', () => {
                    beforeEach(async () => {
                        // Simulate the service setting an empty content array
                        const mockEmptySectionIntro: IntroList = {
                            intro: [
                                {
                                    id: 'empty-intro-id',
                                    content: [],
                                },
                            ],
                        };
                        mockViewDataSignal.set(
                            createMockViewData({ introData: mockEmptySectionIntro }, { isLoading: false, error: null })
                        );

                        await detectChangesOnPush(fixture);
                    });

                    it('... should contain one EditionIntroPlaceholderComponent (stubbed)', async () => {
                        const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                        getAndExpectDebugElementByDirective(divDes[0], EditionIntroPlaceholderStubComponent, 1, 1);
                    });

                    it('... should pass down `editionComplex` and `editionLabel` to EditionIntroPlaceholderComponent', async () => {
                        const editionIntroPlaceholderDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionIntroPlaceholderStubComponent,
                            1,
                            1
                        );
                        const editionIntroPlaceholderCmp = editionIntroPlaceholderDes[0].injector.get(
                            EditionIntroPlaceholderStubComponent
                        ) as EditionIntroPlaceholderStubComponent;

                        expectToEqual(editionIntroPlaceholderCmp.editionComplex, expectedComplex);
                        expectToEqual(
                            editionIntroPlaceholderCmp.editionLabel,
                            expectedEditionRouteConstants.EDITION.short
                        );
                    });
                });

                describe('... if intro content is given', () => {
                    describe('... with complex', () => {
                        beforeEach(async () => {
                            editionStateService.updateSelectedEditionComplex(expectedComplex);
                            const expectedFilteredViewDataContent = {
                                introData: expectedIntroSectionFilteredData,
                            };
                            mockViewDataSignal.set(
                                createMockViewData(expectedFilteredViewDataContent, { isLoading: false, error: null })
                            );

                            await detectChangesOnPush(fixture);
                        });

                        it('... should contain one EditionIntroPartialDisclaimerComponent (stubbed)', () => {
                            const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                            getAndExpectDebugElementByDirective(
                                divDes[0],
                                EditionIntroPartialDisclaimerStubComponent,
                                1,
                                1
                            );
                        });

                        it('... should pass down `editionComplex`, `editionLabel`, and routes to EditionIntroPartialDisclaimerComponent', () => {
                            const editionIntroPartialDisclaimerDes = getAndExpectDebugElementByDirective(
                                compDe,
                                EditionIntroPartialDisclaimerStubComponent,
                                1,
                                1
                            );
                            const editionIntroPartialDisclaimerCmp = editionIntroPartialDisclaimerDes[0].injector.get(
                                EditionIntroPartialDisclaimerStubComponent
                            ) as EditionIntroPartialDisclaimerStubComponent;

                            expectToEqual(editionIntroPartialDisclaimerCmp.editionComplex, expectedComplex);
                            expectToEqual(
                                editionIntroPartialDisclaimerCmp.editionLabel,
                                expectedEditionRouteConstants.EDITION.short
                            );
                            expectToEqual(
                                editionIntroPartialDisclaimerCmp.editionRoute,
                                expectedEditionRouteConstants.EDITION.route
                            );
                            expectToEqual(
                                editionIntroPartialDisclaimerCmp.seriesRoute,
                                expectedEditionRouteConstants.SERIES.route
                            );
                            expectToEqual(
                                editionIntroPartialDisclaimerCmp.sectionRoute,
                                expectedEditionRouteConstants.SECTION.route
                            );
                            expectToEqual(
                                editionIntroPartialDisclaimerCmp.introRoute,
                                expectedEditionRouteConstants.EDITION_INTRO.route
                            );
                        });

                        it('... should contain one EditionIntroContentComponent (stubbed)', () => {
                            const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                            getAndExpectDebugElementByDirective(divDes[0], EditionIntroContentStubComponent, 1, 1);
                        });

                        it('... should pass down filtered `introBlockContent` and `notesLabel` to EditionIntroContentComponent', () => {
                            const editionIntroContentDes = getAndExpectDebugElementByDirective(
                                compDe,
                                EditionIntroContentStubComponent,
                                1,
                                1
                            );
                            const editionIntroContentCmp = editionIntroContentDes[0].injector.get(
                                EditionIntroContentStubComponent
                            ) as EditionIntroContentStubComponent;

                            expectToEqual(
                                editionIntroContentCmp.introBlockContent,
                                expectedIntroSectionFilteredData.intro[expectedSelectedLanguage].content
                            );
                            expectToEqual(editionIntroContentCmp.notesLabel, expectedDefaultNotesSectionLabel);
                        });

                        it('... should contain one EditionIntroNavComponent (stubbed)', () => {
                            const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                            getAndExpectDebugElementByDirective(divDes[0], EditionIntroNavStubComponent, 1, 1);
                        });

                        it('... should pass down filtered `introBlockContent`, `notesLabel` and `selectedLanguage` to EditionIntroNavComponent', () => {
                            const editionIntroNavDes = getAndExpectDebugElementByDirective(
                                compDe,
                                EditionIntroNavStubComponent,
                                1,
                                1
                            );
                            const editionIntroNavCmp = editionIntroNavDes[0].injector.get(
                                EditionIntroNavStubComponent
                            ) as EditionIntroNavStubComponent;

                            expectToEqual(
                                editionIntroNavCmp.introBlockContent,
                                expectedIntroSectionFilteredData.intro[expectedSelectedLanguage].content
                            );
                            expectToEqual(editionIntroNavCmp.notesLabel, expectedDefaultNotesSectionLabel);
                            expectToEqual(editionIntroNavCmp.selectedLanguage(), expectedSelectedLanguage);
                        });
                    });

                    describe('... without complex', () => {
                        beforeEach(async () => {
                            editionStateService.updateSelectedEditionComplex(null);
                            mockViewDataSignal.set(
                                createMockViewData(expectedViewDataContent, { isLoading: false, error: null })
                            );

                            await detectChangesOnPush(fixture);
                        });

                        it('... should not contain an edition intro partial disclaimer component (stubbed)', () => {
                            const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                            getAndExpectDebugElementByDirective(
                                divDes[0],
                                EditionIntroPartialDisclaimerStubComponent,
                                0,
                                0
                            );
                        });

                        it('... should contain one EditionIntroContentComponent (stubbed)', () => {
                            const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                            getAndExpectDebugElementByDirective(divDes[0], EditionIntroContentStubComponent, 1, 1);
                        });

                        it('... should pass down unfiltered `introBlockContent` and `notesLabel` to EditionIntroContentComponent', () => {
                            const editionIntroContentDes = getAndExpectDebugElementByDirective(
                                compDe,
                                EditionIntroContentStubComponent,
                                1,
                                1
                            );
                            const editionIntroContentCmp = editionIntroContentDes[0].injector.get(
                                EditionIntroContentStubComponent
                            ) as EditionIntroContentStubComponent;

                            expectToEqual(
                                editionIntroContentCmp.introBlockContent,
                                expectedIntroSectionData.intro[expectedSelectedLanguage].content
                            );
                            expectToEqual(editionIntroContentCmp.notesLabel, expectedDefaultNotesSectionLabel);
                        });

                        it('... should contain one EditionIntroNavComponent (stubbed)', () => {
                            const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                            getAndExpectDebugElementByDirective(divDes[0], EditionIntroNavStubComponent, 1, 1);
                        });

                        it('... should pass down unfiltered `introBlockContent`, `notesLabel` and `selectedLanguage` to EditionIntroNavComponent', () => {
                            const editionIntroNavDes = getAndExpectDebugElementByDirective(
                                compDe,
                                EditionIntroNavStubComponent,
                                1,
                                1
                            );
                            const editionIntroNavCmp = editionIntroNavDes[0].injector.get(
                                EditionIntroNavStubComponent
                            ) as EditionIntroNavStubComponent;

                            expectToEqual(
                                editionIntroNavCmp.introBlockContent,
                                expectedIntroSectionData.intro[expectedSelectedLanguage].content
                            );
                            expectToEqual(editionIntroNavCmp.notesLabel, expectedDefaultNotesSectionLabel);
                            expectToEqual(editionIntroNavCmp.selectedLanguage(), expectedSelectedLanguage);
                        });
                    });
                });
            });
        });

        describe('METHODS', () => {
            describe('#onIntroFragmentNavigate()', () => {
                it('... should have a method `onIntroFragmentNavigate`', () => {
                    expect(component.onIntroFragmentNavigate).toBeDefined();
                });

                it('... should trigger on event from EditionIntroContentComponent', () => {
                    const editionIntroContentDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionIntroContentStubComponent,
                        1,
                        1
                    );
                    const editionIntroContentCmp = editionIntroContentDes[0].injector.get(
                        EditionIntroContentStubComponent
                    ) as EditionIntroContentStubComponent;

                    const expectedIntroIds = { complexId: expectedComplexId, fragmentId: expectedIntroFragment };

                    editionIntroContentCmp.navigateToIntroFragmentRequest.emit(expectedIntroIds);

                    expectSpyCall(onIntroFragmentNavigateSpy, 1, expectedIntroIds);
                });

                it('... should navigate (to same page) with correct parameters', async () => {
                    const expectedIntroIds = { complexId: expectedComplexId, fragmentId: expectedIntroFragment };
                    const expectedNavigationExtras = {
                        fragment: expectedIntroIds.fragmentId,
                    };

                    component.onIntroFragmentNavigate(expectedIntroIds);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(navigationSpy, 1, [[], expectedNavigationExtras]);
                });

                describe('... should navigate (to same page) with empty fragment id if', () => {
                    it('... fragment id is undefined', async () => {
                        const expectedIntroIds = { complexId: expectedComplexId, fragmentId: undefined };
                        const expectedNavigationExtras = {
                            fragment: '',
                        };

                        component.onIntroFragmentNavigate(expectedIntroIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigationSpy, 1, [[], expectedNavigationExtras]);
                    });

                    it('... fragment id is null', async () => {
                        const expectedIntroIds = { complexId: expectedComplexId, fragmentId: null };
                        const expectedNavigationExtras = {
                            fragment: '',
                        };

                        component.onIntroFragmentNavigate(expectedIntroIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigationSpy, 1, [[], expectedNavigationExtras]);
                    });

                    it('... fragment id is empty string', async () => {
                        const expectedIntroIds = { complexId: expectedComplexId, fragmentId: '' };
                        const expectedNavigationExtras = {
                            fragment: '',
                        };

                        component.onIntroFragmentNavigate(expectedIntroIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigationSpy, 1, [[], expectedNavigationExtras]);
                    });
                });

                describe('... should navigate (to same page) with undefined complex id if', () => {
                    it('... introIds are undefined', async () => {
                        const expectedIntroIds = undefined;
                        const expectedNavigationExtras = {
                            fragment: '',
                        };

                        component.onIntroFragmentNavigate(expectedIntroIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigationSpy, 1, [[], expectedNavigationExtras]);
                    });

                    it('... introIds are null', async () => {
                        const expectedIntroIds = null;
                        const expectedNavigationExtras = {
                            fragment: '',
                        };

                        component.onIntroFragmentNavigate(expectedIntroIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigationSpy, 1, [[], expectedNavigationExtras]);
                    });

                    it('... fragment id is empty string', async () => {
                        const expectedIntroIds = { complexId: expectedComplexId, fragmentId: '' };
                        const expectedNavigationExtras = {
                            fragment: '',
                        };

                        component.onIntroFragmentNavigate(expectedIntroIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigationSpy, 1, [[], expectedNavigationExtras]);
                    });
                });
            });

            describe('#onModalOpen()', () => {
                it('... should have a method `onModalOpen`', () => {
                    expect(component.onModalOpen).toBeDefined();
                });

                it('... should trigger on event from EditionIntroContentComponent', () => {
                    const editionIntroContentDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionIntroContentStubComponent,
                        1,
                        1
                    );
                    const editionIntroContentCmp = editionIntroContentDes[0].injector.get(
                        EditionIntroContentStubComponent
                    ) as EditionIntroContentStubComponent;

                    editionIntroContentCmp.openModalRequest.emit(expectedModalSnippet);

                    expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                });

                it('... should open modal with given id', async () => {
                    component.onModalOpen(expectedModalSnippet);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                    expectSpyCall(openModalSpy, 1, expectedModalSnippet);

                    const otherSnippet = 'otherSnippet';
                    component.onModalOpen(otherSnippet);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(onModalOpenSpy, 2, otherSnippet);
                    expectSpyCall(openModalSpy, 2, otherSnippet);
                });

                describe('... should not do anything if ', () => {
                    it('... id is undefined', () => {
                        component.onModalOpen(undefined);

                        expectSpyCall(onModalOpenSpy, 1);
                        expectSpyCall(openModalSpy, 0);
                    });

                    it('... id is null', () => {
                        component.onModalOpen(null);

                        expectSpyCall(onModalOpenSpy, 1);
                        expectSpyCall(openModalSpy, 0);
                    });

                    it('... id is empty string', () => {
                        component.onModalOpen('');

                        expectSpyCall(onModalOpenSpy, 1);
                        expectSpyCall(openModalSpy, 0);
                    });
                });
            });

            describe('#onReportFragmentNavigate()', () => {
                it('... should have a method `onReportFragmentNavigate`', () => {
                    expect(component.onReportFragmentNavigate).toBeDefined();
                });

                it('... should trigger on event from EditionIntroContentComponent', () => {
                    const editionIntroContentDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionIntroContentStubComponent,
                        1,
                        1
                    );
                    const editionIntroContentCmp = editionIntroContentDes[0].injector.get(
                        EditionIntroContentStubComponent
                    ) as EditionIntroContentStubComponent;

                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                    editionIntroContentCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                    expectSpyCall(onReportFragmentNavigateSpy, 1, expectedReportIds);
                });

                it('... should call `_navigateWithComplexId()` method with correct parameters', async () => {
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };
                    const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
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
                        const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
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
                        const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
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
                        const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
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

                describe('... should call `_navigateWithComplexId()` method with undefined complex id if', () => {
                    it('... introIds are undefined', async () => {
                        const expectedReportIds = undefined;
                        const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = {
                            fragment: '',
                        };

                        component.onReportFragmentNavigate(expectedReportIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedReportRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... introIds are null', async () => {
                        const expectedReportIds = null;
                        const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = {
                            fragment: '',
                        };

                        component.onReportFragmentNavigate(expectedReportIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedReportRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... fragment id is empty string', async () => {
                        const expectedReportIds = { complexId: expectedComplexId, fragmentId: '' };
                        const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
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

                it('... should trigger on event from EditionIntroContentComponent', () => {
                    const editionIntroContentDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionIntroContentStubComponent,
                        1,
                        1
                    );
                    const editionIntroContentCmp = editionIntroContentDes[0].injector.get(
                        EditionIntroContentStubComponent
                    ) as EditionIntroContentStubComponent;

                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };

                    editionIntroContentCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                    expectSpyCall(onSvgSheetSelectSpy, 1, expectedSheetIds);
                });

                it('... should call `_navigateWithComplexId()` method with correct parameters', async () => {
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedReportFragment };
                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: expectedSheetIds.sheetId },
                    };

                    component.onSvgSheetSelect(expectedSheetIds);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                    it('... fragment id is undefined', async () => {
                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: undefined };
                        const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedSheetIds.complexId,
                            expectedSheetRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... fragment id is null', async () => {
                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: null };
                        const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedSheetIds.complexId,
                            expectedSheetRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... fragment id is empty string', async () => {
                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: '' };
                        const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedSheetIds.complexId,
                            expectedSheetRoute,
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should call `_navigateWithComplexId()` method with undefined complex id if', () => {
                    it('... introIds are undefined', async () => {
                        const expectedSheetIds = undefined;
                        const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedSheetRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... introIds are null', async () => {
                        const expectedSheetIds = null;
                        const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedSheetRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... fragment id is empty string', async () => {
                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: '' };
                        const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedSheetIds.complexId,
                            expectedSheetRoute,
                            expectedNavigationExtras,
                        ]);
                    });
                });
            });

            describe('#_initScrollListener()', () => {
                it('... should have a method `_initScrollListener`', () => {
                    expect((component as any)._initScrollListener).toBeDefined();
                });

                it('.... should trigger `_onIntroScroll` method when window is scrolled', () => {
                    const onIntroScrollSpy = vi.spyOn(component as any, '_onIntroScroll');

                    (component as any)._initScrollListener();

                    window.dispatchEvent(new Event('scroll'));

                    expect(onIntroScrollSpy).toHaveBeenCalled();
                });
            });

            describe('#_onIntroScroll()', () => {
                let intro: HTMLDivElement;
                let navLink1: HTMLAnchorElement;
                let navLink2: HTMLAnchorElement;

                beforeEach(() => {
                    // Set up the DOM
                    intro = mockDocument.createElement('div');
                    intro.classList.add('awg-edition-intro');
                    mockDocument.body.appendChild(intro);

                    const introSection1 = mockDocument.createElement('div');
                    introSection1.classList.add('awg-edition-intro-section');
                    introSection1.id = 'section1';
                    introSection1.style.position = 'absolute'; // Needed to get a fixed scroll target
                    introSection1.style.top = '100px';
                    introSection1.style.height = '100px';
                    Object.defineProperty(introSection1, 'offsetTop', { value: 100, configurable: true });
                    Object.defineProperty(introSection1, 'offsetHeight', { value: 100, configurable: true });
                    intro.appendChild(introSection1);

                    const introSection2 = mockDocument.createElement('div');
                    introSection2.classList.add('awg-edition-intro-section');
                    introSection2.id = 'section2';
                    introSection2.style.position = 'absolute'; // Needed to get a fixed scroll target
                    introSection2.style.top = '300px';
                    introSection2.style.height = '100px';
                    Object.defineProperty(introSection2, 'offsetTop', { value: 300, configurable: true });
                    Object.defineProperty(introSection2, 'offsetHeight', { value: 100, configurable: true });
                    intro.appendChild(introSection2);

                    navLink1 = mockDocument.createElement('a');
                    navLink1.classList.add('awg-edition-intro-nav-link');
                    navLink1.href = '#section1';
                    intro.appendChild(navLink1);

                    navLink2 = mockDocument.createElement('a');
                    navLink2.classList.add('awg-edition-intro-nav-link');
                    navLink2.href = '#section2';
                    intro.appendChild(navLink2);

                    const screenSizeBy2 = mockDocument.documentElement.clientHeight * 2;
                    mockDocument.body.style.minHeight = screenSizeBy2 + 'px';
                });

                it('... should have a method `_onIntroScroll`', () => {
                    expect((component as any)._onIntroScroll).toBeDefined();
                });

                describe('... should do nothing if', () => {
                    it('... event is undefined', () => {
                        (component as any)._onIntroScroll(undefined);

                        expectToNotContain(navLink1.classList, 'active');
                        expectToNotContain(navLink2.classList, 'active');
                    });

                    it('... event is null', () => {
                        (component as any)._onIntroScroll(null);

                        expectToNotContain(navLink1.classList, 'active');
                        expectToNotContain(navLink2.classList, 'active');
                    });

                    it('... event is not of type `scroll`', () => {
                        (component as any)._onIntroScroll(new Event('click'));

                        expectToNotContain(navLink1.classList, 'active');
                        expectToNotContain(navLink2.classList, 'active');
                    });
                });

                it('... should update nav link classes based on scroll position (document.documentElement.scrollTop)', async () => {
                    // Spy on window.scrollTo
                    vi.spyOn(window, 'scrollTo').mockImplementation((...args: any[]) => {
                        const y: number = args.length === 1 && typeof args[0] === 'object' ? args[0].top : args[1];
                        // Mock the scroll position
                        Object.defineProperty(mockDocument.documentElement, 'scrollTop', { value: y, writable: true });
                    });

                    // Scroll to a specific position
                    window.scrollTo(0, 150);
                    window.dispatchEvent(new Event('scroll'));
                    await detectChangesOnPush(fixture);

                    (component as any)._onIntroScroll(new Event('scroll'));

                    expectToContain(navLink1.classList, 'active');
                    expectToNotContain(navLink2.classList, 'active');
                });

                it('... should update nav link classes based on scroll position (window.scrollY)', async () => {
                    // Spy on window.scrollTo
                    vi.spyOn(window, 'scrollTo').mockImplementation((...args: any[]) => {
                        const y: number = args.length === 1 && typeof args[0] === 'object' ? args[0].top : args[1];
                        // Mock the scroll position
                        Object.defineProperty(window, 'scrollY', { value: y, writable: true });
                    });

                    // Scroll to a specific position
                    window.scrollTo(0, 150);
                    window.dispatchEvent(new Event('scroll'));
                    await detectChangesOnPush(fixture);

                    (component as any)._onIntroScroll(new Event('scroll'));

                    expectToContain(navLink1.classList, 'active');
                    expectToNotContain(navLink2.classList, 'active');
                });

                afterEach(() => {
                    // Clean up the DOM
                    while (intro.firstChild) {
                        intro.removeChild(intro.firstChild);
                    }
                    mockDocument.body.removeChild(intro);
                });
            });

            describe('#_navigateWithComplexId()', () => {
                it('... should have a method `_navigateWithComplexId`', () => {
                    expect((component as any)._navigateWithComplexId).toBeDefined();
                });

                describe('... should navigate within same complex if', () => {
                    it('... complex id is undefined', async () => {
                        const expectedComplexRoute = expectedComplexBaseRoute;
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
                        const expectedComplexRoute = expectedComplexBaseRoute;
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
                        const expectedComplexRoute = expectedComplexBaseRoute;
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
                        const expectedComplexRoute = expectedComplexBaseRoute;
                        const expectedTargetRoute = 'targetRoute';
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

                describe('... with no edition complex id given', () => {
                    describe('... should navigate within same complex to a given intro route', () => {
                        it('... with a given intro fragment', async () => {
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                            const expectedNavigationExtras = { fragment: expectedIntroFragment };

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

                        it('... without a given intro fragment', async () => {
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
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

                    describe('... should navigate within same complex to a given report route', () => {
                        it('... with a given report fragment', async () => {
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
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
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
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
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
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
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
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
                });

                describe('... with the current edition complex id given', () => {
                    describe('... should navigate within same complex to a given intro route', () => {
                        it('... with a given intro fragment', async () => {
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                            const expectedNavigationExtras = { fragment: expectedIntroFragment };

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

                        it('... without a given intro fragment', async () => {
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
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

                    describe('... should navigate within same complex to a given report route', () => {
                        it('... with a given report fragment', async () => {
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
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
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
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
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
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
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
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
                    describe('... should navigate to a given intro route of another complex', () => {
                        it('... with a given intro fragment', async () => {
                            const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                            const expectedNavigationExtras = { fragment: expectedIntroFragment };

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

                        it('... without a given intro fragment', async () => {
                            const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
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

                    describe('... should navigate to a given report route of another complex', () => {
                        it('... with a given report fragment', async () => {
                            const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
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
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
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
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
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
                            const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
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
