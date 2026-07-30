import { Component, DebugElement, EventEmitter, Input, isSignal, Output, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

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
import { EditionViewData, EditionViewDataContent } from '@awg-views/edition-view/models/edition-data.model';
import { PrefaceList } from '@awg-views/edition-view/models/preface.model';
import { EditionGlyphService, EditionStateService } from '@awg-views/edition-view/services';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionPrefaceComponent } from './edition-preface.component';

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
    selector: 'awg-language-switcher',
    template: '',
    standalone: false,
})
class LanguageSwitcherStubComponent {
    @Input()
    currentLanguage: number;
    @Output()
    languageChangeRequest = new EventEmitter<number>();
}

@Component({
    selector: 'awg-twelve-tone-spinner',
    template: '',
    standalone: false,
})
class TwelveToneSpinnerStubComponent {}

describe('EditionPrefaceComponent (DONE)', () => {
    let component: EditionPrefaceComponent;
    let fixture: ComponentFixture<EditionPrefaceComponent>;
    let compDe: DebugElement;

    let mockEditionGlyphService: Partial<EditionGlyphService>;
    let editionStateService: EditionStateService;

    let getGlyphSpy: Spy;
    let setLanguageSpy: Spy;
    let editionGlyphServiceGetGlyphSpy: Spy;
    let editionStateServiceUpdateIsPrefaceViewSpy: Spy;

    let mockViewDataSignal: WritableSignal<EditionViewData<'preface'>>;
    let expectedViewDataContent: EditionViewDataContent<'preface'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'preface'>;
    let expectedPrefaceData: PrefaceList;
    let expectedCurrentLanguage: number;

    beforeEach(async () => {
        // Mock services
        expectedDefaultViewDataContent = { prefaceData: new PrefaceList() };
        mockViewDataSignal = signal(createMockViewData(expectedDefaultViewDataContent));

        mockEditionGlyphService = {
            getGlyph: (): string => 'glyphString',
        };

        await TestBed.configureTestingModule({
            declarations: [
                EditionPrefaceComponent,
                AlertErrorStubComponent,
                CompileHtmlComponent,
                LanguageSwitcherStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
            providers: [
                { provide: EditionViewService, useValue: { prefaceViewData: mockViewDataSignal.asReadonly() } },
                { provide: EditionGlyphService, useValue: mockEditionGlyphService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        editionGlyphServiceGetGlyphSpy = vi.spyOn(mockEditionGlyphService, 'getGlyph');
        editionStateServiceUpdateIsPrefaceViewSpy = vi.spyOn(editionStateService, 'updateIsPrefaceView');

        // Test data
        expectedCurrentLanguage = 0;
        expectedPrefaceData = structuredClone(mockEditionData.mockPrefaceData);

        // Create component fixture
        fixture = TestBed.createComponent(EditionPrefaceComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        getGlyphSpy = vi.spyOn(component, 'getGlyph');
        setLanguageSpy = vi.spyOn(component, 'setLanguage');
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

        it('... should have `currentLanguage` = 0', () => {
            expectToBe(component.currentLanguage, expectedCurrentLanguage);
        });

        it('... should have `ref`', () => {
            expectToEqual(component.ref, component);
        });

        it('... should not have called EditionGlyphService', () => {
            expectSpyCall(editionGlyphServiceGetGlyphSpy, 0);
        });

        it('... should have called `EditionStateService` and updated `isPrefaceView` to true', () => {
            expectSpyCall(editionStateServiceUpdateIsPrefaceViewSpy, 1, true);

            expectToBe(editionStateService.isPrefaceView(), true);
        });

        it('... should reset `isPrefaceView` to false on destroy', () => {
            expectSpyCall(editionStateServiceUpdateIsPrefaceViewSpy, 1, true);

            fixture.destroy();

            expectSpyCall(editionStateServiceUpdateIsPrefaceViewSpy, 2, false);
            expectToBe(editionStateService.isPrefaceView(), false);
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

            it('... should contain no language switcher component (stubbed)', () => {
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

        describe('VIEW', () => {
            describe('on error', () => {
                const expectedErrorObject = { status: 404, statusText: 'error' };

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

                    expectToEqual(alertErrorCmp.errorObject, expectedErrorObject);
                });
            });

            describe('on loading', () => {
                it('... should not contain preface view or alert, but one TwelveToneSpinnerComponent (stubbed)', async () => {
                    // Mock loading state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, { isLoading: true, error: null })
                    );

                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
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

                it('... should contain one language switcher component (stubbed) in div.awg-preface-view', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 1, 1);

                    getAndExpectDebugElementByDirective(divDes[0], LanguageSwitcherStubComponent, 1, 1);
                });

                it('... should pass down `currentLanguage` to language switcher component', () => {
                    const switcherDes = getAndExpectDebugElementByDirective(
                        compDe,
                        LanguageSwitcherStubComponent,
                        1,
                        1
                    );
                    const switcherCmp = switcherDes[0].injector.get(
                        LanguageSwitcherStubComponent
                    ) as LanguageSwitcherStubComponent;

                    expectToEqual(switcherCmp.currentLanguage, expectedCurrentLanguage);
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

            describe('#setLanguage()', () => {
                it('... should have a method `setLanguage`', () => {
                    expect(component.setLanguage).toBeDefined();
                });

                it('... should trigger on event from LanguageSwitcherComponent', () => {
                    const switcherDes = getAndExpectDebugElementByDirective(
                        compDe,
                        LanguageSwitcherStubComponent,
                        1,
                        1
                    );
                    const switcherCmp = switcherDes[0].injector.get(
                        LanguageSwitcherStubComponent
                    ) as LanguageSwitcherStubComponent;

                    // Language = 0
                    switcherCmp.languageChangeRequest.emit(0);

                    expectSpyCall(setLanguageSpy, 1, 0);

                    // Language = 1
                    switcherCmp.languageChangeRequest.emit(1);

                    expectSpyCall(setLanguageSpy, 2, 1);
                });

                it('... should set the currentLanguage to 0 when called with 0', () => {
                    component.setLanguage(0);

                    expectToBe(component.currentLanguage, 0);
                });

                it('... should set the currentLanguage to 1 when called with 1', () => {
                    component.setLanguage(1);

                    expectToBe(component.currentLanguage, 1);
                });
            });
        });
    });
});
