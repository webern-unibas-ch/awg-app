import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { StatisticsBreakdownBadgeComponent } from './statistics-breakdown-badge.component';

fdescribe('StatisticsBreakdownBadgeComponent', () => {
    let component: StatisticsBreakdownBadgeComponent;
    let fixture: ComponentFixture<StatisticsBreakdownBadgeComponent>;
    let compDe: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StatisticsBreakdownBadgeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StatisticsBreakdownBadgeComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have default `breakdown`', () => {
            expectToEqual(component.breakdown, { opus: 0, mnr: 0, mnrX: 0 });
        });

        it('... should have default `containerClasses`', () => {
            expectToEqual(component.containerClasses, 'small text-muted');
        });

        it('... should have default `hideEmpty`', () => {
            expectToBe(component.hideEmpty, true);
        });

        describe('VIEW', () => {
            it('... should contain one outer div container', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-breakdown-badge-container', 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent component setting the input properties
            component.breakdown = { opus: 5, mnr: 10, mnrX: 3 };
            component.containerClasses = 'custom-class';
            component.hideEmpty = false;

            fixture.detectChanges();
        });

        it('... should have updated breakdown input properties', () => {
            expectToEqual(component.breakdown, { opus: 5, mnr: 10, mnrX: 3 });
        });

        it('... should have updated containerClasses input properties', () => {
            expectToEqual(component.containerClasses, 'custom-class');
        });

        it('... should have updated hideEmpty input properties', () => {
            expectToBe(component.hideEmpty, false);
        });

        describe('VIEW', () => {});

        describe('Badge display logic', () => {
            it('... should hide empty badges when hideEmpty is true', () => {
                component.breakdown = { opus: 5, mnr: 0, mnrX: 3 };
                component.hideEmpty = true;
                fixture.detectChanges();

                const compiled = fixture.nativeElement;
                const badges = compiled.querySelectorAll('.badge');

                // Should only show opus and mnrX badges, not mnr
                expectToEqual(badges.length, 2);
                expectToContain(compiled.textContent, 'Op: 5');
                expectToContain(compiled.textContent, 'M*: 3');
                expect(compiled.textContent).not.toContain('M: 0');
            });

            it('... should show all badges when hideEmpty is false', () => {
                component.breakdown = { opus: 5, mnr: 0, mnrX: 3 };
                component.hideEmpty = false;
                fixture.detectChanges();

                const compiled = fixture.nativeElement;
                const badges = compiled.querySelectorAll('.badge');

                // Should show all three badges
                expectToEqual(badges.length, 3);
                expectToContain(compiled.textContent, 'Op: 5');
                expectToContain(compiled.textContent, 'M: 0');
                expectToContain(compiled.textContent, 'M*: 3');
            });
        });
    });
});
