import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { lastValueFrom, Observable, of as observableOf, ReplaySubject } from 'rxjs';
import Spy = jasmine.Spy;

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
    @Output() languageChangeRequest = new EventEmitter<number>();
}

describe('EditionPrefaceComponent (DONE)', () => {
    let component: EditionPrefaceComponent;
    let fixture: ComponentFixture<EditionPrefaceComponent>;
    let compDe: DebugElement;

    let getGlyphSpy: Spy;
    let setLanguageSpy: Spy;
    let editionDataServiceGetPrefaceDataSpy: Spy;
    let editionGlyphServiceGetGlyphSpy: Spy;
    let editionStateServiceUpdateIsPrefaceViewSpy: Spy;
    let editionStateServiceClearIsPrefaceViewSpy: Spy;

    let mockEditionStateService: Partial<EditionStateService>;
    let mockEditionGlyphService: Partial<EditionGlyphService>;
    let mockEditionDataService: Partial<EditionDataService>;
    let mockIsPrefaceViewSubject: ReplaySubject<boolean>;

    let expectedPrefaceData: PrefaceList;
    let expectedCurrentLanguage: number;

    beforeEach(async () => {
        mockIsPrefaceViewSubject = new ReplaySubject<boolean>(1);

        mockEditionDataService = {
            getEditionPrefaceData: (): Observable<PrefaceList> => observableOf(expectedPrefaceData),
        };

        mockEditionGlyphService = {
            getGlyph: (): string => 'glyphString',
        };

        mockEditionStateService = {
            updateIsPrefaceView: (isView: boolean): void => mockIsPrefaceViewSubject.next(isView),
            clearIsPrefaceView: (): void => mockIsPrefaceViewSubject.next(null),
        };

        await TestBed.configureTestingModule({
            declarations: [CompileHtmlComponent, EditionPrefaceComponent, LanguageSwitcherStubComponent],
            providers: [
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionGlyphService, useValue: mockEditionGlyphService },
                { provide: EditionStateService, useValue: mockEditionStateService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionPrefaceComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockEditionDataService = TestBed.inject(EditionDataService);
        mockEditionGlyphService = TestBed.inject(EditionGlyphService);
        mockEditionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedPrefaceData = JSON.parse(JSON.stringify(mockEditionData.mockPrefaceData));
        expectedCurrentLanguage = 0;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        getGlyphSpy = spyOn(component, 'getGlyph').and.callThrough();
        setLanguageSpy = spyOn(component, 'setLanguage').and.callThrough();

        editionDataServiceGetPrefaceDataSpy = spyOn(mockEditionDataService, 'getEditionPrefaceData').and.callThrough();
        editionGlyphServiceGetGlyphSpy = spyOn(mockEditionGlyphService, 'getGlyph').and.callThrough();
        editionStateServiceUpdateIsPrefaceViewSpy = spyOn(
            mockEditionStateService,
            'updateIsPrefaceView'
        ).and.callThrough();
        editionStateServiceClearIsPrefaceViewSpy = spyOn(
            mockEditionStateService,
            'clearIsPrefaceView'
        ).and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `prefaceData$`', () => {
            expect(component.prefaceData$).toBeUndefined();
        });

        it('... should have `currentLanguage` = 0', () => {
            expectToBe(component.currentLanguage, expectedCurrentLanguage);
        });

        it('... should have `ref`', () => {
            expectToEqual(component.ref, component);
        });

        it('... should not have called EditionDataService', () => {
            expectSpyCall(editionDataServiceGetPrefaceDataSpy, 0);
        });
        it('... should not have called EditionGlyphService', () => {
            expectSpyCall(editionGlyphServiceGetGlyphSpy, 0);
        });

        it('... should not have called EditionStateService', () => {
            expectSpyCall(editionStateServiceUpdateIsPrefaceViewSpy, 0);
        });

        describe('VIEW', () => {
            it('... should contain no outer div.row (yet)', () => {
                getAndExpectDebugElementByCss(compDe, 'div.row', 0, 0);
            });

            it('... should not contain language switcher component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, LanguageSwitcherStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have updated IsPrefaceViewFlag (via EditionStateService)', () => {
            expectSpyCall(editionStateServiceUpdateIsPrefaceViewSpy, 1, true);
        });

        it('... should have called EditionDataService', () => {
            expectSpyCall(editionDataServiceGetPrefaceDataSpy, 1);
        });

        it('... should have prefaceData$', waitForAsync(() => {
            expectAsync(lastValueFrom(component.prefaceData$)).toBeResolved();
            expectAsync(lastValueFrom(component.prefaceData$)).toBeResolvedTo(expectedPrefaceData);
        }));

        describe('VIEW', () => {
            it('... should contain 1 outer div.awg-preface-view', () => {
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

            it('... should contain as many preface paragraph elements in div.awg-preface-view as content items in preview data (german)', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 1, 1);

                getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-preface-para',
                    expectedPrefaceData.preface[0].content.length,
                    expectedPrefaceData.preface[0].content.length
                );
            });

            it('... should contain as many preface paragraph elements in div.awg-preface-view as content items in preview data (english)', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 1, 1);

                getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-preface-para',
                    expectedPrefaceData.preface[1].content.length,
                    expectedPrefaceData.preface[1].content.length
                );
            });
        });

        describe('#getGlyph()', () => {
            it('... should have a method `getGlyph`', () => {
                expect(component.getGlyph).toBeDefined();
            });

            it('... should trigger on change detection', () => {
                expectSpyCall(getGlyphSpy, 1);

                detectChangesOnPush(fixture);

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
                const switcherDes = getAndExpectDebugElementByDirective(compDe, LanguageSwitcherStubComponent, 1, 1);
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

        describe('#ngOnDestroy()', () => {
            it('... should have cleared isPrefaceView$ on destroy (via EditionStateService)', () => {
                component.ngOnDestroy();

                expectSpyCall(editionStateServiceClearIsPrefaceViewSpy, 1);
            });
        });
    });
});
