import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';

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
import { EDITION_GLYPHS_DATA } from '@awg-views/edition-view/data';
import { PrefaceList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

import { EditionPrefaceComponent } from './edition-preface.component';

// Mock components
@Component({ selector: 'awg-language-switcher', template: '' })
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
    let editionServiceUpdateIsPrefaceViewSpy: Spy;
    let editionServiceClearIsPrefaceViewSpy: Spy;
    let editionDataServiceGetPrefaceDataSpy: Spy;

    let mockEditionService: Partial<EditionService>;
    let mockEditionDataService: Partial<EditionDataService>;
    let mockIsPrefaceViewSubject: ReplaySubject<boolean>;

    let expectedPrefaceData: PrefaceList;
    let expectedCurrentLanguage: number;

    beforeEach(async () => {
        mockIsPrefaceViewSubject = new ReplaySubject<boolean>(1);

        mockEditionService = {
            updateIsPrefaceView: (isView: boolean): void => mockIsPrefaceViewSubject.next(isView),
            clearIsPrefaceView: (): void => mockIsPrefaceViewSubject.next(null),
        };

        mockEditionDataService = {
            getEditionPrefaceData: (): Observable<PrefaceList> => observableOf(expectedPrefaceData),
        };

        await TestBed.configureTestingModule({
            declarations: [CompileHtmlComponent, EditionPrefaceComponent, LanguageSwitcherStubComponent],
            providers: [
                { provide: EditionService, useValue: mockEditionService },
                { provide: EditionDataService, useValue: mockEditionDataService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionPrefaceComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockEditionService = TestBed.inject(EditionService);
        mockEditionDataService = TestBed.inject(EditionDataService);

        // Test data
        expectedPrefaceData = JSON.parse(JSON.stringify(mockEditionData.mockPrefaceData));
        expectedCurrentLanguage = 0;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        getGlyphSpy = spyOn(component, 'getGlyph').and.callThrough();
        setLanguageSpy = spyOn(component, 'setLanguage').and.callThrough();
        editionServiceUpdateIsPrefaceViewSpy = spyOn(mockEditionService, 'updateIsPrefaceView').and.callThrough();
        editionServiceClearIsPrefaceViewSpy = spyOn(mockEditionService, 'clearIsPrefaceView').and.callThrough();
        editionDataServiceGetPrefaceDataSpy = spyOn(mockEditionDataService, 'getEditionPrefaceData').and.callThrough();
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

        it('... should have `GLYPHS`', () => {
            expectToEqual(component.GLYPHS, EDITION_GLYPHS_DATA);
        });

        it('... should have `ref`', () => {
            expectToEqual(component.ref, component);
        });

        it('... should not have called EditionService', () => {
            expectSpyCall(editionServiceUpdateIsPrefaceViewSpy, 0);
        });

        it('... should not have called EditionDataService', () => {
            expectSpyCall(editionDataServiceGetPrefaceDataSpy, 0);
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

        it('... should have updated IsPrefaceViewFlag (via EditionService)', () => {
            expectSpyCall(editionServiceUpdateIsPrefaceViewSpy, 1, true);
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
                expectSpyCall(getGlyphSpy, 2);

                detectChangesOnPush(fixture);

                expectSpyCall(getGlyphSpy, 3);
            });

            it('... should return the correct hex value for a valid glyph alt value', () => {
                expectToBe(component.getGlyph('[bb]'), '\uD834\uDD2B'); // DOUBLE_FLAT
                expectToBe(component.getGlyph('[x]'), '\uD834\uDD2A'); // DOUBLE_SHARP
                expectToBe(component.getGlyph('[b]'), '\u266D'); // FLAT
                expectToBe(component.getGlyph('[#]'), '\u266F'); // SHARP
                expectToBe(component.getGlyph('[a]'), '\u266E'); // NATURAL
                expectToBe(component.getGlyph('[f]'), '\uD834\uDD91'); // FORTE
                expectToBe(component.getGlyph('[ped]'), '\uD834\uDDAE'); // PEDAL
            });

            it('... should return an empty string for an invalid glyph alt value', () => {
                expectToBe(component.getGlyph(''), '');
                expectToBe(component.getGlyph('[invalid]'), '');
                expectToBe(component.getGlyph('[not found]'), '');
            });
        });

        describe('#setLanguage()', () => {
            it('... should have a method `setLanguage`', () => {
                expect(component.setLanguage).toBeDefined();
            });

            it('... should trigger on event from LanguageSwitcherComponent', fakeAsync(() => {
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
            }));

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
            it('... should have cleared isPrefaceView$ on destroy (via EditionService)', () => {
                component.ngOnDestroy();

                expectSpyCall(editionServiceClearIsPrefaceViewSpy, 1);
            });
        });
    });
});
