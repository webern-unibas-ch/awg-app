import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { CanvasPoint } from '../canvas.model';

import { CanvasTooltipComponent } from './canvas-tooltip.component';

describe('CanvasTooltipComponent (DONE)', () => {
    let component: CanvasTooltipComponent;
    let fixture: ComponentFixture<CanvasTooltipComponent>;
    let compDe: DebugElement;

    const expectedPoint: CanvasPoint = { x: 300, y: 100 };
    const expectedText = 'awg:B';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CanvasTooltipComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Create component fixture
        fixture = TestBed.createComponent(CanvasTooltipComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `point` to hold undefined initially', () => {
            expectToBe(isSignal(component.point), true);

            expect(component.point()).toBeUndefined();
        });

        it('... should have input signal `text` to hold undefined initially', () => {
            expectToBe(isSignal(component.text), true);

            expect(component.text()).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one tooltip anchor with one NgbTooltip', () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-canvas-tooltip-anchor', 1, 1);
                const anchorEl: HTMLSpanElement = anchorDes[0].nativeElement;
                const tooltipDes = getAndExpectDebugElementByDirective(compDe, NgbTooltip, 1, 1);
                const tooltipEl: HTMLElement = tooltipDes[0].nativeElement;

                expectToBe(tooltipEl, anchorEl);
            });

            it('... should not contain an open tooltip yet', () => {
                getAndExpectDebugElementByCss(compDe, 'ngb-tooltip-window', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            fixture.componentRef.setInput('point', expectedPoint);
            fixture.componentRef.setInput('text', expectedText);
            await detectChangesOnPush(fixture);
        });

        it('... should have input signal `point` to hold the provided point', () => {
            expectToEqual(component.point(), expectedPoint);
        });

        it('... should have input signal `text` to hold the provided text', () => {
            expectToBe(component.text(), expectedText);
        });

        describe('VIEW', () => {
            it('... should set the tooltip anchor to the provided point', () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-canvas-tooltip-anchor', 1, 1);
                const anchorEl: HTMLSpanElement = anchorDes[0].nativeElement;

                expectToBe(anchorEl.style.left, '300px');
                expectToBe(anchorEl.style.top, '100px');
            });

            it('... should pass down the text and the manual configuration to the NgbTooltip', () => {
                const tooltip = component.tooltip();

                expectToBe(tooltip.ngbTooltip, expectedText);
                expectToBe(tooltip.tooltipClass, 'awg-canvas-tooltip');
                expectToBe(tooltip.triggers, 'manual');
                expectToBe(tooltip.placement, 'end start top bottom');
                expectToBe(tooltip.animation, false);
                expectToBe(tooltip.autoClose, false);
            });

            it('... should contain an open tooltip with the provided text', () => {
                const tooltipWindowDes = getAndExpectDebugElementByCss(compDe, 'ngb-tooltip-window', 1, 1);
                const tooltipWindowEl: HTMLElement = tooltipWindowDes[0].nativeElement;

                expectToBe(tooltipWindowEl.textContent?.trim(), expectedText);
                expectToBe(tooltipWindowEl.classList.contains('awg-canvas-tooltip'), true);
            });

            it('... should close the tooltip without a text', async () => {
                fixture.componentRef.setInput('text', undefined);
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'ngb-tooltip-window', 0, 0);
            });

            it('... should close the tooltip without a point', async () => {
                fixture.componentRef.setInput('point', undefined);
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'ngb-tooltip-window', 0, 0);
            });
        });

        describe('METHODS', () => {
            describe('#_updateTooltip()', () => {
                it('... should have a method `_updateTooltip`', () => {
                    expect(component['_updateTooltip']).toBeDefined();
                });

                it('... should close the tooltip and open it again if it is shown', () => {
                    const closeSpy = vi.spyOn(component.tooltip(), 'close');
                    const openSpy = vi.spyOn(component.tooltip(), 'open');

                    component['_updateTooltip'](true);

                    expectSpyCall(closeSpy, 1, false);
                    expectSpyCall(openSpy, 1);
                });

                it('... should only close the tooltip if it is not shown', () => {
                    const closeSpy = vi.spyOn(component.tooltip(), 'close');
                    const openSpy = vi.spyOn(component.tooltip(), 'open');

                    component['_updateTooltip'](false);

                    expectSpyCall(closeSpy, 1, false);
                    expectSpyCall(openSpy, 0);
                });
            });
        });
    });
});
