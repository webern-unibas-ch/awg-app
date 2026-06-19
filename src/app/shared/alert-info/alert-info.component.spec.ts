import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { faCircleInfo, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { NgbAlert, NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap/alert';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { AlertInfoComponent } from './alert-info.component';

describe('AlertInfoComponent (DONE)', () => {
    let component: AlertInfoComponent;
    let fixture: ComponentFixture<AlertInfoComponent>;
    let compDe: DebugElement;

    let expectedInfoMessage: string;
    let expectedFaCircleInfo: IconDefinition;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AlertInfoComponent],
        }).compileComponents();

        // Disable animation for NgbAlert to avoid timing issues in tests
        const alertConfig = TestBed.inject(NgbAlertConfig);
        alertConfig.animation = false;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AlertInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedFaCircleInfo = faCircleInfo;
        expectedInfoMessage = 'This is an info message.';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have default `infoMessage`', () => {
            expectToBe(component.infoMessage(), '');
        });

        it('... should have `faCircleInfo`', () => {
            expectToEqual(component.faCircleInfo, expectedFaCircleInfo);
        });

        it('... should have default `isOpen`', () => {
            expectToBe(component.isOpen(), true);
        });

        describe('VIEW', () => {
            it('... should not have a ngbAlert component yet', () => {
                getAndExpectDebugElementByDirective(compDe, NgbAlert, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('infoMessage', expectedInfoMessage);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have updated `infoMessage`', () => {
            expectToBe(component.infoMessage(), expectedInfoMessage);
        });

        describe('VIEW', () => {
            it('... should have one ngbAlert component', () => {
                getAndExpectDebugElementByDirective(compDe, NgbAlert, 1, 1);
            });

            it('... should have a centered, muted, small paragraph in ngbAlert component', () => {
                const alertDes = getAndExpectDebugElementByDirective(compDe, NgbAlert, 1, 1);
                const pDes = getAndExpectDebugElementByCss(alertDes[0], 'p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.classList.contains('small'), true);
                expectToBe(pEl.classList.contains('text-muted'), true);
                expectToBe(pEl.classList.contains('text-center'), true);
            });

            it('... should display circle info icon in alert paragraph', () => {
                const alertDes = getAndExpectDebugElementByDirective(compDe, NgbAlert, 1, 1);
                const pDes = getAndExpectDebugElementByCss(alertDes[0], 'p', 1, 1);
                const faIconDes = getAndExpectDebugElementByCss(pDes[0], 'fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;

                expectToEqual(faIconIns(), expectedFaCircleInfo);
            });

            it('... should display an info message in alert paragraph', () => {
                const alertDes = getAndExpectDebugElementByDirective(compDe, NgbAlert, 1, 1);
                const pDes = getAndExpectDebugElementByCss(alertDes[0], 'p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToContain(pEl.textContent.trim(), expectedInfoMessage);
            });

            it('... should remove the alert when isOpen is set to false from outside', () => {
                fixture.componentRef.setInput('isOpen', false);
                fixture.detectChanges();

                getAndExpectDebugElementByDirective(compDe, NgbAlert, 0, 0);
            });

            it('... should set isOpen to false when the alert is closed', () => {
                expectToBe(component.isOpen(), true);

                // 1. Das closed-Event von ngb-alert simulieren
                const alertDes = getAndExpectDebugElementByDirective(compDe, NgbAlert, 1, 1);
                const alertCmp = alertDes[0].injector.get(NgbAlert) as NgbAlert;
                alertCmp.closed.emit();

                fixture.detectChanges();

                expectToBe(component.isOpen(), false);
            });
        });
    });
});
