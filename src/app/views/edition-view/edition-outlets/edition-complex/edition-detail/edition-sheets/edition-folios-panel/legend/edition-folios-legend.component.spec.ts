import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { EditionFoliosLegendComponent } from './edition-folios-legend.component';

describe('EditionFoliosLegendComponent (DONE)', () => {
    let component: EditionFoliosLegendComponent;
    let fixture: ComponentFixture<EditionFoliosLegendComponent>;
    let compDe: DebugElement;

    const expectedFolioLegends = [
        { colorClass: 'olivedrab', label: 'aktuell ausgewählt' },
        { colorClass: 'orange', label: 'auswählbar' },
        { colorClass: 'grey', label: '(momentan noch) nicht auswählbar' },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionFoliosLegendComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Create component fixture
        fixture = TestBed.createComponent(EditionFoliosLegendComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `faSquare` to hold the square icon', () => {
            expectToEqual(component.faSquare, faSquare);
        });

        it('... should have `folioLegends` to hold the three legend entries', () => {
            expectToEqual(component.folioLegends, expectedFolioLegends);
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-edition-folios-legend with the legend title', () => {
                const legendDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-folios-legend', 1, 1);

                expectToBe(legendDes[0].nativeElement.textContent.trim().startsWith('Legende:'), true);
            });

            it('... should not contain legend entries yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-folios-legend > span', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should contain one span with color class and label per legend entry', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-folios-legend > span', 3, 3);

                spanDes.forEach((spanDe, index) => {
                    const spanEl: HTMLSpanElement = spanDe.nativeElement;

                    expectToBe(spanEl.className, expectedFolioLegends[index].colorClass);
                    expectToBe(spanEl.textContent.trim(), expectedFolioLegends[index].label);
                });
            });

            it('... should display the square icon in each legend entry', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-folios-legend > span', 3, 3);

                spanDes.forEach(spanDe => {
                    const faIconDes = getAndExpectDebugElementByDirective(spanDe, FaIconComponent, 1, 1);

                    expectToEqual(faIconDes[0].injector.get(FaIconComponent).icon(), faSquare);
                });
            });
        });
    });
});
