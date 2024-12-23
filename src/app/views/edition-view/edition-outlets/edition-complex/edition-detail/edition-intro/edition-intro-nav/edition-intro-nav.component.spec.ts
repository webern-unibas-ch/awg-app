import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { IntroBlock } from '@awg-views/edition-view/models';

import { EditionIntroNavComponent } from './edition-intro-nav.component';

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

describe('EditionIntroNavComponent (DONE)', () => {
    let component: EditionIntroNavComponent;
    let fixture: ComponentFixture<EditionIntroNavComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let setLanguageSpy: Spy;
    let emitLanguageChangeRequestSpy: Spy;

    let expectedIntroBlockContent: IntroBlock[];
    let expectedNotesLabel: string;
    let expectedCurrentLanguage: number;

    let expectedLinkParam: string;
    let expectedNotesFragment: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionIntroNavComponent, LanguageSwitcherStubComponent, RouterLinkStubDirective],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionIntroNavComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedIntroBlockContent = JSON.parse(JSON.stringify(mockEditionData.mockIntroData.intro[0].content));
        expectedNotesLabel = 'Test notes label';
        expectedCurrentLanguage = 0;

        expectedLinkParam = '.';
        expectedNotesFragment = 'notes';

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        setLanguageSpy = spyOn(component, 'setLanguage').and.callThrough();
        emitLanguageChangeRequestSpy = spyOn(component.languageChangeRequest, 'emit').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `introBlockContent`', () => {
            expect(component.introBlockContent).toBeUndefined();
        });

        it('... should not have `notesLabel`', () => {
            expect(component.notesLabel).toBeUndefined();
        });

        it('... should not have `currentLanguage`', () => {
            expect(component.currentLanguage).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain no `div.awg-edition-intro-nav` yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-nav', 0, 0);
            });

            it('... should not contain language switcher component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, LanguageSwitcherStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.introBlockContent = expectedIntroBlockContent;
            component.notesLabel = expectedNotesLabel;
            component.currentLanguage = expectedCurrentLanguage;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `introBlockContent`', () => {
            expectToEqual(component.introBlockContent, expectedIntroBlockContent);
        });

        it('... should have `notesLabel`', () => {
            expectToBe(component.notesLabel, expectedNotesLabel);
        });

        it('... should have `currentLanguage`', () => {
            expectToEqual(component.currentLanguage, expectedCurrentLanguage);
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-edition-intro-nav`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-nav', 1, 1);
            });

            it('... should contain a ul.nav in div', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-nav', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'ul.nav', 1, 1);
            });

            it('... should contain a language switcher component (stubbed) in ul.nav', () => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ul.nav', 1, 1);

                getAndExpectDebugElementByDirective(ulDes[0], LanguageSwitcherStubComponent, 1, 1);
            });

            it('... should pass down `currentLanguage` to language switcher component', () => {
                const switcherDes = getAndExpectDebugElementByDirective(compDe, LanguageSwitcherStubComponent, 1, 1);
                const switcherCmp = switcherDes[0].injector.get(
                    LanguageSwitcherStubComponent
                ) as LanguageSwitcherStubComponent;

                expectToEqual(switcherCmp.currentLanguage, expectedCurrentLanguage);
            });

            it('... should contain a horizontal line after language switcher in ul.nav', () => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ul.nav', 1, 1);
                getAndExpectDebugElementByCss(ulDes[0], 'hr.mt-0', 1, 1);
            });

            it('... should contain as many li.nav-items in ul.nav as block items in introBlockContent (+ 1 for notes', () => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ul.nav', 1, 1);

                getAndExpectDebugElementByCss(
                    ulDes[0],
                    'li.nav-item',
                    expectedIntroBlockContent.length + 1,
                    expectedIntroBlockContent.length + 1
                );
            });

            it('... should contain a nav-link in each li.nav-item', () => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ul.nav', 1, 1);
                const liDes = getAndExpectDebugElementByCss(
                    ulDes[0],
                    'li.nav-item',
                    expectedIntroBlockContent.length + 1,
                    expectedIntroBlockContent.length + 1
                );

                liDes.forEach(liDe => {
                    getAndExpectDebugElementByCss(liDe, 'a.awg-edition-intro-nav-link', 1, 1);
                });
            });

            it('... should display correct block header in each nav-link', () => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ul.nav', 1, 1);
                const liDes = getAndExpectDebugElementByCss(
                    ulDes[0],
                    'li.nav-item',
                    expectedIntroBlockContent.length + 1,
                    expectedIntroBlockContent.length + 1
                );

                liDes.forEach((liDe, index) => {
                    const aDes = getAndExpectDebugElementByCss(liDe, 'a.awg-edition-intro-nav-link', 1, 1);
                    const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                    const expectedText =
                        index === expectedIntroBlockContent.length
                            ? expectedNotesLabel
                            : expectedIntroBlockContent[index].blockHeader;

                    expect(aEl.textContent).toEqual(expectedText);
                });
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

            it('... should emit 0 when called with 0', () => {
                component.setLanguage(0);

                expectSpyCall(setLanguageSpy, 1);
                expectSpyCall(emitLanguageChangeRequestSpy, 1, 0);
            });

            it('... should emit 1 when called with 1', () => {
                component.setLanguage(1);

                expectSpyCall(setLanguageSpy, 1);
                expectSpyCall(emitLanguageChangeRequestSpy, 1, 1);
            });

            it('... should not emit when called with any other number than 0 or 1', () => {
                const invalidLanguageNumbers = [-987654321, -2, -1, 2, 3, 987654321];

                invalidLanguageNumbers.forEach((languageNumber, index) => {
                    component.setLanguage(languageNumber);

                    expectSpyCall(setLanguageSpy, index + 1);
                    expectSpyCall(emitLanguageChangeRequestSpy, 0);
                });
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLinkStubDirective,
                    expectedIntroBlockContent.length + 1,
                    expectedIntroBlockContent.length + 1
                );

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, expectedIntroBlockContent.length + 1);
            });

            it('... can get correct linkParams from template', () => {
                routerLinks.forEach((link: RouterLinkStubDirective) => {
                    expectToBe(link.linkParams, expectedLinkParam);
                });
            });

            it('... can get correct fragments from template', () => {
                routerLinks.forEach((link: RouterLinkStubDirective, index: number) => {
                    const blockFragment = expectedIntroBlockContent[index]?.blockId;
                    const expectedFragment = index === routerLinks.length - 1 ? expectedNotesFragment : blockFragment;

                    expectToBe(link.fragment, expectedFragment);
                });
            });

            it('... can click any router links in template', () => {
                routerLinks.forEach((link: RouterLinkStubDirective, index: number) => {
                    const linkDe = linkDes[index]; // Link DebugElement

                    expectToBe(link.navigatedTo, null);

                    click(linkDe);
                    fixture.detectChanges();

                    const blockFragment = expectedIntroBlockContent[index]?.blockId;
                    const expectedFragment = index === routerLinks.length - 1 ? expectedNotesFragment : blockFragment;

                    expectToBe(link.navigatedTo, expectedLinkParam);
                    expectToBe(link.navigatedToFragment, expectedFragment);
                });
            });
        });
    });
});
