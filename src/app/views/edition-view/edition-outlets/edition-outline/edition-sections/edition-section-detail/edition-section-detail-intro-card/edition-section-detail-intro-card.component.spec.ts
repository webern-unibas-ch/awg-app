import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { EditionOutlineSection } from '@awg-views/edition-view/models';

import { EditionSectionDetailIntroCardComponent } from './edition-section-detail-intro-card.component';

describe('EditionSectionDetailIntroCardComponent (DONE)', () => {
    let component: EditionSectionDetailIntroCardComponent;
    let fixture: ComponentFixture<EditionSectionDetailIntroCardComponent>;
    let compDe: DebugElement;

    let router: Router;

    let expectedSection: EditionOutlineSection;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSectionDetailIntroCardComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        router = TestBed.inject(Router);

        // Test data
        expectedSection = EditionStateHelper.getSection('1', '5');

        // Create component fixture
        fixture = TestBed.createComponent(EditionSectionDetailIntroCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `selectedSection`', () => {
            expectToBe(isSignal(component.selectedSection), true);

            expect(() => component.selectedSection()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no div.card.awg-edition-section-detail-intro-card yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-section-detail-intro-card', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('selectedSection', structuredClone(expectedSection));

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedSection` to hold the expected section', () => {
            expectToEqual(component.selectedSection(), expectedSection);
        });

        describe('VIEW', () => {
            const getCardDes = () =>
                getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-section-detail-intro-card', 1, 1);
            const getCardBodyDes = () => getAndExpectDebugElementByCss(getCardDes()[0], 'div.card-body', 1, 1);
            const getCardFooterDes = () => getAndExpectDebugElementByCss(getCardDes()[0], 'div.card-footer', 1, 1);
            const getTextEndParaDes = () => getAndExpectDebugElementByCss(getCardFooterDes()[0], 'p.text-end', 1, 1);

            describe('... should render no content if', () => {
                it('... selected section is not available', () => {
                    fixture.componentRef.setInput('selectedSection', null);

                    fixture.detectChanges();

                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-card', 0, 0);
                });

                it('... selected section has no intro content', () => {
                    const sectionWithoutIntro = {
                        ...structuredClone(expectedSection),
                        content: {
                            ...structuredClone(expectedSection.content),
                            intro: null,
                        },
                    } as unknown as EditionOutlineSection;

                    fixture.componentRef.setInput('selectedSection', sectionWithoutIntro);

                    fixture.detectChanges();

                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-card', 0, 0);
                });
            });

            it('... should contain one div.card.awg-edition-section-detail-intro-card', () => {
                getCardDes();
            });

            describe('... should contain card layout elements', () => {
                it.each([
                    { desc: 'one h5.card-header', selector: 'h5.card-header' },
                    { desc: 'one div.card-body', selector: 'div.card-body' },
                    { desc: 'one div.card-footer', selector: 'div.card-footer' },
                ])('... should contain $desc in div.card', ({ selector }) => {
                    getAndExpectDebugElementByCss(getCardDes()[0], selector, 1, 1);
                });
            });

            it('... should render intro title in h5.card-header', () => {
                const hDes = getAndExpectDebugElementByCss(getCardDes()[0], 'h5.card-header', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent.trim(), 'Einleitung');
            });

            it('... should contain one p.card-text in div.card-body', () => {
                getAndExpectDebugElementByCss(getCardBodyDes()[0], 'p.card-text', 1, 1);
            });

            it('... should render intro preview in p.card-text', () => {
                const pDes = getAndExpectDebugElementByCss(getCardBodyDes()[0], 'p.card-text', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.textContent.trim(), expectedSection.content.intro.preview + ' …');
            });

            it('... should have text-end paragraph in div.card-footer', () => {
                getTextEndParaDes();
            });

            it('... should have a link to intro in text-end paragraph', () => {
                const aDes = getAndExpectDebugElementByCss(getTextEndParaDes()[0], 'a', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                const expectedLinkText = 'Mehr ...';

                expectToBe(aEl.textContent.trim(), expectedLinkText);
            });

            it('... should disable links only for disabled intros', () => {
                const aDes = getAndExpectDebugElementByCss(getTextEndParaDes()[0], 'a', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                if (expectedSection.content.intro.disabled) {
                    expectToContain(aEl.classList, 'disabled');
                } else {
                    expectToNotContain(aEl.classList, 'disabled');
                }
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: RouterLink[];

            beforeEach(() => {
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLink, 1, 1);

                routerLinks = linkDes.map(de => de.injector.get(RouterLink));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 1);
            });

            it('... can get correct linkParams from template', () => {
                for (const routerLink of routerLinks) {
                    const expectedRouterLink = expectedSection.labeledRoute.route.join('/') + '/intro';

                    expectToBe(routerLink.urlTree?.toString(), expectedRouterLink);
                }
            });

            it('... can click all links in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                for (const [index] of routerLinks.entries()) {
                    navigateSpy.mockClear();

                    const linkDe = linkDes[index];
                    const expectedRouterLink = expectedSection.labeledRoute.route.join('/') + '/intro';

                    await clickAndAwaitChanges(linkDe, fixture);

                    expect(navigateSpy).toHaveBeenCalled();
                    const firstCallArg = navigateSpy.mock.calls[0][0];
                    const actualUrl = firstCallArg.toString();

                    expectToBe(actualUrl, expectedRouterLink);
                }
            });
        });
    });
});
