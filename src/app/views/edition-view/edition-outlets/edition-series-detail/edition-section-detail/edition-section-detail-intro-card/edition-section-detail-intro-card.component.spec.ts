import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionOutlineService } from '@awg-views/edition-view/services';

import { EditionSectionDetailIntroCardComponent } from './edition-section-detail-intro-card.component';

describe('EditionSectionDetailIntroCardComponent (DONE)', () => {
    let component: EditionSectionDetailIntroCardComponent;
    let fixture: ComponentFixture<EditionSectionDetailIntroCardComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let editionOutlineService: EditionOutlineService;

    let expectedSelectedSeries: EditionOutlineSeries;
    let expectedSelectedSection: EditionOutlineSection;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionSectionDetailIntroCardComponent, RouterLinkStubDirective],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionOutlineService = TestBed.inject(EditionOutlineService);

        // Init edition data
        editionOutlineService.initializeEditionOutline();

        // Test data
        expectedSelectedSeries = structuredClone(editionOutlineService.editionOutline()[0]);
        expectedSelectedSection = structuredClone(expectedSelectedSeries.sections[4]);

        // Create component fixture
        fixture = TestBed.createComponent(EditionSectionDetailIntroCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `selectedSeries`', () => {
            expect(component.selectedSeries).toBeUndefined();
        });

        it('... should not have `selectedSection`', () => {
            expect(component.selectedSection).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain no div.card.awg-edition-card yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-card', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            component.selectedSeries = structuredClone(expectedSelectedSeries);
            component.selectedSection = structuredClone(expectedSelectedSection);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `selectedSeries`', () => {
            expectToEqual(component.selectedSeries, expectedSelectedSeries);
        });

        it('... should have `selectedSection`', () => {
            expectToEqual(component.selectedSection, expectedSelectedSection);
        });

        describe('VIEW', () => {
            const getCardDes = () => getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-card', 1, 1);
            const getCardBodyDes = () => getAndExpectDebugElementByCss(getCardDes()[0], 'div.card-body', 1, 1);
            const getCardFooterDes = () => getAndExpectDebugElementByCss(getCardDes()[0], 'div.card-footer', 1, 1);
            const getTextEndParaDes = () => getAndExpectDebugElementByCss(getCardFooterDes()[0], 'p.text-end', 1, 1);

            it('... should contain one div.card.awg-edition-card', () => {
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

                expectToBe(pEl.textContent.trim(), expectedSelectedSection.content.intro.preview + ' …');
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

                if (expectedSelectedSection.content.intro.disabled) {
                    expectToContain(aEl.classList, 'disabled');
                } else {
                    expectToNotContain(aEl.classList, 'disabled');
                }
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 1, 1);

                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 1);
            });

            it('... can get correct linkParams from template', () => {
                for (const routerLink of routerLinks) {
                    const expectedRouterLink = [
                        '/edition',
                        'series',
                        expectedSelectedSeries.series.route,
                        'section',
                        expectedSelectedSection.section.route,
                        'intro',
                    ];
                    expectToEqual(routerLink.linkParams, expectedRouterLink);
                }
            });

            it('... can click all links in template', async () => {
                for (const [index, routerLink] of routerLinks.entries()) {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = [
                        '/edition',
                        'series',
                        expectedSelectedSeries.series.route,
                        'section',
                        expectedSelectedSection.section.route,
                        'intro',
                    ];

                    expectToBe(routerLink.navigatedTo, null);

                    await clickAndAwaitChanges(linkDe, fixture);

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                }
            });
        });
    });
});
