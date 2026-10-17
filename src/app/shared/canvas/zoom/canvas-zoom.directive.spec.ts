import { Component, DebugElement, isSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as D3_ZOOM from 'd3-zoom';

import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { ZoomConfig } from '@awg-shared/zoom/zoom.model';

import { CanvasSize } from '../canvas.model';

import { CanvasZoomDirective } from './canvas-zoom.directive';
import { CanvasZoomFilter } from './canvas-zoom.model';

@Component({
    template: `<canvas
        awgCanvasZoom
        [zoomConfig]="zoomConfig()"
        [zoomFilter]="zoomFilter()"
        [(zoomValue)]="scale"></canvas>`,
    imports: [CanvasZoomDirective],
})
class CanvasZoomTestHostComponent {
    readonly zoomConfig = signal(new ZoomConfig(1, 0.1, 10, 0.01));
    readonly zoomFilter = signal<CanvasZoomFilter>(() => true);
    readonly scale = signal(1);
}

describe('CanvasZoomDirective (DONE)', () => {
    let fixture: ComponentFixture<CanvasZoomTestHostComponent>;
    let host: CanvasZoomTestHostComponent;
    let directive: CanvasZoomDirective;
    let canvasEl: HTMLCanvasElement;

    const getDirectiveDes = (): DebugElement[] =>
        getAndExpectDebugElementByDirective(fixture.debugElement, CanvasZoomDirective, 1, 1);
    const getCurrentTransform = () => D3_ZOOM.zoomTransform(canvasEl);
    const filter = (event: Partial<MouseEvent | WheelEvent | TouchEvent>): boolean =>
        directive['_zoomBehaviour'].filter().call(canvasEl, event as MouseEvent, undefined);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CanvasZoomTestHostComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CanvasZoomTestHostComponent);
        host = fixture.componentInstance;

        const directiveDe = getDirectiveDes()[0];
        directive = directiveDe.injector.get(CanvasZoomDirective);
        canvasEl = directiveDe.nativeElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `zoomConfig`', () => {
            expectToBe(isSignal(directive.zoomConfig), true);

            expect(() => directive.zoomConfig()).toThrow();
        });

        it('... should throw due to missing required model signal `zoomValue`', () => {
            expectToBe(isSignal(directive.zoomValue), true);

            expect(() => directive.zoomValue()).toThrow();
        });

        it('... should have input signal `zoomFilter` to hold a default filter that accepts all events', () => {
            expectToBe(isSignal(directive.zoomFilter), true);

            expectToBe(directive.zoomFilter()({ type: 'mousedown' } as MouseEvent), true);
        });

        it('... should have signal `transform` to hold the identity transform', () => {
            expectToBe(isSignal(directive.transform), true);

            expectToEqual(directive.transform(), D3_ZOOM.zoomIdentity);
        });

        it('... should bind the d3 zoom behaviour to the host canvas element', () => {
            expect((canvasEl as any).__zoom).toBeDefined();
            expectToEqual(getCurrentTransform(), D3_ZOOM.zoomIdentity);
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `zoomConfig` to hold the provided config', () => {
            expectToEqual(directive.zoomConfig(), host.zoomConfig());
        });

        it('... should have input signal `zoomFilter` to hold the provided filter', () => {
            expectToBe(directive.zoomFilter(), host.zoomFilter());
        });

        it('... should have model signal `zoomValue` to hold the provided scale', () => {
            expectToBe(directive.zoomValue(), 1);
        });

        it('... should set the scale extent of the zoom behaviour from `zoomConfig`', () => {
            expectToEqual(directive['_zoomBehaviour'].scaleExtent(), [0.1, 10]);
        });

        it('... should update the scale extent when `zoomConfig` changes', () => {
            host.zoomConfig.set(new ZoomConfig(1, 0.5, 3, 0.1));
            fixture.detectChanges();

            expectToEqual(directive['_zoomBehaviour'].scaleExtent(), [0.5, 3]);
        });

        describe('... model `zoomValue`', () => {
            it('... should zoom the canvas to a scale set from outside', () => {
                host.scale.set(2.5);
                fixture.detectChanges();

                expectToBe(getCurrentTransform().k, 2.5);
                expectToBe(directive.transform().k, 2.5);
            });

            it('... should set the rounded scale and the transform on zoom by d3', () => {
                directive['_selection'].call(directive['_zoomBehaviour'].scaleTo, 2.345);

                expectToBe(directive.zoomValue(), 2.35);
                expectToBe(host.scale(), 2.35);
                expectToBe(directive.transform(), getCurrentTransform());
                expectToBe(directive.transform().k, 2.345);
            });

            it('... should not zoom again for a scale set by d3 itself', () => {
                directive['_selection'].call(directive['_zoomBehaviour'].scaleTo, 2.345);
                const scaleToSpy = vi.spyOn(directive['_zoomBehaviour'], 'scaleTo');

                fixture.detectChanges();

                expectSpyCall(scaleToSpy, 0);
                expectToBe(getCurrentTransform().k, 2.345);
            });
        });

        describe('... filter of the zoom behaviour', () => {
            it('... should accept wheel events (also with ctrl key) even if the zoom filter rejects them', () => {
                host.zoomFilter.set(() => false);
                fixture.detectChanges();

                expectToBe(filter({ type: 'wheel', button: 0, ctrlKey: false }), true);
                expectToBe(filter({ type: 'wheel', button: 0, ctrlKey: true }), true);
            });

            it('... should accept primary pointer events that the zoom filter accepts', () => {
                expectToBe(filter({ type: 'mousedown', button: 0, ctrlKey: false }), true);
                expectToBe(filter({ type: 'touchstart', ctrlKey: false }), true);
            });

            it('... should reject pointer events that the zoom filter rejects', () => {
                const zoomFilterSpy = vi.fn(() => false);
                host.zoomFilter.set(zoomFilterSpy);
                fixture.detectChanges();

                const event = { type: 'mousedown', button: 0, ctrlKey: false };

                expectToBe(filter(event), false);
                expectSpyCall(zoomFilterSpy, 1, event);
            });

            it('... should reject secondary buttons and ctrl+drag (d3 default)', () => {
                expectToBe(filter({ type: 'mousedown', button: 2, ctrlKey: false }), false);
                expectToBe(filter({ type: 'mousedown', button: 0, ctrlKey: true }), false);
            });
        });

        describe('METHODS', () => {
            describe('#reset()', () => {
                it('... should have a method `reset`', () => {
                    expect(directive.reset).toBeDefined();
                });

                it('... should reset scale and translation to the initial zoom and the origin', () => {
                    directive['_selection'].call(directive['_zoomBehaviour'].scaleTo, 3);
                    directive['_selection'].call(directive['_zoomBehaviour'].translateBy, 20, 30);

                    directive.reset();

                    expectToEqual(getCurrentTransform(), D3_ZOOM.zoomIdentity.scale(host.zoomConfig().initial));
                    expectToEqual(directive.transform(), D3_ZOOM.zoomIdentity.scale(host.zoomConfig().initial));
                    expectToBe(directive.zoomValue(), host.zoomConfig().initial);
                });
            });

            describe('#zoomToFit()', () => {
                // The given rendered size of the canvas
                const size: CanvasSize = { width: 400, height: 200 };

                it('... should have a method `zoomToFit`', () => {
                    expect(directive.zoomToFit).toBeDefined();
                });

                it('... should zoom out to fit the bounds with padding and center it', () => {
                    // Bounds 780 x 180 plus padding 10: twice as wide as the canvas
                    directive.zoomToFit({ min: { x: -190, y: 10 }, max: { x: 590, y: 190 } }, size, 10);

                    const { k, x, y } = getCurrentTransform();
                    const center = getCurrentTransform().apply([200, 100]);

                    expectToBe(k, 0.5);
                    expectToEqual(center, [200, 100]);
                    expectToEqual([x, y], [100, 50]);
                });

                it('... should not zoom in beyond the initial scale for small bounds', () => {
                    directive.zoomToFit({ min: { x: 100, y: 50 }, max: { x: 140, y: 70 } }, size);

                    const { k } = getCurrentTransform();
                    const center = getCurrentTransform().apply([120, 60]);

                    expectToBe(k, host.zoomConfig().initial);
                    expectToEqual(center, [200, 100]);
                });

                it('... should not zoom out beyond the minimum scale for huge bounds', () => {
                    directive.zoomToFit({ min: { x: 0, y: 0 }, max: { x: 100000, y: 100000 } }, size);

                    expectToBe(getCurrentTransform().k, host.zoomConfig().min);
                });

                it('... should have signal `transform` and model signal `zoomValue` to hold the fitted zoom', () => {
                    directive.zoomToFit({ min: { x: -190, y: 10 }, max: { x: 590, y: 190 } }, size, 10);

                    expectToBe(directive.transform(), getCurrentTransform());
                    expectToBe(directive.zoomValue(), 0.5);
                    expectToBe(host.scale(), 0.5);
                });

                it('... should keep the zoom without a rendered size of the canvas', () => {
                    directive.zoomToFit({ min: { x: -190, y: 10 }, max: { x: 590, y: 190 } }, { width: 0, height: 0 });

                    expectToEqual(getCurrentTransform(), D3_ZOOM.zoomIdentity);
                });
            });
        });
    });
});
