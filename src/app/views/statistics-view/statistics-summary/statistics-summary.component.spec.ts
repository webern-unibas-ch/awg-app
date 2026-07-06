import { Component, DebugElement, input, isSignal } from '@angular/core';
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

import { StatisticsSummaryCardData, StatisticsSummaryData } from '../models/statistics.model';
import { StatisticsSummaryCardComponent } from '../statistics-summary-card/statistics-summary-card.component';

import { StatisticsSummaryComponent } from './statistics-summary.component';

// Mock components
@Component({
    selector: 'awg-statistics-summary-card',
    template: '',
})
class StatisticsSummaryCardStubComponent {
    title = input.required<string>();
    value = input.required<number | string>();
    icon = input.required<IconDefinition>();
    bgClass = input.required<string>();
}

describe('StatisticsSummaryComponent', () => {
    let component: StatisticsSummaryComponent;
    let fixture: ComponentFixture<StatisticsSummaryComponent>;
    let compDe: DebugElement;

    let expectedSummaryData: StatisticsSummaryData;
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
    });

    beforeEach(() => {
        // Test data
        expectedSummaryData = {
            activeSeries: 5,
            activeSections: 10,
            activeComplexes: 8,
            totalComplexes: 15,
        };

        expectedSummaryCards = [
            { title: 'Active Series', value: expectedSummaryData.activeSeries, icon: faList, bgClass: 'bg-primary' },
            {
                title: 'Active Sections',
                value: expectedSummaryData.activeSections,
                icon: faFolder,
                bgClass: 'bg-info',
            },
            {
                title: 'Total Complexes',
                value: expectedSummaryData.totalComplexes,
                icon: faMusic,
                bgClass: 'bg-secondary',
            },
            {
                title: 'Active Complexes',
                value: expectedSummaryData.activeComplexes,
                icon: faCheckCircle,
                bgClass: 'bg-success',
            },
        ];

        // Create component fixture
        fixture = TestBed.createComponent(StatisticsSummaryComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `summaryData`', () => {
            expectToBe(isSignal(component.summaryData), true);

            expect(() => component.summaryData()).toThrow();
        });

        it('... should throw when accessing computed signal `summaryCards` due to missing input', () => {
            expectToBe(isSignal(component.summaryCards), true);

            expect(() => component.summaryCards()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no cards div yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-card', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs signal
            fixture.componentRef.setInput('summaryData', expectedSummaryData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `summaryData` to hold the provided identifiers', () => {
            expectToEqual(component.summaryData(), expectedSummaryData);
        });

        it('... should have computed signal `summaryCards` to hold the expected cards', () => {
            const summaryCards = component.summaryCards();

            expectToBe(summaryCards.length, 4);
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
    });
});
