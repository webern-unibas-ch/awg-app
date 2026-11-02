import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { ButtonMoreComponent } from '@awg-shared/button-more/button-more.component';
import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { EditionOutlineSeries } from '@awg-views/edition-view/models/edition-outline.model';

import { EditionSeriesCardComponent } from './edition-series-card.component';

describe('EditionSeriesCardComponent (DONE)', () => {
    let component: EditionSeriesCardComponent;
    let fixture: ComponentFixture<EditionSeriesCardComponent>;
    let compDe: DebugElement;

    let expectedSeries: EditionOutlineSeries;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSeriesCardComponent],
        })
            .overrideComponent(ButtonMoreComponent, { set: { template: '', imports: [] } })
            .overrideComponent(ConditionalLinkComponent, { set: { template: '<ng-content />', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSeries = EditionStateHelper.getSeries('1');

        // Create component fixture
        fixture = TestBed.createComponent(EditionSeriesCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `displayedSeries`', () => {
            expectToBe(isSignal(component.displayedSeries), true);

            expect(() => component.displayedSeries()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no div.awg-edition-series-card yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series-card', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('displayedSeries', structuredClone(expectedSeries));

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `displayedSeries` to hold the expected series', () => {
            expectToEqual(component.displayedSeries(), expectedSeries);
        });

        describe('VIEW', () => {
            const getCardDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series-card', 1, 1);
            const getCardBodyDes = () => getAndExpectDebugElementByCss(getCardDes()[0], 'div.card-body', 1, 1);
            const getCardFooterDes = () => getAndExpectDebugElementByCss(getCardDes()[0], 'div.card-footer', 1, 1);
            const getListItemDes = () => {
                const ulDes = getAndExpectDebugElementByCss(getCardBodyDes()[0], 'ul.list-group', 1, 1);
                return getAndExpectDebugElementByCss(
                    ulDes[0],
                    'li.list-group-item',
                    expectedSeries.sections.length,
                    expectedSeries.sections.length
                );
            };

            it('... should render no content if displayed series is not available', () => {
                fixture.componentRef.setInput('displayedSeries', null);

                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series-card', 0, 0);
            });

            it('... should contain one div.awg-edition-series-card', () => {
                getCardDes();
            });

            describe('... should contain card layout elements', () => {
                it.each([
                    { desc: 'a h5.card-header', selector: 'h5.card-header' },
                    { desc: 'a div.card-body', selector: 'div.card-body' },
                    { desc: 'a div.card-footer', selector: 'div.card-footer' },
                ])('... should contain $desc in div.awg-edition-series-card', ({ selector }) => {
                    getAndExpectDebugElementByCss(getCardDes()[0], selector, 1, 1);
                });
            });

            it('... should display series name in h5.card-header', () => {
                const hDes = getAndExpectDebugElementByCss(getCardDes()[0], 'h5.card-header', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent.trim(), expectedSeries.series.full);
            });

            it('... should contain a ul.list-group in div.card-body', () => {
                getAndExpectDebugElementByCss(getCardBodyDes()[0], 'ul.list-group', 1, 1);
            });

            it('... should contain as many li.list-group-item in ul.list-group as there are sections in the series', () => {
                getListItemDes();
            });

            it('... should display section name in each li.list-group-item', () => {
                const liDes = getListItemDes();

                liDes.forEach((liDe, index) => {
                    const expectedSection = expectedSeries.sections[index];
                    const liEl: HTMLLIElement = liDe.nativeElement;

                    expectToBe(liEl.textContent.trim(), expectedSection.section.full);
                });
            });

            it('... should contain one ConditionalLinkComponent (hollow) in each li.list-group-item', () => {
                getListItemDes().forEach(liDe => {
                    getAndExpectDebugElementByDirective(liDe, ConditionalLinkComponent, 1, 1);
                });
            });

            it('... should pass down `isClickable` and `targetRoute` to ConditionalLinkComponent (hollow)', () => {
                getListItemDes().forEach((liDe, index) => {
                    const expectedSection = expectedSeries.sections[index];
                    const expectedTargetRoute = [expectedSeries.series.route, 'section', expectedSection.section.route];

                    const linkDes = getAndExpectDebugElementByDirective(liDe, ConditionalLinkComponent, 1, 1);
                    const linkCmp = linkDes[0].injector.get(ConditionalLinkComponent);

                    expectToBe(linkCmp.isClickable(), !expectedSection.disabled);
                    expectToEqual(linkCmp.targetRoute(), expectedTargetRoute);
                });
            });

            it('... should text-mute only the links of disabled sections', () => {
                getListItemDes().forEach((liDe, index) => {
                    const isSectionDisabled = expectedSeries.sections[index].disabled;

                    const linkDes = getAndExpectDebugElementByDirective(liDe, ConditionalLinkComponent, 1, 1);
                    const linkEl: HTMLElement = linkDes[0].nativeElement;
                    const isLinkTextMuted = linkEl.classList.contains('text-muted');

                    expectToBe(isLinkTextMuted, isSectionDisabled);
                });
            });

            it('... should have a ButtonMoreComponent (hollow) in div.card-footer', () => {
                getAndExpectDebugElementByDirective(getCardFooterDes()[0], ButtonMoreComponent, 1, 1);
            });

            it('... should pass down the correct targetRoute to ButtonMoreComponent (hollow)', () => {
                const buttonMoreDes = getAndExpectDebugElementByDirective(
                    getCardFooterDes()[0],
                    ButtonMoreComponent,
                    1,
                    1
                );
                const buttonMoreCmp = buttonMoreDes[0].injector.get(ButtonMoreComponent);

                expectToEqual(buttonMoreCmp.targetRoute(), [expectedSeries.series.route]);
            });
        });
    });
});
