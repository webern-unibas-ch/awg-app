import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToBe, expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionSectionDetailDisclaimerComponent } from './edition-section-detail-disclaimer.component';

describe('EditionSectionDetailDisclaimerComponent (DONE)', () => {
    let component: EditionSectionDetailDisclaimerComponent;
    let fixture: ComponentFixture<EditionSectionDetailDisclaimerComponent>;
    let compDe: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionSectionDetailDisclaimerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionSectionDetailDisclaimerComponent);
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
        describe('VIEW', () => {
            it('... should contain one div.alert-info', () => {
                getAndExpectDebugElementByCss(compDe, 'div.alert-info', 1, 1);
            });

            it('... should contain one centered, muted, small paragraph in div.alert-info', () => {
                const divDe = getAndExpectDebugElementByCss(compDe, 'div.alert-info', 1, 1);
                const pDe = getAndExpectDebugElementByCss(divDe[0], 'p', 1, 1);
                const pEl = pDe[0].nativeElement;

                expectToContain(pEl.classList, 'small');
                expectToContain(pEl.classList, 'text-muted');
                expectToContain(pEl.classList, 'text-center');
            });

            it('... should display disclaimer in paragraph', () => {
                const divDe = getAndExpectDebugElementByCss(compDe, 'div.alert-info', 1, 1);
                const pDe = getAndExpectDebugElementByCss(divDe[0], 'p', 1, 1);
                const pEl = pDe[0].nativeElement;

                const expectedDisclaimer = `[Die online verfügbaren Inhalte werden sukzessive ergänzt und erweitert.]`;

                expectToBe(pEl.textContent.trim(), expectedDisclaimer.trim());
            });
        });
    });

    // No tests for the 'AFTER initial data binding' phase needed
});
