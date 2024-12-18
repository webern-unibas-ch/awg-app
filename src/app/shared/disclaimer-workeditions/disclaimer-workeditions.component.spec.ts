import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IconDefinition } from '@fortawesome/angular-fontawesome';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faCalendarXmark } from '@fortawesome/free-solid-svg-icons';

import { NgbConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { DisclaimerWorkeditionsComponent } from './disclaimer-workeditions.component';

describe('DisclaimerWorkeditionsComponent', () => {
    let component: DisclaimerWorkeditionsComponent;
    let fixture: ComponentFixture<DisclaimerWorkeditionsComponent>;
    let compDe: DebugElement;

    let expectedDisclaimer: string;
    let expectedFaCalendarXmark: IconDefinition;

    // global NgbConfigModule
    @NgModule({ imports: [NgbPopoverModule], exports: [NgbPopoverModule] })
    class NgbConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, NgbConfigModule],
            declarations: [DisclaimerWorkeditionsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DisclaimerWorkeditionsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedDisclaimer =
            'Werkeditionen sind aus rechtlichen Gründen frühestens ab 2049 online verfügbar. Bis dahin konsultieren Sie bitte die entsprechende Printausgabe.';
        expectedFaCalendarXmark = faCalendarXmark;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `disclaimer`', () => {
            expectToEqual(component.disclaimer, expectedDisclaimer);
        });

        it('... should have `faCalendarXmark`', () => {
            expectToEqual(component.faCalendarXmark, expectedFaCalendarXmark);
        });

        it('... should have correct NgbPopoverConfig', () => {
            expectToBe(component.config.placement, 'top');
            expectToBe(component.config.container, 'body');
            expectToBe(component.config.triggers, 'mouseenter:mouseleave');
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should contain a text-danger span', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToContain(spanEl.classList, 'text-danger');
            });

            it('... should contain a fa-icon with Xmark in text-danger span', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);

                const faIconDes = getAndExpectDebugElementByCss(spanDes[0], 'fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;

                expectToEqual(faIconIns, expectedFaCalendarXmark);
            });
        });
    });
});
