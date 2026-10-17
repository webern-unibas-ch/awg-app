import { Component, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { MockMediaQueryList, stubMatchMedia } from '@testing/canvas-helper';
import { MockResizeObserver, stubResizeObserver } from '@testing/svg-drawing-helper';

import { CanvasViewport } from '../canvas.model';

import { CanvasViewportDirective } from './canvas-viewport.directive';

@Component({
    template: `<canvas awgCanvasViewport (resized)="resizedSpy($event)"></canvas>`,
    imports: [CanvasViewportDirective],
})
class CanvasViewportTestHostComponent {
    readonly resizedSpy: Mock<(viewport: CanvasViewport) => void> = vi.fn();
}

describe('CanvasViewportDirective (DONE)', () => {
    let fixture: ComponentFixture<CanvasViewportTestHostComponent>;
    let host: CanvasViewportTestHostComponent;
    let directive: CanvasViewportDirective;
    let canvasEl: HTMLCanvasElement;

    let mockResizeObservers: MockResizeObserver[];
    let mockMediaQueryLists: MockMediaQueryList[];

    const setCanvasClientSize = (width: number, height: number): void => {
        Object.defineProperty(canvasEl, 'clientWidth', { configurable: true, value: width });
        Object.defineProperty(canvasEl, 'clientHeight', { configurable: true, value: height });
    };

    beforeEach(async () => {
        // Stub the ResizeObserver and matchMedia (missing in jsdom)
        mockResizeObservers = stubResizeObserver();
        mockMediaQueryLists = stubMatchMedia();

        await TestBed.configureTestingModule({
            imports: [CanvasViewportTestHostComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CanvasViewportTestHostComponent);
        host = fixture.componentInstance;

        const directiveDe = getAndExpectDebugElementByDirective(fixture.debugElement, CanvasViewportDirective, 1, 1)[0];
        directive = directiveDe.injector.get(CanvasViewportDirective);
        canvasEl = directiveDe.nativeElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('... should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `viewport` to hold an empty viewport', () => {
            expectToBe(isSignal(directive.viewport), true);

            expectToEqual(directive.viewport(), { width: 0, height: 0, dpr: 1 });
        });

        it('... should not observe the canvas size yet', () => {
            expectToBe(mockResizeObservers.length, 0);
        });

        it('... should not observe the device pixel ratio yet', () => {
            expectToBe(mockMediaQueryLists.length, 0);
        });
    });

    describe('AFTER initial data binding', () => {
        let dpr: number;

        beforeEach(async () => {
            dpr = window.devicePixelRatio || 1;
            setCanvasClientSize(400, 200);

            // Trigger initial data binding (and the first rendering)
            await detectChangesOnPush(fixture);
        });

        it('... should have signal `viewport` to hold the client size and the device pixel ratio after the first rendering', () => {
            expectToEqual(directive.viewport(), { width: 400, height: 200, dpr });
        });

        it('... should observe the size of the canvas after the first rendering', () => {
            expectToBe(mockResizeObservers.length, 1);
            expectToEqual(mockResizeObservers[0].observedElements, [canvasEl]);
        });

        it('... should have signal `viewport` to hold the new client size on a resize of the canvas', () => {
            setCanvasClientSize(800, 400);

            mockResizeObservers[0].trigger();

            expectToEqual(directive.viewport(), { width: 800, height: 400, dpr });
        });

        it('... should emit the viewport on `resized` after the first rendering', () => {
            expectSpyCall(host.resizedSpy, 1, { width: 400, height: 200, dpr });
        });

        it('... should emit the new viewport on `resized` on a resize of the canvas', () => {
            setCanvasClientSize(800, 400);

            mockResizeObservers[0].trigger();

            expectSpyCall(host.resizedSpy, 2, { width: 800, height: 400, dpr });
        });

        it('... should not emit on `resized` and keep the backing store for an unchanged size', () => {
            mockResizeObservers[0].trigger();

            expectSpyCall(host.resizedSpy, 1);
            expectToBe(canvasEl.width, Math.round(400 * dpr));
            expectToBe(canvasEl.height, Math.round(200 * dpr));
        });

        it('... should disconnect the resize observer on destroy', () => {
            fixture.destroy();

            expectSpyCall(mockResizeObservers[0].disconnect, 1);
        });

        describe('... device pixel ratio', () => {
            // Changes the device pixel ratio and notifies the media query of the current one
            const changeDevicePixelRatio = (newDpr: number): void => {
                vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(newDpr);
                mockMediaQueryLists[mockMediaQueryLists.length - 1].trigger();
            };

            it('... should observe the device pixel ratio after the first rendering', () => {
                expectToBe(mockMediaQueryLists.length, 1);
                expectToBe(mockMediaQueryLists[0].media, `(resolution: ${dpr}dppx)`);
                expectToBe(mockMediaQueryLists[0].listeners.length, 1);
            });

            it('... should have signal `viewport` to hold the new device pixel ratio on a change of the device pixel ratio', () => {
                changeDevicePixelRatio(dpr + 1);

                expectToEqual(directive.viewport(), { width: 400, height: 200, dpr: dpr + 1 });
                expectToBe(canvasEl.width, Math.round(400 * (dpr + 1)));
                expectToBe(canvasEl.height, Math.round(200 * (dpr + 1)));
            });

            it('... should emit the new viewport on `resized` on a change of the device pixel ratio', () => {
                changeDevicePixelRatio(dpr + 1);

                expectSpyCall(host.resizedSpy, 2, { width: 400, height: 200, dpr: dpr + 1 });
            });

            it('... should observe the new device pixel ratio after a change', () => {
                changeDevicePixelRatio(dpr + 1);

                expectToBe(mockMediaQueryLists.length, 2);
                expectToBe(mockMediaQueryLists[0].listeners.length, 0);
                expectToBe(mockMediaQueryLists[1].media, `(resolution: ${dpr + 1}dppx)`);
                expectToBe(mockMediaQueryLists[1].listeners.length, 1);
            });

            it('... should stop observing the device pixel ratio on destroy', () => {
                changeDevicePixelRatio(dpr + 1);

                fixture.destroy();

                expectToBe(mockMediaQueryLists[1].listeners.length, 0);
            });
        });

        describe('METHODS', () => {
            describe('#_measure()', () => {
                it('... should have a method `_measure`', () => {
                    expect(directive['_measure']).toBeDefined();
                });

                it('... should size the backing store of the canvas by the device pixel ratio', () => {
                    setCanvasClientSize(800, 400);

                    directive['_measure']();

                    expectToBe(canvasEl.width, Math.round(800 * dpr));
                    expectToBe(canvasEl.height, Math.round(400 * dpr));
                });

                it('... should use a device pixel ratio of 1 if the window has none', () => {
                    vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(0);

                    directive['_measure']();

                    expectToEqual(directive.viewport(), { width: 400, height: 200, dpr: 1 });
                });
            });

            describe('#_observeDevicePixelRatio()', () => {
                it('... should have a method `_observeDevicePixelRatio`', () => {
                    expect(directive['_observeDevicePixelRatio']).toBeDefined();
                });

                it('... should observe the media query of a device pixel ratio of 1 if the window has none', () => {
                    vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(0);

                    directive['_observeDevicePixelRatio']();

                    expectToBe(mockMediaQueryLists[mockMediaQueryLists.length - 1].media, '(resolution: 1dppx)');
                });

                it('... should not observe without `matchMedia`', () => {
                    vi.stubGlobal('matchMedia', undefined);
                    const mediaQueryListCount = mockMediaQueryLists.length;

                    expect(() => directive['_observeDevicePixelRatio']()).not.toThrow();
                    expectToBe(mockMediaQueryLists.length, mediaQueryListCount);
                });
            });

            describe('#_observeResize()', () => {
                it('... should have a method `_observeResize`', () => {
                    expect(directive['_observeResize']).toBeDefined();
                });

                it('... should observe the size of the canvas and remeasure it on a resize', () => {
                    directive['_observeResize']();
                    const resizeObserver = mockResizeObservers[mockResizeObservers.length - 1];
                    setCanvasClientSize(800, 400);

                    resizeObserver.trigger();

                    expectToEqual(resizeObserver.observedElements, [canvasEl]);
                    expectToEqual(directive.viewport(), { width: 800, height: 400, dpr });
                });
            });
        });
    });
});
