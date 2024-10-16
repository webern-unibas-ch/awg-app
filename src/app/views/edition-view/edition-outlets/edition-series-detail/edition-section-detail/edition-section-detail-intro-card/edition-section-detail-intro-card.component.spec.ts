import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionOutlineService } from '@awg-views/edition-view/services';

import { click } from '@testing/click-helper';
import { EditionSectionDetailIntroCardComponent } from './edition-section-detail-intro-card.component';

describe('EditionSectionDetailIntroCardComponent (DONE)', () => {
    let component: EditionSectionDetailIntroCardComponent;
    let fixture: ComponentFixture<EditionSectionDetailIntroCardComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let expectedSelectedSeries: EditionOutlineSeries;
    let expectedSelectedSection: EditionOutlineSection;

    beforeAll(() => {
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionSectionDetailIntroCardComponent, RouterLinkStubDirective],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionSectionDetailIntroCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSelectedSeries = JSON.parse(JSON.stringify(EditionOutlineService.getEditionOutline()[0]));
        expectedSelectedSection = JSON.parse(JSON.stringify(expectedSelectedSeries.sections[4]));
    });

    afterAll(() => {
        cleanStylesFromDOM();
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
            component.selectedSeries = expectedSelectedSeries;
            component.selectedSection = expectedSelectedSection;

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
            it('... should contain one div.card.awg-edition-card', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-card', 1, 1);
            });

            it('... should contain one h5.card-header in div.card', () => {
                const cardDes = getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-card', 1, 1);
                getAndExpectDebugElementByCss(cardDes[0], 'h5.card-header', 1, 1);
            });

            it('... should render intro title in h5.card-header', () => {
                const cardDes = getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-card', 1, 1);
                const h5Des = getAndExpectDebugElementByCss(cardDes[0], 'h5.card-header', 1, 1);
                const h5El = h5Des[0].nativeElement;

                expectToBe(h5El.textContent.trim(), 'Einleitung');
            });

            it('... should contain one div.card-body in div.card', () => {
                const cardDes = getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-card', 1, 1);
                getAndExpectDebugElementByCss(cardDes[0], 'div.card-body', 1, 1);
            });

            it('... should contain one p.card-text in div.card-body', () => {
                const cardDes = getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-card', 1, 1);
                const bodyDes = getAndExpectDebugElementByCss(cardDes[0], 'div.card-body', 1, 1);

                getAndExpectDebugElementByCss(bodyDes[0], 'p.card-text', 1, 1);
            });

            it('... should render intro preview in p.card-text', () => {
                const cardDes = getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-card', 1, 1);
                const bodyDes = getAndExpectDebugElementByCss(cardDes[0], 'div.card-body', 1, 1);
                const pDes = getAndExpectDebugElementByCss(bodyDes[0], 'p.card-text', 1, 1);
                const pEl = pDes[0].nativeElement;

                expectToBe(pEl.textContent.trim(), expectedSelectedSection.content.intro.preview + ' …');
            });

            it('... should contain one div.card-footer in div.card', () => {
                const cardDes = getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-card', 1, 1);

                getAndExpectDebugElementByCss(cardDes[0], 'div.card-footer', 1, 1);
            });

            it('... should have text-end paragraph in div.card-footer', () => {
                const cardFooterDes = getAndExpectDebugElementByCss(compDe, 'div.card-footer', 1, 1);

                getAndExpectDebugElementByCss(cardFooterDes[0], 'p.text-end', 1, 1);
            });

            it('... should have a link to intro in text-end paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.text-end', 1, 1);

                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a', 1, 1);
                const aEl = aDes[0].nativeElement;

                const expectedLinkText = 'Mehr ...';

                expectToBe(aEl.textContent.trim(), expectedLinkText);
            });

            it('... should disable links only for disabled intros', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.text-end', 1, 1);

                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a', 1, 1);
                const aEl = aDes[0].nativeElement;

                expectToBe(aEl.classList.contains('disabled'), expectedSelectedSection.content.intro.disabled);
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 1, 1);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 1);
            });

            it('... can get correct linkParams from template', () => {
                routerLinks.forEach((routerLink: RouterLinkStubDirective, _index: number) => {
                    const expectedRouterLink = [
                        '/edition',
                        'series',
                        expectedSelectedSeries.series.route,
                        'section',
                        expectedSelectedSection.section.route,
                        'intro',
                    ];
                    expectToEqual(routerLink.linkParams, expectedRouterLink);
                });
            });

            it('... can click all links in template', () => {
                routerLinks.forEach((routerLink: RouterLinkStubDirective, index: number) => {
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

                    click(linkDe);
                    fixture.detectChanges();

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                });
            });
        });
    });
});
