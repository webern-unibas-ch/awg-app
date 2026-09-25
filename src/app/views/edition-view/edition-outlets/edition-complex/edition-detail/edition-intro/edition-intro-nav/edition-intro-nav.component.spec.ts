import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { LanguageSwitcherComponent } from '@awg-shared/language-switcher/language-switcher.component';
import { LanguageId } from '@awg-shared/language-switcher/language.model';
import { IntroBlock } from '@awg-views/edition-view/models/intro.model';

import { EditionIntroNavComponent } from './edition-intro-nav.component';

describe('EditionIntroNavComponent (DONE)', () => {
    let component: EditionIntroNavComponent;
    let fixture: ComponentFixture<EditionIntroNavComponent>;
    let compDe: DebugElement;

    let router: Router;

    let expectedIntroBlockContent: IntroBlock[];
    let expectedNotesLabel: string;
    let expectedSelectedLanguage: LanguageId;

    let expectedNotesFragment: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionIntroNavComponent, LanguageSwitcherComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        router = TestBed.inject(Router);

        // Test data
        expectedIntroBlockContent = structuredClone(mockEditionData.mockIntroSectionData.intro[0].content ?? []);
        expectedNotesLabel = 'Test notes label';
        expectedSelectedLanguage = LanguageId.DE;

        expectedNotesFragment = 'notes';

        // Create component fixture
        fixture = TestBed.createComponent(EditionIntroNavComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `introBlockContent`', () => {
            expectToBe(isSignal(component.introBlockContent), true);

            expect(() => component.introBlockContent()).toThrow();
        });

        it('... should throw due to missing required input signal `notesLabel`', () => {
            expectToBe(isSignal(component.notesLabel), true);

            expect(() => component.notesLabel()).toThrow();
        });

        it('... should throw due to missing required input for model signal `selectedLanguage`', () => {
            expectToBe(isSignal(component.selectedLanguage), true);

            expect(() => component.selectedLanguage()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no `div.awg-edition-intro-nav` yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-nav', 0, 0);
            });

            it('... should contain no LanguageSwitcherComponent', () => {
                getAndExpectDebugElementByDirective(compDe, LanguageSwitcherComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('introBlockContent', expectedIntroBlockContent);
            fixture.componentRef.setInput('notesLabel', expectedNotesLabel);
            fixture.componentRef.setInput('selectedLanguage', expectedSelectedLanguage);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `introBlockContent` to hold the expected content', () => {
            expectToEqual(component.introBlockContent(), expectedIntroBlockContent);
        });

        it('... should have input signal `notesLabel` to hold the expected label', () => {
            expectToBe(component.notesLabel(), expectedNotesLabel);
        });

        it('... should have model signal `selectedLanguage` to hold the expected language', () => {
            expectToEqual(component.selectedLanguage(), expectedSelectedLanguage);
        });

        describe('VIEW', () => {
            const getDivDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-nav', 1, 1);
            const getUlDes = () => getAndExpectDebugElementByCss(getDivDes()[0], 'ul.nav', 1, 1);
            const getLiDes = () =>
                getAndExpectDebugElementByCss(
                    getUlDes()[0],
                    'li.nav-item',
                    expectedIntroBlockContent.length + 1,
                    expectedIntroBlockContent.length + 1
                );

            it('... should render no content if `introBlockContent` is empty', () => {
                fixture.componentRef.setInput('introBlockContent', []);
                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-nav', 0, 0);
            });

            it('... should contain one `div.awg-edition-intro-nav`', () => {
                getDivDes();
            });

            it('... should contain a ul.nav in div', () => {
                getUlDes();
            });

            it('... should contain one LanguageSwitcherComponent in ul.nav', () => {
                getAndExpectDebugElementByDirective(getUlDes()[0], LanguageSwitcherComponent, 1, 1);
            });

            it('... should pass down `selectedLanguage` to LanguageSwitcherComponent', () => {
                const switcherDes = getAndExpectDebugElementByDirective(getUlDes()[0], LanguageSwitcherComponent, 1, 1);
                const switcherCmp = switcherDes[0].injector.get(LanguageSwitcherComponent) as LanguageSwitcherComponent;

                expectToEqual(switcherCmp.selectedLanguage(), expectedSelectedLanguage);
            });

            it('... should update `selectedLanguage` when LanguageSwitcherComponent emits a change', () => {
                const switcherDes = getAndExpectDebugElementByDirective(getUlDes()[0], LanguageSwitcherComponent, 1, 1);

                expectToBe(component.selectedLanguage(), LanguageId.DE);

                switcherDes[0].triggerEventHandler('selectedLanguageChange', LanguageId.EN);

                fixture.detectChanges();

                expectToBe(component.selectedLanguage(), LanguageId.EN);
            });

            it('... should contain a horizontal line below LanguageSwitcherComponent in ul.nav', () => {
                getAndExpectDebugElementByCss(getUlDes()[0], 'hr.mt-0', 1, 1);
            });

            it('... should render no li.nav-items if an `introBlock` does not exist', () => {
                fixture.componentRef.setInput('introBlockContent', [undefined as unknown as IntroBlock]);
                fixture.detectChanges();

                getAndExpectDebugElementByCss(getUlDes()[0], 'li.nav-item', 1, 1);
            });

            it('... should render no li.nav-items if an `introBlock` has no `blockHeader`', () => {
                fixture.componentRef.setInput('introBlockContent', [
                    { blockId: 'test', blockHeader: undefined, blockContent: [] } as unknown as IntroBlock,
                ]);
                fixture.detectChanges();

                getAndExpectDebugElementByCss(getUlDes()[0], 'li.nav-item', 1, 1);
            });

            it('... should contain as many li.nav-items in ul.nav as block items in introBlockContent (+ 1 for notes', () => {
                getLiDes();
            });

            it('... should contain a nav-link in each li.nav-item', () => {
                const liDes = getLiDes();
                liDes.forEach(liDe => {
                    getAndExpectDebugElementByCss(liDe, 'a.awg-edition-intro-nav-link', 1, 1);
                });
            });

            it('... should display correct block header in each nav-link', () => {
                const liDes = getLiDes();
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
            let linkDes: DebugElement[];
            let routerLinks: RouterLink[];

            const getExpectedLength = () => expectedIntroBlockContent.length + 1;
            const getExpectedData = (index: number) => {
                const isLast = index === getExpectedLength() - 1;
                const fragment = isLast ? expectedNotesFragment : expectedIntroBlockContent[index]?.blockId;
                return { fragment, url: `/#${fragment}` };
            };

            beforeEach(() => {
                linkDes = getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLink,
                    expectedIntroBlockContent.length + 1,
                    expectedIntroBlockContent.length + 1
                );

                routerLinks = linkDes.map(de => de.injector.get(RouterLink) as RouterLink);
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, expectedIntroBlockContent.length + 1);
            });

            it('... can get correct linkParams from template', () => {
                routerLinks.forEach((link: RouterLink, index: number) => {
                    const expected = getExpectedData(index);
                    const urlTreeString = link.urlTree?.toString() ?? '';

                    expectToBe(urlTreeString, expected.url);
                });
            });

            it('... can get correct fragments from template', () => {
                routerLinks.forEach((link: RouterLink, index: number) => {
                    const expected = getExpectedData(index);

                    expectToBe(link.fragment, expected.fragment);
                });
            });

            it('... can click any router links in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                for (const [index, linkDe] of linkDes.entries()) {
                    navigateSpy.mockClear();

                    const expected = getExpectedData(index);

                    await clickAndAwaitChanges(linkDe, fixture);

                    expect(navigateSpy).toHaveBeenCalled();
                    const actualUrl = navigateSpy.mock.calls[0][0].toString();

                    expectToBe(actualUrl, expected.url);
                }

                navigateSpy.mockRestore();
            });
        });
    });
});
