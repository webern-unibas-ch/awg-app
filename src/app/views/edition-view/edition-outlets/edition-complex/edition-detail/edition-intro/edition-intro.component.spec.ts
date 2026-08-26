import { Component, DebugElement, DOCUMENT, Input, isSignal, model, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AlertErrorStubComponent, TwelveToneSpinnerStubComponent } from '@testing/component-stubs';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { createMockViewData } from '@testing/edition-data-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
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
    IntroBlock,
    IntroList,
} from '@awg-views/edition-view/models';
import { EditionDataAssetsError, EditionViewDataContent } from '@awg-views/edition-view/models/edition-data.model';
import { EditionStateService } from '@awg-views/edition-view/services';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionIntroComponent } from './edition-intro.component';

// Mock components
@Component({
    selector: 'awg-edition-intro-content',
    template: '',
    standalone: false,
})
class EditionIntroContentStubComponent {
    @Input()
    introBlockContent: IntroBlock[] = [];
    @Input()
    notesLabel = '';
}

@Component({
    selector: 'awg-edition-intro-nav',
    template: '',
    standalone: false,
})
class EditionIntroNavStubComponent {
    @Input()
    introBlockContent: IntroBlock[] = [];
    @Input()
    notesLabel = '';
    selectedLanguage = model.required<LanguageId>();
}

@Component({
    selector: 'awg-edition-intro-partial-disclaimer',
    template: '',
    standalone: false,
})
class EditionIntroPartialDisclaimerStubComponent {
    @Input()
    editionComplex: EditionComplex | null = null;
}

@Component({
    selector: 'awg-edition-intro-placeholder',
    template: '',
    standalone: false,
})
class EditionIntroPlaceholderStubComponent {
    @Input()
    editionComplex: EditionComplex | null = null;
    @Input()
    editionLabel = '';
}

describe('IntroComponent (DONE)', () => {
    let component: EditionIntroComponent;
    let fixture: ComponentFixture<EditionIntroComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

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

    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    beforeEach(async () => {
        // Mock services
        expectedDefaultViewDataContent = { introData: new IntroList() };
        mockViewDataSignal = signal(createMockViewData(expectedDefaultViewDataContent));

        await TestBed.configureTestingModule({
            imports: [AlertErrorStubComponent, TwelveToneSpinnerStubComponent, RouterModule],
            declarations: [
                EditionIntroComponent,
                EditionIntroContentStubComponent,
                EditionIntroPartialDisclaimerStubComponent,
                EditionIntroPlaceholderStubComponent,
                EditionIntroNavStubComponent,
            ],
            providers: [{ provide: EditionViewService, useValue: { introViewData: mockViewDataSignal.asReadonly() } }],
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

        it('... should have `editionRouteConstants`', () => {
            expectToEqual(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        describe('VIEW', () => {
            it('... should contain an outer `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
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
            it('... should render nothing if viewData is not available', async () => {
                mockViewDataSignal.set(null as any);

                await detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 0, 0);
                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);
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

                        it('... should pass down `editionComplex` to EditionIntroPartialDisclaimerComponent', () => {
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
            describe('#_initScrollListener()', () => {
                it('... should have a method `_initScrollListener`', () => {
                    expect(component['_initScrollListener']).toBeDefined();
                });

                it('.... should trigger `_onIntroScroll` method when window is scrolled', () => {
                    const onIntroScrollSpy = vi.spyOn(component, '_onIntroScroll' as any);

                    component['_initScrollListener']();

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
                    expect(component['_onIntroScroll']).toBeDefined();
                });

                describe('... should do nothing if', () => {
                    it('... event is not of type `scroll`', () => {
                        component['_onIntroScroll'](new Event('click'));

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

                    component['_onIntroScroll'](new Event('scroll'));

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

                    component['_onIntroScroll'](new Event('scroll'));

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
        });
    });
});
