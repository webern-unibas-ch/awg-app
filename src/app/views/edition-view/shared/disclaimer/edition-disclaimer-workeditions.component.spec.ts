import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { faCalendarXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap/popover';

import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionDisclaimerWorkeditionsComponent } from './edition-disclaimer-workeditions.component';

describe('EditionDisclaimerWorkeditionsComponent (DONE)', () => {
    let component: EditionDisclaimerWorkeditionsComponent;
    let fixture: ComponentFixture<EditionDisclaimerWorkeditionsComponent>;
    let compDe: DebugElement;

    let expectedDisclaimer: string;
    let expectedFaCalendarXmark: IconDefinition;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionDisclaimerWorkeditionsComponent, NgbPopoverModule],
        }).compileComponents();

        // Disable ng-bootstrap animations
        TestBed.inject(NgbConfig).animation = false;
    });

    beforeEach(() => {
        // Test data
        expectedDisclaimer =
            'Werkeditionen sind aus rechtlichen Gründen frühestens ab 2049 online verfügbar. Bis dahin konsultieren Sie bitte die entsprechende Printausgabe.';
        expectedFaCalendarXmark = faCalendarXmark;

        // Create component fixture
        fixture = TestBed.createComponent(EditionDisclaimerWorkeditionsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `DISCLAIMER`', () => {
            expectToEqual(component.DISCLAIMER, expectedDisclaimer);
        });

        it('... should have `faCalendarXmark`', () => {
            expectToEqual(component.faCalendarXmark, expectedFaCalendarXmark);
        });

        it('... should have correct `config`', () => {
            expectToBe(component.config.placement, 'top');
            expectToBe(component.config.container, 'body');
            expectToBe(component.config.triggers, 'mouseenter:mouseleave');
        });

        describe('VIEW', () => {
            it('... should contain a text-danger span', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToContain(spanEl.classList, 'text-danger');
            });

            it('... should contain a fa-icon in text-danger span', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);

                getAndExpectDebugElementByCss(spanDes[0], 'fa-icon', 1, 1);
            });

            it('... should contain no CalendarXmark in fa-icon yet', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);

                const faIconDes = getAndExpectDebugElementByCss(spanDes[0], 'fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;

                expect(faIconIns()).toBeUndefined();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should contain a fa-icon with CalendarXmark in text-danger span', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);

                const faIconDes = getAndExpectDebugElementByCss(spanDes[0], 'fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;

                expectToEqual(faIconIns(), expectedFaCalendarXmark);
            });
        });
    });
});
