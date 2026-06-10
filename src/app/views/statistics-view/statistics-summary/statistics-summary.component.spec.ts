import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { faCheckCircle, faFolder, faList, faMusic, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { StatisticsSummaryCardData } from '@awg-views/statistics-view/models';
import { StatisticsSummaryCardComponent } from '@awg-views/statistics-view/statistics-summary-card';

import { StatisticsSummaryComponent } from './statistics-summary.component';

// Mock components
@Component({
    selector: 'awg-statistics-summary-card',
    template: '',
})
class StatisticsSummaryCardStubComponent {
    title = input<string>();
    value = input<number | string>();
    icon = input<IconDefinition>();
    bgClass = input<string>();
}

describe('StatisticsSummaryComponent', () => {
    let component: StatisticsSummaryComponent;
    let fixture: ComponentFixture<StatisticsSummaryComponent>;
    let compDe: DebugElement;

    let expectedActiveSeries: number;
    let expectedActiveSections: number;
    let expectedTotalComplexes: number;
    let expectedAvailableComplexes: number;
    let expectedSummaryCards: StatisticsSummaryCardData[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatisticsSummaryComponent],
        })
            .overrideComponent(StatisticsSummaryComponent, {
                remove: { imports: [StatisticsSummaryCardComponent] },
                add: { imports: [StatisticsSummaryCardStubComponent] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(StatisticsSummaryComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedActiveSeries = 5;
        expectedActiveSections = 10;
        expectedTotalComplexes = 15;
        expectedAvailableComplexes = 8;

        expectedSummaryCards = [
            { title: 'Active Series', value: expectedActiveSeries, icon: faList, bgClass: 'bg-primary' },
            {
                title: 'Active Sections',
                value: expectedActiveSections,
                icon: faFolder,
                bgClass: 'bg-info',
            },
            {
                title: 'Total Complexes',
                value: expectedTotalComplexes,
                icon: faMusic,
                bgClass: 'bg-secondary',
            },
            {
                title: 'Available Complexes',
                value: expectedAvailableComplexes,
                icon: faCheckCircle,
                bgClass: 'bg-success',
            },
        ];

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('activeSeries', 0);
        fixture.componentRef.setInput('activeSections', 0);
        fixture.componentRef.setInput('totalComplexes', 0);
        fixture.componentRef.setInput('availableComplexes', 0);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `activeSeries`', () => {
            expectToEqual(component.activeSeries(), 0);
        });

        it('... should have required `activeSections`', () => {
            expectToEqual(component.activeSections(), 0);
        });

        it('... should have required `totalComplexes`', () => {
            expectToEqual(component.totalComplexes(), 0);
        });

        it('... should have required `availableComplexes`', () => {
            expectToEqual(component.availableComplexes(), 0);
        });

        describe('VIEW', () => {
            it('... should contain no cards div yet', () => {
                getAndExpectDebugElementByCss(compDe, 'awg-statistics-summary-card', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent updating the input signal
            fixture.componentRef.setInput('activeSeries', expectedActiveSeries);
            fixture.componentRef.setInput('activeSections', expectedActiveSections);
            fixture.componentRef.setInput('totalComplexes', expectedTotalComplexes);
            fixture.componentRef.setInput('availableComplexes', expectedAvailableComplexes);
            fixture.detectChanges();
        });

        it('... should have updated `activeSeries`', () => {
            expectToEqual(component.activeSeries(), expectedActiveSeries);
        });

        it('... should have updated `activeSections`', () => {
            expectToEqual(component.activeSections(), expectedActiveSections);
        });

        it('... should have updated `totalComplexes`', () => {
            expectToEqual(component.totalComplexes(), expectedTotalComplexes);
        });

        it('... should have updated `availableComplexes`', () => {
            expectToEqual(component.availableComplexes(), expectedAvailableComplexes);
        });

        it('... should have computed `summaryCards` based on `statisticsData`', () => {
            const summaryCards = component.summaryCards();
            expect(summaryCards.length).toBe(4);

            summaryCards.forEach((card, index) => {
                expectToBe(card.title, expectedSummaryCards[index].title);
                expectToBe(card.value, expectedSummaryCards[index].value);
                expectToEqual(card.icon, expectedSummaryCards[index].icon);
                expectToBe(card.bgClass, expectedSummaryCards[index].bgClass);
            });
        });

        describe('VIEW', () => {
            it('... should contain one cards div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary', 1, 1);
            });

            it('... should have correct classes on cards div', () => {
                const cardsDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary', 1, 1);
                const cardsEl: HTMLElement = cardsDes[0].nativeElement;

                expectToBe(cardsEl.classList.length, 3);
                expectToContain(cardsEl.classList, 'awg-statistics-summary');
                expectToContain(cardsEl.classList, 'row');
                expectToContain(cardsEl.classList, 'mb-4');
            });

            it('... should contain 4 div.col components in cards div', () => {
                const cardsDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary', 1, 1);
                getAndExpectDebugElementByCss(cardsDes[0], 'div.col-md-3.mb-3', 4, 4);
            });

            it('... should contain one card component (stubbed) in each col div', () => {
                const cardsDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary', 1, 1);
                const colDes = getAndExpectDebugElementByCss(cardsDes[0], 'div.col-md-3.mb-3', 4, 4);

                colDes.forEach(colDe => {
                    getAndExpectDebugElementByDirective(colDe, StatisticsSummaryCardStubComponent, 1, 1);
                });
            });

            it('... should pass down correct card data to each card component', () => {
                const cardsDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary', 1, 1);
                const cardDes = getAndExpectDebugElementByDirective(
                    cardsDes[0],
                    StatisticsSummaryCardStubComponent,
                    expectedSummaryCards.length,
                    expectedSummaryCards.length
                );

                expectedSummaryCards.forEach((card, index) => {
                    const cardCmp = cardDes[index].injector.get(StatisticsSummaryCardStubComponent);

                    expectToBe(cardCmp.title(), card.title);
                    expectToBe(cardCmp.value(), card.value);
                    expectToEqual(cardCmp.icon(), card.icon);
                    expectToBe(cardCmp.bgClass(), card.bgClass);
                });
            });
        });

        describe('#summaryCards', () => {
            it('... should have a computed signal `summaryCards`', () => {
                expect(component.summaryCards).toBeDefined();
            });

            it('... should return correct summary card data based on inputs', () => {
                fixture.componentRef.setInput('activeSeries', expectedActiveSeries);
                fixture.componentRef.setInput('activeSections', expectedActiveSections);
                fixture.componentRef.setInput('totalComplexes', expectedTotalComplexes);
                fixture.componentRef.setInput('availableComplexes', expectedAvailableComplexes);

                const summaryCards = component.summaryCards();

                expect(summaryCards.length).toBe(4);
                summaryCards.forEach((card, index) => {
                    expectToBe(card.title, expectedSummaryCards[index].title);
                    expectToBe(card.value, expectedSummaryCards[index].value);
                    expectToEqual(card.icon, expectedSummaryCards[index].icon);
                    expectToBe(card.bgClass, expectedSummaryCards[index].bgClass);
                });
            });
        });
    });
});
