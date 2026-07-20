import { Component, DebugElement, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { Observable, ReplaySubject } from 'rxjs';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { LoadingService } from '@awg-shared/loading/loading.service';
import { PrefaceList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionGlyphService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionPrefaceComponent } from './edition-preface.component';

// Mock components
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

    let getGlyphSpy: Spy;
    let setLanguageSpy: Spy;
    let editionDataServiceGetPrefaceDataSpy: Spy;
    let editionGlyphServiceGetGlyphSpy: Spy;

    let mockIsLoadingSignal: WritableSignal<boolean>;
    let mockLoadingService: Partial<LoadingService>;
    let mockEditionGlyphService: Partial<EditionGlyphService>;
    let mockEditionDataService: Partial<EditionDataService>;
    let mockPrefaceDataSubject: ReplaySubject<PrefaceList>;
    let editionStateService: EditionStateService;

    let expectedPrefaceData: PrefaceList;
    let expectedCurrentLanguage: number;

    beforeEach(async () => {
        mockPrefaceDataSubject = new ReplaySubject<PrefaceList>(1);

        mockEditionDataService = {
            getEditionPrefaceData: (): Observable<PrefaceList> => mockPrefaceDataSubject.asObservable(),
        };

        mockEditionGlyphService = {
            getGlyph: (): string => 'glyphString',
        };

        mockIsLoadingSignal = signal<boolean>(false);
        mockLoadingService = {
            isLoading: mockIsLoadingSignal.asReadonly(),
        };

        await TestBed.configureTestingModule({
            declarations: [
                CompileHtmlComponent,
                EditionPrefaceComponent,
                LanguageSwitcherStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
            providers: [
                EditionStateService,
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionGlyphService, useValue: mockEditionGlyphService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Set loading status before each test
        mockIsLoadingSignal.set(false);

        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        editionGlyphServiceGetGlyphSpy = vi.spyOn(mockEditionGlyphService, 'getGlyph');
        editionDataServiceGetPrefaceDataSpy = vi.spyOn(mockEditionDataService, 'getEditionPrefaceData');

        // Test data
        expectedPrefaceData = structuredClone(mockEditionData.mockPrefaceData);
        expectedCurrentLanguage = 0;

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
        it('... should have `prefaceData` (with initialValue = null)', () => {
            expectToBe(component.prefaceData(), null);
        });

        it('... should have `currentLanguage` = 0', () => {
            expectToBe(component.currentLanguage, expectedCurrentLanguage);
        });

        it('... should have `ref`', () => {
            expectToEqual(component.ref, component);
        });

        it('... should have `isLoading` (with value false)', () => {
            expectToBe(component.isLoading(), false);
        });

        it('... should have called EditionDataService (during signal initialization)', () => {
            expectSpyCall(editionDataServiceGetPrefaceDataSpy, 1);
        });
        it('... should not have called EditionGlyphService', () => {
            expectSpyCall(editionGlyphServiceGetGlyphSpy, 0);
        });

        it('... should not have called EditionStateService', () => {
            expectToBe(editionStateService.isPrefaceView(), false);
        });

        describe('VIEW', () => {
            it('... should contain no TwelveToneSpinnerComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 0, 0);
            });

            it('... should contain no outer div.row (yet)', () => {
                getAndExpectDebugElementByCss(compDe, 'div.row', 0, 0);
            });

            it('... should contain no language switcher component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, LanguageSwitcherStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the emission of preface data from the mock service
            mockPrefaceDataSubject.next(expectedPrefaceData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have updated IsPrefaceView (via EditionStateService)', () => {
            expectToBe(editionStateService.isPrefaceView(), true);
        });

        it('... should have called EditionDataService', () => {
            expectSpyCall(editionDataServiceGetPrefaceDataSpy, 1);
        });

        it('... should have updated `prefaceData`', () => {
            expectToEqual(component.prefaceData(), expectedPrefaceData);
        });

        describe('VIEW', () => {
            describe('on loading', () => {
                it('... should contain one TwelveToneSpinnerComponent (stubbed) if isLoading is true', async () => {
                    mockIsLoadingSignal.set(true);
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                });
            });

            it('... should contain one outer div.awg-preface-view', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 1, 1);
            });

            it('... should contain one language switcher component (stubbed) in div.awg-preface-view', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], LanguageSwitcherStubComponent, 1, 1);
            });

            it('... should pass down `currentLanguage` to language switcher component', () => {
                const switcherDes = getAndExpectDebugElementByDirective(compDe, LanguageSwitcherStubComponent, 1, 1);
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

        describe('#ngOnDestroy()', () => {
            it('... should have cleared isPrefaceView on destroy (via EditionStateService)', () => {
                component.ngOnDestroy();

                expectToBe(editionStateService.isPrefaceView(), false);
            });
        });
    });
});
