import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { StatisticsSummaryCardComponent } from './statistics-summary-card.component';

describe('StatisticsCardComponent', () => {
    let component: StatisticsSummaryCardComponent;
    let fixture: ComponentFixture<StatisticsSummaryCardComponent>;
    let compDe: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StatisticsSummaryCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StatisticsSummaryCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('... should display the title', () => {
        component.title = 'Test Title';
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expectToBe(compiled.querySelector('small').textContent, 'Test Title');
    });

    it('... should display the value', () => {
        component.value = 42;
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expectToBe(compiled.querySelector('h4').textContent, '42');
    });

    it('... should apply the background class', () => {
        component.bgClass = 'bg-primary';
        fixture.detectChanges();

        const cardDes = getAndExpectDebugElementByCss(compDe, '.card', 1, 1);
        const cardEl: HTMLDivElement = cardDes[0].nativeElement;

        expectToContain(cardEl.classList, 'bg-primary');
    });

    it('... should display the icon', () => {
        component.icon = 'fas fa-test';
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expectToBe(compiled.querySelector('i')?.classList.contains('fas'), true);
        expectToBe(compiled.querySelector('i')?.classList.contains('fa-test'), true);
    });
});
