import { DebugElement, isSignal, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

import { AlertErrorComponent } from '@awg-shared/alert-error/alert-error.component';
import { LanguageId } from '@awg-shared/language-switcher/language.model';
import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';
import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import { EditionDataAssetsError, EditionViewDataContent } from '@awg-views/edition-view/models/edition-data.model';
import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models/edition-outline.model';
import { IntroList } from '@awg-views/edition-view/models/intro.model';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionIntroContentComponent } from './edition-intro-content/edition-intro-content.component';
import { EditionIntroNavComponent } from './edition-intro-nav/edition-intro-nav.component';
import { EditionIntroPartialDisclaimerComponent } from './edition-intro-partial-disclaimer/edition-intro-partial-disclaimer.component';
import { EditionIntroPlaceholderComponent } from './edition-intro-placeholder/edition-intro-placeholder.component';
import { EditionIntroScrollDirective } from './edition-intro-scroll/edition-intro-scroll.directive';
import { EditionIntroComponent } from './edition-intro.component';

describe('IntroComponent (DONE)', () => {
    let component: EditionIntroComponent;
    let fixture: ComponentFixture<EditionIntroComponent>;
    let compDe: DebugElement;

    let editionStateService: EditionStateService;

    let mockViewDataSignal: WritableSignal<any>;
    let expectedViewDataContent: EditionViewDataContent<'intro'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'intro'>;
    let expectedIntroSectionData: IntroList;
    let expectedIntroSectionFilteredData: IntroList;
    let expectedSelectedLanguage: LanguageId;
    let expectedDefaultNotesSectionLabel: string;

    let expectedComplexId: string;
    let expectedComplex: EditionComplex;
    let expectedSeries: EditionOutlineSeries;
    let expectedSection: EditionOutlineSection;

    beforeEach(async () => {
        // Mock services
        expectedDefaultViewDataContent = { introData: new IntroList() };
        mockViewDataSignal = signal(createMockViewData(expectedDefaultViewDataContent));

        await TestBed.configureTestingModule({
            imports: [
                AlertErrorComponent,
                EditionIntroComponent,
                EditionIntroContentComponent,
                EditionIntroNavComponent,
                EditionIntroPartialDisclaimerComponent,
                EditionIntroPlaceholderComponent,
                EditionIntroScrollDirective,
                TwelveToneSpinnerComponent,
            ],
            providers: [
                provideRouter([]),
                { provide: EditionViewService, useValue: { introViewData: mockViewDataSignal.asReadonly() } },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedIntroSectionData = structuredClone(mockEditionData.mockIntroSectionData);
        expectedIntroSectionFilteredData = structuredClone(mockEditionData.mockIntroSectionFilteredData);

        expectedSelectedLanguage = LanguageId.DE;
        expectedDefaultNotesSectionLabel = 'Anmerkungen';

        expectedComplexId = 'op12';
        expectedComplex = EditionStateHelper.getComplex(expectedComplexId);
        expectedSeries = EditionStateHelper.getSeries('1');
        expectedSection = EditionStateHelper.getSection('1', '5');

        // Create component fixture
        fixture = TestBed.createComponent(EditionIntroComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
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

        describe('VIEW', () => {
            it('... should contain one outer `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain no AlertErrorComponent', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], AlertErrorComponent, 0, 0);
            });

            it('... should contain no TwelveToneSpinnerComponent', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerComponent, 0, 0);
            });

            it('... should contain no div.awg-edition-intro-view yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);
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
            it('... should render nothing if viewData is not available', async () => {
                mockViewDataSignal.set(null as any);

                await detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], AlertErrorComponent, 0, 0);
                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerComponent, 0, 0);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-intro-view', 0, 0);
            });

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

                it('... should not contain intro view or spinner, but one AlertErrorComponent', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 1, 1);
                });

                it('... should pass down error object to AlertErrorComponent', () => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(AlertErrorComponent) as AlertErrorComponent;

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
                    getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 1, 1);
                });

                it('... should have default spinnerText on TwelveToneSpinnerComponent', () => {
                    const spinnerDes = getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 1, 1);
                    const spinnerCmp = spinnerDes[0].injector.get(
                        TwelveToneSpinnerComponent
                    ) as TwelveToneSpinnerComponent;

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
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                });

                it('... should contain one EditionIntroScrollDirective', () => {
                    getAndExpectDebugElementByDirective(compDe, EditionIntroScrollDirective, 1, 1);
                });

                it('... should contain one div.row in div.awg-edition-intro-view', () => {
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

                    it('... should contain one EditionIntroPlaceholderComponent', async () => {
                        const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                        getAndExpectDebugElementByDirective(divDes[0], EditionIntroPlaceholderComponent, 1, 1);
                    });

                    it('... should pass down `editionComplex` to EditionIntroPlaceholderComponent', async () => {
                        const editionIntroPlaceholderDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionIntroPlaceholderComponent,
                            1,
                            1
                        );
                        const editionIntroPlaceholderCmp = editionIntroPlaceholderDes[0].injector.get(
                            EditionIntroPlaceholderComponent
                        ) as EditionIntroPlaceholderComponent;

                        expectToEqual(editionIntroPlaceholderCmp.editionComplex(), expectedComplex);
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

                        it('... should contain one EditionIntroPartialDisclaimerComponent', () => {
                            const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                            getAndExpectDebugElementByDirective(
                                divDes[0],
                                EditionIntroPartialDisclaimerComponent,
                                1,
                                1
                            );
                        });

                        it('... should pass down `editionComplex` to EditionIntroPartialDisclaimerComponent', () => {
                            const editionIntroPartialDisclaimerDes = getAndExpectDebugElementByDirective(
                                compDe,
                                EditionIntroPartialDisclaimerComponent,
                                1,
                                1
                            );
                            const editionIntroPartialDisclaimerCmp = editionIntroPartialDisclaimerDes[0].injector.get(
                                EditionIntroPartialDisclaimerComponent
                            ) as EditionIntroPartialDisclaimerComponent;

                            expectToEqual(editionIntroPartialDisclaimerCmp.editionComplex(), expectedComplex);
                        });

                        it('... should contain one EditionIntroContentComponent', () => {
                            const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                            getAndExpectDebugElementByDirective(divDes[0], EditionIntroContentComponent, 1, 1);
                        });

                        it('... should pass down filtered `introBlockContent` and `notesLabel` to EditionIntroContentComponent', () => {
                            const editionIntroContentDes = getAndExpectDebugElementByDirective(
                                compDe,
                                EditionIntroContentComponent,
                                1,
                                1
                            );
                            const editionIntroContentCmp = editionIntroContentDes[0].injector.get(
                                EditionIntroContentComponent
                            ) as EditionIntroContentComponent;

                            expectToEqual(
                                editionIntroContentCmp.introBlockContent(),
                                expectedIntroSectionFilteredData.intro[expectedSelectedLanguage].content
                            );
                            expectToEqual(editionIntroContentCmp.notesLabel(), expectedDefaultNotesSectionLabel);
                        });

                        it('... should contain one EditionIntroNavComponent (stubbed)', () => {
                            const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                            getAndExpectDebugElementByDirective(divDes[0], EditionIntroNavComponent, 1, 1);
                        });

                        it('... should pass down filtered `introBlockContent`, `notesLabel` and `selectedLanguage` to EditionIntroNavComponent', () => {
                            const editionIntroNavDes = getAndExpectDebugElementByDirective(
                                compDe,
                                EditionIntroNavComponent,
                                1,
                                1
                            );
                            const editionIntroNavCmp = editionIntroNavDes[0].injector.get(
                                EditionIntroNavComponent
                            ) as EditionIntroNavComponent;

                            expectToEqual(
                                editionIntroNavCmp.introBlockContent(),
                                expectedIntroSectionFilteredData.intro[expectedSelectedLanguage].content
                            );
                            expectToEqual(editionIntroNavCmp.notesLabel(), expectedDefaultNotesSectionLabel);
                            expectToEqual(editionIntroNavCmp.selectedLanguage(), expectedSelectedLanguage);
                        });

                        it('... should update `selectedLanguage` when EditionIntroNavComponent emits new value', async () => {
                            const editionIntroNavDes = getAndExpectDebugElementByDirective(
                                compDe,
                                EditionIntroNavComponent,
                                1,
                                1
                            );
                            const editionIntroNavCmp = editionIntroNavDes[0].injector.get(
                                EditionIntroNavComponent
                            ) as EditionIntroNavComponent;

                            const newLanguage = LanguageId.EN;
                            expect(component.selectedLanguage()).not.toBe(newLanguage);
                            expect(editionIntroNavCmp.selectedLanguage()).not.toBe(newLanguage);

                            editionIntroNavCmp.selectedLanguage.set(newLanguage);

                            await detectChangesOnPush(fixture);

                            expectToBe(component.selectedLanguage(), newLanguage);
                            expectToBe(editionIntroNavCmp.selectedLanguage(), newLanguage);
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

                        it('... should not contain an edition intro partial disclaimer component', () => {
                            const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                            getAndExpectDebugElementByDirective(
                                divDes[0],
                                EditionIntroPartialDisclaimerComponent,
                                0,
                                0
                            );
                        });

                        it('... should contain one EditionIntroContentComponent', () => {
                            const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                            getAndExpectDebugElementByDirective(divDes[0], EditionIntroContentComponent, 1, 1);
                        });

                        it('... should pass down unfiltered `introBlockContent` and `notesLabel` to EditionIntroContentComponent', () => {
                            const editionIntroContentDes = getAndExpectDebugElementByDirective(
                                compDe,
                                EditionIntroContentComponent,
                                1,
                                1
                            );
                            const editionIntroContentCmp = editionIntroContentDes[0].injector.get(
                                EditionIntroContentComponent
                            ) as EditionIntroContentComponent;

                            expectToEqual(
                                editionIntroContentCmp.introBlockContent(),
                                expectedIntroSectionData.intro[expectedSelectedLanguage].content
                            );
                            expectToEqual(editionIntroContentCmp.notesLabel(), expectedDefaultNotesSectionLabel);
                        });

                        it('... should contain one EditionIntroNavComponent', () => {
                            const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                            getAndExpectDebugElementByDirective(divDes[0], EditionIntroNavComponent, 1, 1);
                        });

                        it('... should pass down unfiltered `introBlockContent`, `notesLabel` and `selectedLanguage` to EditionIntroNavComponent', () => {
                            const editionIntroNavDes = getAndExpectDebugElementByDirective(
                                compDe,
                                EditionIntroNavComponent,
                                1,
                                1
                            );
                            const editionIntroNavCmp = editionIntroNavDes[0].injector.get(
                                EditionIntroNavComponent
                            ) as EditionIntroNavComponent;

                            expectToEqual(
                                editionIntroNavCmp.introBlockContent(),
                                expectedIntroSectionData.intro[expectedSelectedLanguage].content
                            );
                            expectToEqual(editionIntroNavCmp.notesLabel(), expectedDefaultNotesSectionLabel);
                            expectToEqual(editionIntroNavCmp.selectedLanguage(), expectedSelectedLanguage);
                        });

                        it('... should update `selectedLanguage` when EditionIntroNavComponent emits new value', async () => {
                            const editionIntroNavDes = getAndExpectDebugElementByDirective(
                                compDe,
                                EditionIntroNavComponent,
                                1,
                                1
                            );
                            const editionIntroNavCmp = editionIntroNavDes[0].injector.get(
                                EditionIntroNavComponent
                            ) as EditionIntroNavComponent;

                            const newLanguage = LanguageId.EN;
                            expect(component.selectedLanguage()).not.toBe(newLanguage);
                            expect(editionIntroNavCmp.selectedLanguage()).not.toBe(newLanguage);

                            editionIntroNavCmp.selectedLanguage.set(newLanguage);

                            await detectChangesOnPush(fixture);

                            expectToBe(component.selectedLanguage(), newLanguage);
                            expectToBe(editionIntroNavCmp.selectedLanguage(), newLanguage);
                        });
                    });
                });
            });
        });
    });
});
