import { Component, DebugElement, isSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import * as D3_ZOOM from 'd3-zoom';

import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { patchSvgSizeForD3Zoom } from '@testing/svg-drawing-helper';

import { ZoomConfig } from './zoom.model';

import { SvgZoomDirective } from './svg-zoom.directive';

@Component({
    template: `
        <svg awgSvgZoom [zoomConfig]="zoomConfig()" [zoomTarget]="target" [(zoomValue)]="scale">
            <g #target />
        </svg>
    `,
    imports: [SvgZoomDirective],
})
class SvgZoomTestHostComponent {
    readonly zoomConfig = signal(new ZoomConfig(1, 0.1, 10, 0.01));
    readonly scale = signal(1);
}

describe('SvgZoomDirective (DONE)', () => {
    let fixture: ComponentFixture<SvgZoomTestHostComponent>;
    let host: SvgZoomTestHostComponent;
    let directive: SvgZoomDirective;
    let svgEl: SVGSVGElement;
    let targetEl: SVGGElement;

    const getDirectiveDes = (): DebugElement[] =>
        getAndExpectDebugElementByDirective(fixture.debugElement, SvgZoomDirective, 1, 1);
    const getCurrentTransform = () => D3_ZOOM.zoomTransform(svgEl);

    beforeAll(() => {
        // Provide width/height.baseVal for d3-zoom (missing in jsdom)
        patchSvgSizeForD3Zoom();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SvgZoomTestHostComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SvgZoomTestHostComponent);
        host = fixture.componentInstance;

        const directiveDe = getDirectiveDes()[0];
        directive = directiveDe.injector.get(SvgZoomDirective);
        svgEl = directiveDe.nativeElement;
        targetEl = svgEl.querySelector('g') as SVGGElement;
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

        it('... should throw due to missing required input signal `zoomTarget`', () => {
            expectToBe(isSignal(directive.zoomTarget), true);

            expect(() => directive.zoomTarget()).toThrow();
        });

        it('... should throw due to missing required model signal `zoomValue`', () => {
            expectToBe(isSignal(directive.zoomValue), true);

            expect(() => directive.zoomValue()).toThrow();
        });

        it('... should bind the d3 zoom behaviour to the host svg element', () => {
            expect((svgEl as any).__zoom).toBeDefined();
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

        it('... should have input signal `zoomTarget` to hold the provided target element', () => {
            expectToBe(directive.zoomTarget(), targetEl);
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
            it('... should zoom the svg to a scale set from outside', () => {
                host.scale.set(2.5);
                fixture.detectChanges();

                expectToBe(getCurrentTransform().k, 2.5);
                expect(targetEl.getAttribute('transform')).toContain('scale(2.5)');
            });

            it('... should set the rounded scale and the target transform on zoom by d3', () => {
                directive['_svg'].call(directive['_zoomBehaviour'].scaleTo, 2.345);

                expectToBe(directive.zoomValue(), 2.35);
                expectToBe(host.scale(), 2.35);
                expect(targetEl.getAttribute('transform')).toContain('scale(2.345)');
            });

            it('... should not zoom again for a scale set by d3 itself', () => {
                directive['_svg'].call(directive['_zoomBehaviour'].scaleTo, 2.345);
                const scaleToSpy = vi.spyOn(directive['_zoomBehaviour'], 'scaleTo');

                fixture.detectChanges();

                expectSpyCall(scaleToSpy, 0);
                expectToBe(getCurrentTransform().k, 2.345);
            });
        });

        describe('METHODS', () => {
            describe('#reset()', () => {
                it('... should have a method `reset`', () => {
                    expect(directive.reset).toBeDefined();
                });

                it('... should reset scale and translation to the initial zoom and the origin', () => {
                    directive['_svg'].call(directive['_zoomBehaviour'].scaleTo, 3);
                    directive['_svg'].call(directive['_zoomBehaviour'].translateBy, 20, 30);

                    directive.reset();

                    expectToEqual(getCurrentTransform(), D3_ZOOM.zoomIdentity.scale(host.zoomConfig().initial));
                    expectToBe(directive.zoomValue(), host.zoomConfig().initial);
                    expectToBe(targetEl.getAttribute('transform'), 'translate(0,0) scale(1)');
                });
            });
        });
    });
});
