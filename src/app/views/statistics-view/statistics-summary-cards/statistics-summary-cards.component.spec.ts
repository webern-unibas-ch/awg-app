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

import { EditionStatistics, StatisticsSummaryCardData } from '../models';
import { StatisticsSummaryCardComponent } from '../statistics-summary-card';

import { StatisticsSummaryCardsComponent } from './statistics-summary-cards.component';

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

describe('StatisticsSummaryCardsComponent', () => {
    let component: StatisticsSummaryCardsComponent;
    let fixture: ComponentFixture<StatisticsSummaryCardsComponent>;
    let compDe: DebugElement;

    let expectedStatisticsData: Partial<EditionStatistics>;
    let expectedSummaryCards: StatisticsSummaryCardData[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatisticsSummaryCardsComponent],
        })
            .overrideComponent(StatisticsSummaryCardsComponent, {
                remove: { imports: [StatisticsSummaryCardComponent] },
                add: { imports: [StatisticsSummaryCardStubComponent] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(StatisticsSummaryCardsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedStatisticsData = {
            activeSeries: 5,
            activeSections: 10,
            totalComplexes: 15,
            availableComplexes: 8,
        };

        expectedSummaryCards = [
            { title: 'Active Series', value: expectedStatisticsData.activeSeries, icon: faList, bgClass: 'bg-primary' },
            {
                title: 'Active Sections',
                value: expectedStatisticsData.activeSections,
                icon: faFolder,
                bgClass: 'bg-info',
            },
            {
                title: 'Total Complexes',
                value: expectedStatisticsData.totalComplexes,
                icon: faMusic,
                bgClass: 'bg-secondary',
            },
            {
                title: 'Available Complexes',
                value: expectedStatisticsData.availableComplexes,
                icon: faCheckCircle,
                bgClass: 'bg-success',
            },
        ];

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('statisticsData', {});
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `statisticsData`', () => {
            expectToEqual(component.statisticsData(), {});
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
            fixture.componentRef.setInput('statisticsData', expectedStatisticsData);
            fixture.detectChanges();
        });

        it('... should have updated `statisticsData`', () => {
            expectToEqual(component.statisticsData(), expectedStatisticsData);
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
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-cards', 1, 1);
            });

            it('... should have correct classes on cards div', () => {
                const cardsDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-cards', 1, 1);
                const cardsEl: HTMLElement = cardsDes[0].nativeElement;

                expectToBe(cardsEl.classList.length, 3);
                expectToContain(cardsEl.classList, 'awg-statistics-summary-cards');
                expectToContain(cardsEl.classList, 'row');
                expectToContain(cardsEl.classList, 'mb-4');
            });

            it('... should contain 4 div.col components in cards div', () => {
                const cardsDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-cards', 1, 1);
                getAndExpectDebugElementByCss(cardsDes[0], 'div.col-md-3.mb-3', 4, 4);
            });

            it('... should contain one card component (stubbed) in each col div', () => {
                const cardsDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-cards', 1, 1);
                const colDes = getAndExpectDebugElementByCss(cardsDes[0], 'div.col-md-3.mb-3', 4, 4);

                colDes.forEach(colDe => {
                    getAndExpectDebugElementByDirective(colDe, StatisticsSummaryCardStubComponent, 1, 1);
                });
            });

            it('... should pass down correct card data to each card component', () => {
                const cardsDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-cards', 1, 1);
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

            it('... should return empty array if `statisticsData` is falsy', () => {
                fixture.componentRef.setInput('statisticsData', null);

                expectToEqual(component.summaryCards(), []);
            });

            it('... should return correct summary card data based on `statisticsData`', () => {
                fixture.componentRef.setInput('statisticsData', expectedStatisticsData);

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
