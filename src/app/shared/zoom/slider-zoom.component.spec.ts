import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { faCompressArrowsAlt } from '@fortawesome/free-solid-svg-icons';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { ZoomConfig } from './zoom.model';

import { SliderZoomComponent } from './slider-zoom.component';

describe('SliderZoomComponent (DONE)', () => {
    let component: SliderZoomComponent;
    let fixture: ComponentFixture<SliderZoomComponent>;
    let compDe: DebugElement;

    let zoomValueChangeSpy: Mock<(zoomValue: number) => void>;
    let resetRequestSpy: Mock<() => void>;

    let expectedZoomConfig: ZoomConfig;

    const getContainerDes = () =>
        getAndExpectDebugElementByCss(compDe, 'div.input-group.input-group-sm.awg-slider-zoom-container', 1, 1);
    const getLabelEl = (): HTMLSpanElement =>
        getAndExpectDebugElementByCss(getContainerDes()[0], 'span.input-group-text', 1, 1)[0].nativeElement;
    const getRangeEl = (): HTMLInputElement =>
        getAndExpectDebugElementByCss(getContainerDes()[0], 'input[type="range"].awg-slider-zoom', 1, 1)[0]
            .nativeElement;
    const getButtonDes = () => getAndExpectDebugElementByCss(getContainerDes()[0], 'button.btn', 1, 1);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SliderZoomComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SliderZoomComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedZoomConfig = new ZoomConfig(1, 0.1, 10, 0.01);

        // Spies
        zoomValueChangeSpy = vi.fn();
        resetRequestSpy = vi.fn();
        component.zoomValue.subscribe(zoomValueChangeSpy);
        component.resetRequest.subscribe(resetRequestSpy);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `zoomConfig`', () => {
            expectToBe(isSignal(component.zoomConfig), true);

            expect(() => component.zoomConfig()).toThrow();
        });

        it('... should throw due to missing required model signal `zoomValue`', () => {
            expectToBe(isSignal(component.zoomValue), true);

            expect(() => component.zoomValue()).toThrow();
        });

        it('... should have `faCompressArrowsAlt` icon', () => {
            expectToEqual(component.faCompressArrowsAlt, faCompressArrowsAlt);
        });

        describe('VIEW', () => {
            it('... should contain one input group with a label, a range input and a button', () => {
                getLabelEl();
                getRangeEl();
                getButtonDes();
            });

            it('... should contain a reset button with type, title and aria-label', () => {
                const buttonEl: HTMLButtonElement = getButtonDes()[0].nativeElement;

                expectToBe(buttonEl.type, 'button');
                expectToBe(buttonEl.title, 'Zoom zurücksetzen');
                expectToBe(buttonEl.getAttribute('aria-label'), 'Zoom zurücksetzen');
                getAndExpectDebugElementByCss(getButtonDes()[0], 'fa-icon', 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('zoomConfig', expectedZoomConfig);
            fixture.componentRef.setInput('zoomValue', 1);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `zoomConfig` to hold the provided config', () => {
            expectToEqual(component.zoomConfig(), expectedZoomConfig);
        });

        it('... should have model signal `zoomValue` to hold the provided zoom value', () => {
            expectToBe(component.zoomValue(), 1);
        });

        describe('VIEW', () => {
            it('... should display the current value in the label', () => {
                expectToBe(getLabelEl().textContent, '1x');
            });

            it('... should set min, max, step and value of the range input from the zoom config and value', () => {
                const rangeEl = getRangeEl();

                expectToBe(rangeEl.min, '0.1');
                expectToBe(rangeEl.max, '10');
                expectToBe(rangeEl.step, '0.01');
                expectToBe(rangeEl.value, '1');
            });

            it('... should provide the zoom factor to assistive technologies via the range input only', () => {
                const rangeEl = getRangeEl();

                expectToBe(rangeEl.getAttribute('aria-label'), 'Zoom');
                expectToBe(rangeEl.getAttribute('aria-valuetext'), '1x');
                expectToBe(getLabelEl().getAttribute('aria-hidden'), 'true');
            });

            it('... should update label and range input for a value provided by the parent without emitting `zoomValueChange`', async () => {
                fixture.componentRef.setInput('zoomValue', 2.5);
                await detectChangesOnPush(fixture);

                expectToBe(getLabelEl().textContent, '2.5x');
                expectToBe(getRangeEl().value, '2.5');
                expectToBe(getRangeEl().getAttribute('aria-valuetext'), '2.5x');
                expectSpyCall(zoomValueChangeSpy, 0);
            });

            describe('... model `zoomValue`', () => {
                it('... should emit `zoomValueChange` with the new number on input of the range', async () => {
                    const rangeEl = getRangeEl();

                    rangeEl.value = '3.25';
                    rangeEl.dispatchEvent(new Event('input'));
                    await detectChangesOnPush(fixture);

                    expectSpyCall(zoomValueChangeSpy, 1, 3.25);
                    expectToBe(component.zoomValue(), 3.25);
                    expectToBe(getLabelEl().textContent, '3.25x');
                });
            });

            describe('... output `resetRequest`', () => {
                it('... should emit on click on the reset button', async () => {
                    await clickAndAwaitChanges(getButtonDes()[0], fixture);

                    expectSpyCall(resetRequestSpy, 1);
                });
            });
        });
    });
});
