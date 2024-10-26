import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faCircleInfo, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { NgbAlert, NgbAlertModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

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

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAlertModule], exports: [NgbAlertModule] })
    class NgbAnimationConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, NgbAnimationConfigModule],
            declarations: [AlertInfoComponent],
        }).compileComponents();

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
        it('... should not have `infoMessage`', () => {
            expect(component.infoMessage).toBeUndefined();
        });

        it('... should have `faCircleInfo`', () => {
            expectToEqual(component.faCircleInfo, expectedFaCircleInfo);
        });

        it('... should have `isOpen` set to true', () => {
            expect(component.isOpen).toBe(true);
        });

        it('... should have `type` set to `info`', () => {
            expect(component.type).toBe('info');
        });

        describe('VIEW', () => {
            it('... should not have a ngbAlert component yet', () => {
                getAndExpectDebugElementByDirective(compDe, NgbAlert, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            component.infoMessage = expectedInfoMessage;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should have one ngbAlert component', () => {
                getAndExpectDebugElementByDirective(compDe, NgbAlert, 1, 1);
            });

            it('... should have a centered, muted, small paragraph in ngbAlert component', () => {
                const alertDes = getAndExpectDebugElementByDirective(compDe, NgbAlert, 1, 1);
                const pDes = getAndExpectDebugElementByCss(alertDes[0], 'p', 1, 1);
                const pEl = pDes[0].nativeElement;

                expectToBe(pEl.classList.contains('small'), true);
                expectToBe(pEl.classList.contains('text-muted'), true);
                expectToBe(pEl.classList.contains('text-center'), true);
            });

            it('... should display circle info icon in alert paragraph', () => {
                const alertDes = getAndExpectDebugElementByDirective(compDe, NgbAlert, 1, 1);
                const pDes = getAndExpectDebugElementByCss(alertDes[0], 'p', 1, 1);
                const faIconDes = getAndExpectDebugElementByCss(pDes[0], 'fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;

                expectToEqual(faIconIns, expectedFaCircleInfo);
            });

            it('... should display an error message in alert paragraph', () => {
                const alertDes = getAndExpectDebugElementByDirective(compDe, NgbAlert, 1, 1);
                const pDes = getAndExpectDebugElementByCss(alertDes[0], 'p', 1, 1);
                const pEl = pDes[0].nativeElement;

                expectToContain(pEl.textContent.trim(), expectedInfoMessage);
            });
        });
    });
});
