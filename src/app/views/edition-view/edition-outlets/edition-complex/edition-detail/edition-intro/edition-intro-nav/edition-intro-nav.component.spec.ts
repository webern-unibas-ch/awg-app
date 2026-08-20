import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { LanguageSwitcherStubComponent } from '@testing/component-stubs';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { LanguageId } from '@awg-shared/language-switcher/language.model';
import { IntroBlock } from '@awg-views/edition-view/models';

import { EditionIntroNavComponent } from './edition-intro-nav.component';

describe('EditionIntroNavComponent (DONE)', () => {
    let component: EditionIntroNavComponent;
    let fixture: ComponentFixture<EditionIntroNavComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks: RouterLinkStubDirective[];

    let expectedIntroBlockContent: IntroBlock[];
    let expectedNotesLabel: string;
    let expectedSelectedLanguage: LanguageId;

    let expectedLinkParam: string;
    let expectedNotesFragment: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LanguageSwitcherStubComponent],
            declarations: [EditionIntroNavComponent, RouterLinkStubDirective],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionIntroNavComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedIntroBlockContent = structuredClone(mockEditionData.mockIntroSectionData.intro[0].content ?? []);
        expectedNotesLabel = 'Test notes label';
        expectedSelectedLanguage = LanguageId.DE;

        expectedLinkParam = '.';
        expectedNotesFragment = 'notes';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have default `introBlockContent` input', () => {
            expectToEqual(component.introBlockContent, []);
        });

        it('... should have default `notesLabel` input', () => {
            expectToBe(component.notesLabel, '');
        });

        it('... should throw due to missing required input for model signal `selectedLanguage`', () => {
            expectToBe(isSignal(component.selectedLanguage), true);

            expect(() => component.selectedLanguage()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no `div.awg-edition-intro-nav` yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-nav', 0, 0);
            });

            it('... should contain no LanguageSwitcherComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, LanguageSwitcherStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.introBlockContent = expectedIntroBlockContent;
            component.notesLabel = expectedNotesLabel;
            fixture.componentRef.setInput('selectedLanguage', expectedSelectedLanguage);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `introBlockContent`', () => {
            expectToEqual(component.introBlockContent, expectedIntroBlockContent);
        });

        it('... should have `notesLabel`', () => {
            expectToBe(component.notesLabel, expectedNotesLabel);
        });

        it('... should have signal `selectedLanguage` to hold the expected language', () => {
            expectToEqual(component.selectedLanguage(), expectedSelectedLanguage);
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-edition-intro-nav`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-nav', 1, 1);
            });

            it('... should contain a ul.nav in div', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-nav', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'ul.nav', 1, 1);
            });

            it('... should contain one LanguageSwitcherComponent (stubbed) in ul.nav', () => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ul.nav', 1, 1);

                getAndExpectDebugElementByDirective(ulDes[0], LanguageSwitcherStubComponent, 1, 1);
            });

            it('... should pass down `selectedLanguage` to LanguageSwitcherComponent', () => {
                const switcherDes = getAndExpectDebugElementByDirective(compDe, LanguageSwitcherStubComponent, 1, 1);
                const switcherCmp = switcherDes[0].injector.get(
                    LanguageSwitcherStubComponent
                ) as LanguageSwitcherStubComponent;

                expectToEqual(switcherCmp.selectedLanguage(), expectedSelectedLanguage);
            });

            it('... should update `selectedLanguage` when LanguageSwitcherComponent emits a change', () => {
                const switcherDes = getAndExpectDebugElementByDirective(compDe, LanguageSwitcherStubComponent, 1, 1);

                expectToBe(component.selectedLanguage(), LanguageId.DE);

                switcherDes[0].triggerEventHandler('selectedLanguageChange', LanguageId.EN);

                fixture.detectChanges();

                expectToBe(component.selectedLanguage(), LanguageId.EN);
            });

            it('... should contain a horizontal line below LanguageSwitcherComponent in ul.nav', () => {
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

                    expectToBe(aEl.textContent, expectedText);
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

            it('... can click any router links in template', async () => {
                for (const [index, link] of routerLinks.entries()) {
                    const linkDe = linkDes[index]; // Link DebugElement

                    expectToBe(link.navigatedTo, null);

                    await clickAndAwaitChanges(linkDe, fixture);

                    const blockFragment = expectedIntroBlockContent[index]?.blockId;
                    const expectedFragment = index === routerLinks.length - 1 ? expectedNotesFragment : blockFragment;

                    expectToBe(link.navigatedTo, expectedLinkParam);
                    expectToBe(link.navigatedToFragment, expectedFragment);
                }
            });
        });
    });
});
