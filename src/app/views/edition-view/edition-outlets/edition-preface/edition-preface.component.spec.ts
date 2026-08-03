import { DebugElement, isSignal, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import {
    AlertErrorStubComponent,
    LanguageSwitcherStubComponent,
    TwelveToneSpinnerStubComponent,
} from '@testing/component-stubs';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { createMockViewData } from '@testing/edition-data-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { LanguageId } from '@awg-shared/language-switcher/language.model';

import {
    EditionDataAssetsError,
    EditionViewData,
    EditionViewDataContent,
} from '@awg-views/edition-view/models/edition-data.model';
import { PrefaceList } from '@awg-views/edition-view/models/preface.model';
import { EditionGlyphService } from '@awg-views/edition-view/services';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionPrefaceComponent } from './edition-preface.component';

describe('EditionPrefaceComponent (DONE)', () => {
    let component: EditionPrefaceComponent;
    let fixture: ComponentFixture<EditionPrefaceComponent>;
    let compDe: DebugElement;

    let mockEditionGlyphService: Partial<EditionGlyphService>;

    let getGlyphSpy: Spy;
    let editionGlyphServiceGetGlyphSpy: Spy;

    let mockViewDataSignal: WritableSignal<EditionViewData<'preface'>>;
    let expectedViewDataContent: EditionViewDataContent<'preface'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'preface'>;
    let expectedPrefaceData: PrefaceList;
    let expectedSelectedLanguage: LanguageId;

    beforeEach(async () => {
        // Mock services
        expectedDefaultViewDataContent = { prefaceData: new PrefaceList() };
        mockViewDataSignal = signal(createMockViewData(expectedDefaultViewDataContent));

        mockEditionGlyphService = {
            getGlyph: (): string => 'glyphString',
        };

        await TestBed.configureTestingModule({
            imports: [AlertErrorStubComponent, LanguageSwitcherStubComponent, TwelveToneSpinnerStubComponent],
            declarations: [EditionPrefaceComponent, CompileHtmlComponent],
            providers: [
                { provide: EditionViewService, useValue: { prefaceViewData: mockViewDataSignal.asReadonly() } },
                { provide: EditionGlyphService, useValue: mockEditionGlyphService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Service spies
        editionGlyphServiceGetGlyphSpy = vi.spyOn(mockEditionGlyphService, 'getGlyph');

        // Test data
        expectedSelectedLanguage = LanguageId.DE;
        expectedPrefaceData = structuredClone(mockEditionData.mockPrefaceData);

        // Create component fixture
        fixture = TestBed.createComponent(EditionPrefaceComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        getGlyphSpy = vi.spyOn(component, 'getGlyph');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `viewData` to hold the default fallback data', () => {
            expectToBe(isSignal(component.viewData), true);

            expectToEqual(component.viewData(), createMockViewData(expectedDefaultViewDataContent));
        });

        it('... should have signal `selectedLanguage` to hold the default language (DE)', () => {
            expectToBe(isSignal(component.selectedLanguage), true);

            expectToBe(component.selectedLanguage(), expectedSelectedLanguage);
        });

        it('... should have `ref`', () => {
            expectToEqual(component.ref, component);
        });

        it('... should not have called EditionGlyphService', () => {
            expectSpyCall(editionGlyphServiceGetGlyphSpy, 0);
        });

        describe('VIEW', () => {
            it('... should contain no AlertErrorComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
            });

            it('... should contain no TwelveToneSpinnerComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 0, 0);
            });

            it('... should contain no outer div.awg-preface-view yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 0, 0);
            });

            it('... should contain no LanguageSwitcherComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, LanguageSwitcherStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set mock view data signal to expected data state
            expectedViewDataContent = { prefaceData: expectedPrefaceData };
            mockViewDataSignal.set(
                createMockViewData(expectedViewDataContent, {
                    isLoading: false,
                    error: null,
                })
            );

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `viewData` to hold the expected data', () => {
            expectToEqual(component.viewData(), createMockViewData(expectedViewDataContent));
        });

        it('... should have called EditionGlyphService', () => {
            expectSpyCall(editionGlyphServiceGetGlyphSpy, 1);
        });

        describe('VIEW', () => {
            describe('on error', () => {
                const expectedErrorObject: EditionDataAssetsError = {
                    key: 'preface',
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

                it('... should not contain preface view or spinner, but one AlertErrorComponent (stubbed)', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 0, 0);
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

                it('... should not contain preface view or alert, but one TwelveToneSpinnerComponent (stubbed)', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 0, 0);
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

                it('... should contain one outer div.awg-preface-view', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 1, 1);
                });

                it('... should contain one LanguageSwitcherComponent (stubbed) in div.awg-preface-view', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 1, 1);

                    getAndExpectDebugElementByDirective(divDes[0], LanguageSwitcherStubComponent, 1, 1);
                });

                it('... should pass down `selectedLanguage` to LanguageSwitcherComponent', () => {
                    const switcherDes = getAndExpectDebugElementByDirective(
                        compDe,
                        LanguageSwitcherStubComponent,
                        1,
                        1
                    );
                    const switcherCmp = switcherDes[0].injector.get(
                        LanguageSwitcherStubComponent
                    ) as LanguageSwitcherStubComponent;

                    expectToEqual(switcherCmp.selectedLanguage(), expectedSelectedLanguage);
                });

                it('... should update `selectedLanguage` when LanguageSwitcherComponent emits a change', () => {
                    const switcherDes = getAndExpectDebugElementByDirective(
                        compDe,
                        LanguageSwitcherStubComponent,
                        1,
                        1
                    );

                    expectToBe(component.selectedLanguage(), LanguageId.DE);

                    switcherDes[0].triggerEventHandler('selectedLanguageChange', LanguageId.EN);

                    fixture.detectChanges();

                    expectToBe(component.selectedLanguage(), LanguageId.EN);
                });

                it('... should contain as many preface block elements in div.awg-preface-view as content items in preview data (german)', () => {
                    // Div debug element
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 1, 1);

                    getAndExpectDebugElementByCss(
                        divDes[0],
                        'div.awg-edition-preface-block',
                        expectedPrefaceData.preface[0].content.length,
                        expectedPrefaceData.preface[0].content.length
                    );
                });

                it('... should contain as many preface block elements in div.awg-preface-view as content items in preview data (english)', () => {
                    // Div debug element
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 1, 1);

                    getAndExpectDebugElementByCss(
                        divDes[0],
                        'div.awg-edition-preface-block',
                        expectedPrefaceData.preface[1].content.length,
                        expectedPrefaceData.preface[1].content.length
                    );
                });
            });
        });

        describe('METHODS', () => {
            describe('#getGlyph()', () => {
                it('... should have a method `getGlyph`', () => {
                    expect(component.getGlyph).toBeDefined();
                });

                it('... should trigger on change detection', async () => {
                    expectSpyCall(getGlyphSpy, 1);

                    await detectChangesOnPush(fixture);

                    expectSpyCall(getGlyphSpy, 2);
                });

                it('... should call `getGlyphs` method from EditionGlyphService with correct glyph string', () => {
                    expectSpyCall(editionGlyphServiceGetGlyphSpy, 1);

                    component.getGlyph('[bb]');

                    expectSpyCall(editionGlyphServiceGetGlyphSpy, 2, '[bb]');
                });

                it('... should return the glyph string from EditionGlyphService', () => {
                    const result = component.getGlyph('[bb]');

                    expectToBe(result, 'glyphString');
                });
            });
        });
    });
});
