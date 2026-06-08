import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { faMusic, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { StatisticsSummaryCardComponent } from './statistics-summary-card.component';

describe('StatisticsCardComponent', () => {
    let component: StatisticsSummaryCardComponent;
    let fixture: ComponentFixture<StatisticsSummaryCardComponent>;
    let compDe: DebugElement;

    let expectedTitle: string;
    let expectedValue: number;
    let expectedIcon: IconDefinition;
    let expectedBgClass: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatisticsSummaryCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StatisticsSummaryCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedTitle = 'Test Title';
        expectedValue = 42;
        expectedIcon = faMusic;
        expectedBgClass = 'bg-primary';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have unassigned `title`', () => {
            expect(component.title()).toBeUndefined();
        });

        it('... should have unassigned `value`', () => {
            expect(component.value()).toBeUndefined();
        });

        it('... should have unassigend `icon`', () => {
            expect(component.icon()).toBeUndefined();
        });

        it('... should have unassigned `bgClass`', () => {
            expect(component.bgClass()).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one card div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-card', 1, 1);
            });

            it('... should have only default classes on card div, no background class', () => {
                const cardDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-card', 1, 1);
                const cardEl: HTMLDivElement = cardDes[0].nativeElement;

                expectToBe(cardEl.classList.length, 3);
                expectToContain(cardEl.classList, 'awg-statistics-summary-card');
                expectToContain(cardEl.classList, 'card');
                expectToContain(cardEl.classList, 'text-white');
            });

            it('... should contain one card-body div on card div', () => {
                const cardDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-card', 1, 1);

                getAndExpectDebugElementByCss(cardDes[0], 'div.card-body', 1, 1);
            });

            it('... should contain one div with flex classes on card-body div', () => {
                const cardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                getAndExpectDebugElementByCss(cardBodyDes[0], 'div.d-flex.justify-content-between', 1, 1);
            });

            it('... should contain one content div and one icon div on flex div', () => {
                const flexDes = getAndExpectDebugElementByCss(compDe, 'div.d-flex.justify-content-between', 1, 1);

                getAndExpectDebugElementByCss(flexDes[0], 'div.awg-statistics-summary-card-content', 1, 1);
                getAndExpectDebugElementByCss(flexDes[0], 'div.awg-statistics-summary-card-icon', 1, 1);
            });

            it('... should contain one h4 and one small element on content div', () => {
                const contentDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-statistics-summary-card-content',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(contentDes[0], 'h4.mb-0', 1, 1);
                getAndExpectDebugElementByCss(contentDes[0], 'small', 1, 1);
            });

            it('... should not display title or value in content div', () => {
                const contentDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-statistics-summary-card-content',
                    1,
                    1
                );
                const hDes = getAndExpectDebugElementByCss(contentDes[0], 'h4.mb-0', 1, 1);
                const smallDes = getAndExpectDebugElementByCss(contentDes[0], 'small', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;
                const smallEl: HTMLElement = smallDes[0].nativeElement;

                expectToBe(hEl.textContent, '');
                expectToBe(smallEl.textContent, '');
            });

            it('... should contain one fa-icon element on icon div', () => {
                const iconDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-card-icon', 1, 1);

                getAndExpectDebugElementByCss(iconDes[0], 'fa-icon', 1, 1);
            });

            it('... should have default classes on fa-icon element', () => {
                const iconDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-card-icon', 1, 1);
                const faIconDes = getAndExpectDebugElementByCss(iconDes[0], 'fa-icon', 1, 1);
                const faIconEl: HTMLElement = faIconDes[0].nativeElement;

                expectToContain(faIconEl.classList, 'fa-2x');
                expectToContain(faIconEl.classList, 'opacity-75');
            });

            it('... should have aria-hidden attribute on fa-icon element', () => {
                const iconDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-card-icon', 1, 1);
                const faIconDes = getAndExpectDebugElementByCss(iconDes[0], 'fa-icon', 1, 1);
                const faIconEl: HTMLElement = faIconDes[0].nativeElement;

                expectToBe(faIconEl.hasAttribute('aria-hidden'), true);
            });

            it('... should not display an icon in fa-icon element', () => {
                const iconDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-card-icon', 1, 1);
                const faIconDes = getAndExpectDebugElementByCss(iconDes[0], 'fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;

                expect(faIconIns()).toBeUndefined();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent component updating the input signals
            fixture.componentRef.setInput('title', expectedTitle);
            fixture.componentRef.setInput('value', expectedValue);
            fixture.componentRef.setInput('icon', expectedIcon);
            fixture.componentRef.setInput('bgClass', expectedBgClass);

            fixture.detectChanges();
        });

        it('... should have updated `title`', () => {
            expectToBe(component.title(), expectedTitle);
        });

        it('... should have updated `value`', () => {
            expectToBe(component.value(), expectedValue);
        });

        it('... should have updated `icon`', () => {
            expectToBe(component.icon(), expectedIcon);
        });

        it('... should have updated `bgClass`', () => {
            expectToBe(component.bgClass(), expectedBgClass);
        });

        describe('VIEW', () => {
            it('... should have applied background class on card div', () => {
                const cardDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-card', 1, 1);
                const cardEl: HTMLDivElement = cardDes[0].nativeElement;

                expectToBe(cardEl.classList.length, 4);
                expectToContain(cardEl.classList, 'awg-statistics-summary-card');
                expectToContain(cardEl.classList, 'card');
                expectToContain(cardEl.classList, 'text-white');
                expectToContain(cardEl.classList, expectedBgClass);
            });

            it('... should display the title in small element', () => {
                const contentDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-statistics-summary-card-content',
                    1,
                    1
                );
                const smallDes = getAndExpectDebugElementByCss(contentDes[0], 'small', 1, 1);
                const smallEl: HTMLElement = smallDes[0].nativeElement;

                expectToBe(smallEl.textContent, expectedTitle);
            });

            it('... should display the value in h4 element', () => {
                const contentDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-statistics-summary-card-content',
                    1,
                    1
                );
                const hDes = getAndExpectDebugElementByCss(contentDes[0], 'h4.mb-0', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent, expectedValue.toString());
            });

            it('... should display the icon in fa-icon element', () => {
                const iconDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-card-icon', 1, 1);
                const faIconDes = getAndExpectDebugElementByCss(iconDes[0], 'fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;

                expectToEqual(faIconIns(), expectedIcon);
            });
        });
    });
});
